const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const User = require('../models/User');
const Subject = require('../models/Subject');

router.post('/', auth, authorize(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { firstName, lastName, registrationNumber, studentClass, subjectIds } = req.body;

    // Create automated parent account
    const parentUsername = `parent_${registrationNumber}`;
    const parentPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(parentPassword, 8);

    const parent = await User.create({
      username: parentUsername,
      password: hashedPassword,
      fullName: `Parent of ${firstName} ${lastName}`,
      role: 'PARENT'
    });

    const student = await Student.create({
      firstName,
      lastName,
      registrationNumber,
      studentClass,
      parentId: parent.id
    });

    if (subjectIds && subjectIds.length > 0) {
      await student.setSubjects(subjectIds);
    }

    res.status(201).send({ 
      student, 
      parentCredentials: { username: parentUsername, password: parentPassword } 
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', auth, authorize(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const students = await Student.findAll({ include: [{ model: Subject }] });
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/parent', auth, authorize(['PARENT']), async (req, res) => {
  try {
    const students = await Student.findAll({ 
      where: { parentId: req.user.id },
      include: [{ model: Subject }]
    });
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/subjects', auth, async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.send(subjects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add a new subject (Admin only)
router.post('/subjects', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const subject = await Subject.create({ name, category, level });
    res.status(201).send(subject);
  } catch (error) {
    res.status(400).send({ error: 'Failed to create subject' });
  }
});

// Update student (Admin/Teacher)
router.patch('/release-results', auth, authorize(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { studentIds, released } = req.body;
    if (!Array.isArray(studentIds)) {
      return res.status(400).send({ error: 'studentIds must be an array' });
    }
    await Student.update(
      { resultsReleased: released },
      { where: { id: studentIds } }
    );
    res.send({ message: `Results ${released ? 'released' : 'held'} for ${studentIds.length} students` });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/:id', auth, authorize(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { firstName, lastName, studentClass, subjectIds } = req.body;
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).send({ error: 'Student not found' });

    await student.update({ firstName, lastName, studentClass });
    
    if (subjectIds) {
      await student.setSubjects(subjectIds);
    }

    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete student (Admin only)
router.delete('/:id', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).send({ error: 'Student not found' });
    
    // Also delete the associated parent account
    if (student.parentId) {
      await User.destroy({ where: { id: student.parentId } });
    }
    
    await student.destroy();
    res.send({ message: 'Student and parent account deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update subject (Admin only)
router.patch('/subjects/:id', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const { name, category, level } = req.body;
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).send({ error: 'Subject not found' });

    await subject.update({ name, category, level });
    res.send(subject);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete subject (Admin only)
router.delete('/subjects/:id', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).send({ error: 'Subject not found' });

    await subject.destroy();
    res.send({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
