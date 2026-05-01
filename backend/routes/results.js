const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { auth, authorize } = require("../middleware/auth");
const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const { sendResultsNotification } = require("../utils/emailService");
const logger = require("../utils/logger");
const { logActivity } = require("../utils/activityTracker");

// ---------- helpers ----------
const calculateGrade = (total) => {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
};

// ---------- POST / — create or update (upsert) ----------
router.post("/", auth, authorize(["ADMIN", "TEACHER"]), async (req, res) => {
  try {
    const {
      studentId,
      subjectId,
      term,
      academicYear,
      ca1Score,
      ca2Score,
      examScore,
      remark,
    } = req.body;

    const ca1 = parseFloat(ca1Score) || 0;
    const ca2 = parseFloat(ca2Score) || 0;
    const exam = parseFloat(examScore) || 0;

    const totalScore = ca1 + ca2 + exam;
    const averageScore = totalScore; // total IS the score out of 100
    const grade = calculateGrade(totalScore);

    // Check for an existing record with the same composite key
    const existing = await Result.findOne({
      where: {
        StudentId: studentId,
        SubjectId: subjectId,
        term,
        academicYear,
      },
    });

    if (existing) {
      // Update in place instead of creating a duplicate
      await existing.update({
        ca1Score: ca1,
        ca2Score: ca2,
        examScore: exam,
        totalScore,
        averageScore,
        grade,
        remark: remark !== undefined ? remark : existing.remark,
      });

      // Log update activity for teachers
      if (req.user.role === "TEACHER") {
        try {
          await logActivity(
            req.user.id,
            "UPDATE_RESULT",
            `Updated result for student ${studentId} in subject ${subjectId}`,
            req,
            `Result ID: ${existing.id}`,
            "MEDIUM"
          );
        } catch (error) {
          logger.warn(`Failed to log activity: ${error.message}`);
        }
      }

      return res.send(existing);
    }

    const result = await Result.create({
      StudentId: studentId,
      SubjectId: subjectId,
      term,
      academicYear,
      ca1Score: ca1,
      ca2Score: ca2,
      examScore: exam,
      totalScore,
      averageScore,
      grade,
      remark,
    });

    // Log create activity for teachers
    if (req.user.role === "TEACHER") {
      try {
        await logActivity(
          req.user.id,
          "CREATE_RESULT",
          `Created result for student ${studentId} in subject ${subjectId}`,
          req,
          `Result ID: ${result.id}`,
          "MEDIUM"
        );
      } catch (error) {
        logger.warn(`Failed to log activity: ${error.message}`);
      }
    }

    res.status(201).send(result);
  } catch (error) {
    console.error("POST /results error:", error);
    res.status(400).send(error);
  }
});

// ---------- GET / — list results for a class (Form Teacher view) ----------
router.get("/", auth, authorize(["ADMIN", "TEACHER"]), async (req, res) => {
  try {
    const { studentClass, term, academicYear } = req.query;

    let where = {};
    if (term) where.term = term;
    if (academicYear) where.academicYear = academicYear;

    let studentWhere = {};
    if (studentClass) studentWhere.studentClass = studentClass;

    const results = await Result.findAll({
      where,
      include: [
        {
          model: Student,
          where: studentWhere,
          required: true,
        },
      ],
    });

    res.send(results);
  } catch (error) {
    console.error("GET /results error:", error);
    res.status(500).send({ error: "Failed to fetch results" });
  }
});

// ---------- GET /student/:studentId ----------
router.get("/student/:studentId", auth, async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "PARENT") {
      const student = await Student.findOne({
        where: { id: studentId, parentId: req.user.id },
      });
      if (!student)
        return res
          .status(403)
          .send({ error: "Unauthorized access to student results" });

      if (!student.resultsReleased) {
        return res.send([]);
      }
    }

    const results = await Result.findAll({
      where: { StudentId: studentId },
      include: [Subject],
    });
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ---------- GET /broadsheet ----------
router.get(
  "/broadsheet",
  auth,
  authorize(["ADMIN", "TEACHER"]),
  async (req, res) => {
    try {
      const { studentClass, term, academicYear } = req.query;

      if (!studentClass || !term || !academicYear) {
        return res
          .status(400)
          .send({ error: "Class, term, and academic year are required" });
      }

      const students = await Student.findAll({
        where: { studentClass },
        include: [
          {
            model: Result,
            where: { term, academicYear },
            required: false,
            include: [Subject],
          },
        ],
        order: [
          ["lastName", "ASC"],
          ["firstName", "ASC"],
        ],
      });

      res.send(students);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

// ---------- PATCH /:id — update a result ----------
router.patch(
  "/:id",
  auth,
  authorize(["ADMIN", "TEACHER"]),
  async (req, res) => {
    try {
      const result = await Result.findByPk(req.params.id);
      if (!result) return res.status(404).send({ error: "Result not found" });

      const { ca1Score, ca2Score, examScore, remark, term, academicYear } =
        req.body;

      const ca1 =
        ca1Score !== undefined ? parseFloat(ca1Score) : result.ca1Score;
      const ca2 =
        ca2Score !== undefined ? parseFloat(ca2Score) : result.ca2Score;
      const exam =
        examScore !== undefined ? parseFloat(examScore) : result.examScore;

      const totalScore = ca1 + ca2 + exam;
      const averageScore = totalScore; // total IS the score out of 100
      const grade = calculateGrade(totalScore);

      await result.update({
        ca1Score: ca1,
        ca2Score: ca2,
        examScore: exam,
        totalScore,
        averageScore,
        grade,
        ...(remark !== undefined && { remark }),
        ...(term !== undefined && { term }),
        ...(academicYear !== undefined && { academicYear }),
      });

      res.send(result);
    } catch (error) {
      console.error("PATCH /results/:id error:", error);
      res.status(400).send(error);
    }
  },
);

// ---------- DELETE /:id ----------
router.delete(
  "/:id",
  auth,
  authorize(["ADMIN", "TEACHER"]),
  async (req, res) => {
    try {
      const result = await Result.findByPk(req.params.id);
      if (!result) return res.status(404).send({ error: "Result not found" });

      const resultId = result.id;
      const studentId = result.StudentId;
      const subjectId = result.SubjectId;

      await result.destroy();

      // Log delete activity for teachers
      if (req.user.role === "TEACHER") {
        try {
          await logActivity(
            req.user.id,
            "DELETE_RESULT",
            `Deleted result for student ${studentId} in subject ${subjectId}`,
            req,
            `Result ID: ${resultId}`,
            "HIGH"
          );
        } catch (error) {
          logger.warn(`Failed to log activity: ${error.message}`);
        }
      }

      res.send({ message: "Result deleted successfully" });
    } catch (error) {
      console.error("DELETE /results/:id error:", error);
      res.status(500).send(error);
    }
  },
);

// ---------- POST /release-results — Release results and send notifications ----------
router.post(
  "/release-results",
  auth,
  authorize(["ADMIN", "TEACHER"]),
  async (req, res) => {
    try {
      const { studentClass, term, academicYear } = req.body;

      if (!studentClass || !term || !academicYear) {
        return res.status(400).send({
          error: "Class, term, and academic year are required",
        });
      }

      // Get all students in the class
      const students = await Student.findAll({
        where: { studentClass },
        include: [
          {
            model: Result,
            where: { term, academicYear },
            required: true,
            include: [Subject],
          },
        ],
      });

      if (students.length === 0) {
        return res.status(404).send({
          error: "No students with results found in this class",
        });
      }

      let emailsSent = 0;
      let emailsFailed = 0;

      // Send notifications to parents and update results released flag
      for (const student of students) {
        if (student.parent && student.parent.email && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
          try {
            const resultsLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/results`;
            await sendResultsNotification(
              student.parent.email,
              student.parent.fullName,
              studentClass,
              resultsLink
            );
            emailsSent++;
            logger.info(
              `Results notification sent to parent: ${student.parent.email}`
            );
          } catch (emailError) {
            emailsFailed++;
            logger.warn(
              `Failed to send results notification to ${student.parent.email}: ${emailError.message}`
            );
          }
        }
      }

      // Update results released flag for all students in the class
      await Student.update(
        { resultsReleased: true },
        { where: { studentClass } }
      );

      res.json({
        message: "Results released successfully",
        studentsCount: students.length,
        emailsSent,
        emailsFailed,
        class: studentClass,
        term,
        academicYear,
      });
    } catch (error) {
      console.error("POST /release-results error:", error);
      res.status(500).send(error);
    }
  }
);

module.exports = router;
