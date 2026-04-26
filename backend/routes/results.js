const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { auth, authorize } = require("../middleware/auth");
const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

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

    res.status(201).send(result);
  } catch (error) {
    console.error("POST /results error:", error);
    res.status(400).send(error);
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

      await result.destroy();
      res.send({ message: "Result deleted successfully" });
    } catch (error) {
      console.error("DELETE /results/:id error:", error);
      res.status(500).send(error);
    }
  },
);

module.exports = router;
