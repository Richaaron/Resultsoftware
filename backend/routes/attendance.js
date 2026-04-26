const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { auth, authorize } = require("../middleware/auth");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

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

module.exports = router;
