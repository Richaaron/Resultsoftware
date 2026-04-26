const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Result = require('../models/Result');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

router.post('/', auth, authorize(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { studentId, subjectId, term, academicYear, ca1Score, ca2Score, examScore, remark } = req.body;
    
    const ca1 = parseFloat(ca1Score) || 0;
    const ca2 = parseFloat(ca2Score) || 0;
    const exam = parseFloat(examScore) || 0;
    
    const totalScore = ca1 + ca2 + exam;
    const averageScore = totalScore / 3; // Average of CA1, CA2, and Exam

    const calculateGrade = (total) => {
      if (total >= 70) return "A";
      if (total >= 60) return "B";
      if (total >= 50) return "C";
      if (total >= 45) return "D";
      if (total >= 40) return "E";
      return "F";
    };

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
      grade: calculateGrade(totalScore),
      remark
    });

    res.status(201).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Check if parent is viewing their own child
    if (req.user.role === 'PARENT') {
      const student = await Student.findOne({ where: { id: studentId, parentId: req.user.id } });
      if (!student) return res.status(403).send({ error: 'Unauthorized access to student results' });
      
      if (!student.resultsReleased) {
        return res.send([]); // Return empty array if results are not released yet
      }
    }

    const results = await Result.findAll({ 
      where: { StudentId: studentId },
      include: [Subject]
    });
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/broadsheet', auth, authorize(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { studentClass, term, academicYear } = req.query;

    if (!studentClass || !term || !academicYear) {
      return res.status(400).send({ error: 'Class, term, and academic year are required' });
    }

    const students = await Student.findAll({
      where: { studentClass },
      include: [
        {
          model: Result,
          where: { term, academicYear },
          required: false,
          include: [Subject]
        }
      ],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']]
    });

    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
