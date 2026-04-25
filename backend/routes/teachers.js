const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Register a new teacher (Admin only)
router.post('/register', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const { fullName, email, isFormTeacher, isSubjectTeacher, assignedClass, assignedSubject } = req.body;

    // Generate username from full name (lowercase, no spaces) + random suffix
    const baseUsername = fullName.toLowerCase().replace(/\s+/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const username = `teacher_${baseUsername}${randomSuffix}`;

    // Generate random 8-character password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 8);

    const teacher = await User.create({
      username,
      password: hashedPassword,
      fullName,
      email,
      role: 'TEACHER',
      isFormTeacher: !!isFormTeacher,
      isSubjectTeacher: !!isSubjectTeacher,
      assignedClass,
      assignedSubject
    });

    res.status(201).send({
      teacher: {
        id: teacher.id,
        username: teacher.username,
        fullName: teacher.fullName,
        role: teacher.role,
        isFormTeacher: teacher.isFormTeacher,
        isSubjectTeacher: teacher.isSubjectTeacher,
        assignedClass: teacher.assignedClass,
        assignedSubject: teacher.assignedSubject
      },
      credentials: {
        username,
        password
      }
    });
  } catch (error) {
    console.error('Teacher registration error:', error);
    res.status(400).send({ error: 'Failed to register teacher' });
  }
});

// Get all teachers (Admin only)
router.get('/', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: 'TEACHER' },
      attributes: ['id', 'username', 'fullName', 'isFormTeacher', 'isSubjectTeacher', 'assignedClass', 'assignedSubject', 'createdAt']
    });
    res.send(teachers);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch teachers' });
  }
});

// Update a teacher (Admin only)
router.patch('/:id', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const { fullName, email, isFormTeacher, isSubjectTeacher, assignedClass, assignedSubject } = req.body;
    const teacher = await User.findOne({ where: { id: req.params.id, role: 'TEACHER' } });

    if (!teacher) {
      return res.status(404).send({ error: 'Teacher not found' });
    }

    if (fullName) teacher.fullName = fullName;
    if (email) teacher.email = email;
    if (isFormTeacher !== undefined) teacher.isFormTeacher = isFormTeacher;
    if (isSubjectTeacher !== undefined) teacher.isSubjectTeacher = isSubjectTeacher;
    if (assignedClass !== undefined) teacher.assignedClass = assignedClass;
    if (assignedSubject !== undefined) teacher.assignedSubject = assignedSubject;

    await teacher.save();
    res.send(teacher);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update teacher' });
  }
});

// Delete a teacher (Admin only)
router.delete('/:id', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const teacher = await User.findOne({ where: { id: req.params.id, role: 'TEACHER' } });

    if (!teacher) {
      return res.status(404).send({ error: 'Teacher not found' });
    }

    await teacher.destroy();
    res.send({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete teacher' });
  }
});

module.exports = router;
