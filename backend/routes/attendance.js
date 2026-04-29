const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { auth, authorize } = require("../middleware/auth");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const { sendAttendanceAlert } = require("../utils/emailService");
const logger = require("../utils/logger");

// GET all attendance for a class on a given date
// GET /api/attendance/class/:class?date=YYYY-MM-DD
router.get(
  "/class/:class",
  auth,
  authorize(["ADMIN", "TEACHER"]),
  async (req, res) => {
    try {
      const studentClass = req.params.class;
      const { date } = req.query;

      if (!date) {
        return res
          .status(400)
          .send({ error: 'Query parameter "date" (YYYY-MM-DD) is required' });
      }

      // Find all students in this class
      const students = await Student.findAll({ where: { studentClass } });
      const studentIds = students.map((s) => s.id);

      // Find all attendance records for those students on that date
      const records = await Attendance.findAll({
        where: {
          StudentId: { [Op.in]: studentIds },
          date,
        },
        include: [{ model: Student }],
      });

      res.send(records);
    } catch (error) {
      console.error("Get class attendance error:", error);
      res.status(500).send({ error: "Failed to fetch class attendance" });
    }
  },
);

// GET attendance for a single student
router.get("/student/:studentId", auth, async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "PARENT") {
      const student = await Student.findOne({
        where: { id: studentId, parentId: req.user.id },
      });
      if (!student)
        return res.status(403).send({ error: "Unauthorized access" });
    }

    const attendance = await Attendance.findAll({
      where: { StudentId: studentId },
    });
    res.send(attendance);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST - create or update attendance (upsert by StudentId + date)
router.post("/", auth, authorize(["ADMIN", "TEACHER"]), async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res
        .status(400)
        .send({ error: "studentId, date, and status are required" });
    }

    // Check if a record already exists for this student on this date
    const existing = await Attendance.findOne({
      where: { StudentId: studentId, date },
    });

    if (existing) {
      // Update the existing record's status
      existing.status = status;
      await existing.save();
      return res.send(existing);
    }

    // Create a new record
    const attendance = await Attendance.create({
      StudentId: studentId,
      date,
      status,
    });

    res.status(201).send(attendance);
  } catch (error) {
    console.error("Attendance upsert error:", error);
    res.status(400).send({ error: "Failed to save attendance" });
  }
});

// POST /check-alerts - Check attendance and send alerts for low attendance
router.post(
  "/check-alerts",
  auth,
  authorize(["ADMIN", "TEACHER"]),
  async (req, res) => {
    try {
      const { studentClass, attendanceThreshold = 75 } = req.body;

      if (!studentClass) {
        return res.status(400).send({
          error: "Class is required",
        });
      }

      // Get all students in the class
      const students = await Student.findAll({
        where: { studentClass },
        include: ["parent"], // Include parent relationship
      });

      if (students.length === 0) {
        return res.status(404).send({
          error: "No students found in this class",
        });
      }

      let alertsSent = 0;
      let alertsFailed = 0;
      const lowAttendanceStudents = [];

      // Check attendance for each student
      for (const student of students) {
        try {
          // Count total attendance records
          const totalRecords = await Attendance.count({
            where: { StudentId: student.id },
          });

          if (totalRecords === 0) continue; // Skip if no attendance records

          // Count present days
          const presentDays = await Attendance.count({
            where: {
              StudentId: student.id,
              status: "PRESENT",
            },
          });

          const attendancePercentage = (presentDays / totalRecords) * 100;

          // Send alert if attendance is below threshold
          if (attendancePercentage < attendanceThreshold) {
            lowAttendanceStudents.push({
              student: student.firstName + " " + student.lastName,
              percentage: attendancePercentage,
              presentDays,
              totalDays: totalRecords,
            });

            // Send email alert to parent if email is configured
            if (
              student.parent &&
              student.parent.email &&
              process.env.EMAIL_USER &&
              process.env.EMAIL_PASSWORD
            ) {
              try {
                await sendAttendanceAlert(
                  student.parent.email,
                  student.firstName + " " + student.lastName,
                  attendancePercentage,
                  studentClass
                );
                alertsSent++;
                logger.info(
                  `Attendance alert sent to parent: ${student.parent.email}`
                );
              } catch (emailError) {
                alertsFailed++;
                logger.warn(
                  `Failed to send attendance alert to ${student.parent.email}: ${emailError.message}`
                );
              }
            }
          }
        } catch (studentError) {
          logger.error(
            `Error checking attendance for student ${student.id}: ${studentError.message}`
          );
        }
      }

      res.json({
        message: "Attendance check completed",
        class: studentClass,
        attendanceThreshold,
        lowAttendanceCount: lowAttendanceStudents.length,
        alertsSent,
        alertsFailed,
        lowAttendanceStudents,
      });
    } catch (error) {
      console.error("Check attendance alerts error:", error);
      res.status(500).send({ error: "Failed to check attendance alerts" });
    }
  }
);

// GET /student/:studentId/percentage - Get attendance percentage for a student
router.get(
  "/student/:studentId/percentage",
  auth,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      // Verify access (parent can only view their own child's attendance)
      if (req.user.role === "PARENT") {
        const student = await Student.findOne({
          where: { id: studentId, parentId: req.user.id },
        });
        if (!student) {
          return res.status(403).send({ error: "Unauthorized access" });
        }
      }

      // Count total attendance records
      const totalRecords = await Attendance.count({
        where: { StudentId: studentId },
      });

      if (totalRecords === 0) {
        return res.json({ percentage: 0, totalDays: 0, presentDays: 0 });
      }

      // Count present days
      const presentDays = await Attendance.count({
        where: {
          StudentId: studentId,
          status: "PRESENT",
        },
      });

      const percentage = (presentDays / totalRecords) * 100;

      res.json({
        percentage: parseFloat(percentage.toFixed(2)),
        totalDays: totalRecords,
        presentDays,
      });
    } catch (error) {
      console.error("Get attendance percentage error:", error);
      res.status(500).send({ error: "Failed to fetch attendance percentage" });
    }
  }
);

// POST /batch - batch update attendance for a class
router.post(
  "/batch",
  auth,
  authorize(["ADMIN", "TEACHER"]),
  async (req, res) => {
    try {
      const { date, records } = req.body;
      if (!date || !Array.isArray(records)) {
        return res.status(400).send({ error: "date and records array are required" });
      }

      const results = [];
      for (const record of records) {
        const { studentId, status } = record;
        if (!studentId || !status) continue;

        const existing = await Attendance.findOne({
          where: { StudentId: studentId, date },
        });

        if (existing) {
          existing.status = status;
          await existing.save();
          results.push(existing);
        } else {
          const newRecord = await Attendance.create({
            StudentId: studentId,
            date,
            status,
          });
          results.push(newRecord);
        }
      }

      res.status(200).send(results);
    } catch (error) {
      console.error("Batch attendance error:", error);
      res.status(500).send({ error: "Failed to process batch attendance" });
    }
  }
);

module.exports = router;
