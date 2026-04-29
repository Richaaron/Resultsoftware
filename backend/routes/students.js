const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { auth, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const Student = require('../models/Student');
const User = require('../models/User');
const Subject = require('../models/Subject');
const logger = require('../utils/logger');
const { sendWelcomeEmail } = require('../utils/emailService');

// Create student with auto-generated parent account
router.post('/', auth, authorize(['ADMIN', 'TEACHER']), validate(schemas.createStudent), asyncHandler(async (req, res) => {
  const { firstName, lastName, studentClass, section, subjectIds, profileImage, parentEmail, feesPaid } = req.body;

  // Auto-generate registration number with fvs + random 4-digit number
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const registrationNumber = `fvs${randomNumber}`;

  // Check if student already exists (unlikely but safeguard)
  const existing = await Student.findOne({ where: { registrationNumber } });
  if (existing) {
    return res.status(409).json({ error: 'Failed to generate unique registration number, please try again' });
  }

  // Generate secure password for parent
  const parentPassword = crypto.randomBytes(8).toString('hex').slice(0, 12);
  const hashedPassword = await bcrypt.hash(parentPassword, 10);

  const parent = await User.create({
    username: `parent_${registrationNumber}`,
    password: hashedPassword,
    fullName: `Parent of ${firstName} ${lastName}`,
    email: parentEmail || null,
    role: 'PARENT'
  });

  const student = await Student.create({
    firstName,
    lastName,
    registrationNumber,
    studentClass,
    section,
    profileImage,
    parentId: parent.id,
    feesPaid: feesPaid === true
  });

  if (subjectIds && Array.isArray(subjectIds) && subjectIds.length > 0) {
    await student.setSubjects(subjectIds);
  }

  // Send welcome email to parent if email is provided and notifications are enabled
  if (parentEmail && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    try {
      await sendWelcomeEmail(parentEmail, `Parent of ${firstName} ${lastName}`, parentPassword, `parent_${registrationNumber}`);
      logger.info(`Welcome email sent to parent: ${parentEmail}`);
    } catch (emailError) {
      logger.warn(`Failed to send welcome email to parent ${parentEmail}: ${emailError.message}`);
      // Don't fail the student creation if email fails
    }
  }

  logger.info({ studentId: student.id, registrationNumber, action: 'student_created' });

  res.status(201).json({ 
    student, 
    parentCredentials: { 
      username: `parent_${registrationNumber}`, 
      password: parentPassword,
      email: parentEmail || 'Not provided',
      note: 'Share these credentials with the parent securely'
    } 
  });
}));

// Get all students
router.get('/', auth, authorize(['ADMIN', 'TEACHER']), asyncHandler(async (req, res) => {
  const { studentClass, subjectName } = req.query;
  let where = {};
  let include = [{ model: Subject }];

  if (studentClass) {
    where.studentClass = studentClass;
  }

  if (subjectName) {
    include = [{
      model: Subject,
      where: { name: subjectName },
      required: true
    }];
  }

  const students = await Student.findAll({ where, include, order: [['lastName', 'ASC'], ['firstName', 'ASC']] });
  res.json(students);
}));

// Get students assigned to parent
router.get('/parent', auth, authorize(['PARENT']), asyncHandler(async (req, res) => {
  const students = await Student.findAll({ 
    where: { parentId: req.user.id },
    include: [{ model: Subject }]
  });
  res.json(students);
}));

// Get all subjects
router.get('/subjects', auth, asyncHandler(async (req, res) => {
  const subjects = await Subject.findAll({ order: [['category', 'ASC'], ['name', 'ASC']] });
  res.json(subjects);
}));

// Create new subject
router.post('/subjects', auth, authorize(['ADMIN']), asyncHandler(async (req, res) => {
  const { name, category, level, section } = req.body;
  
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  const subject = await Subject.create({ name, category, level, section: section || null });
  res.status(201).json(subject);
}));

// Release/hold results for students
router.patch('/release-results', auth, authorize(['ADMIN', 'TEACHER']), asyncHandler(async (req, res) => {
  const { studentIds, released } = req.body;
  
  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ error: 'studentIds must be a non-empty array' });
  }

  await Student.update(
    { resultsReleased: released === true },
    { where: { id: studentIds } }
  );

  res.json({ 
    message: `Results ${released ? 'released' : 'held'} for ${studentIds.length} students` 
  });
}));

// Update fee status for students
router.patch('/update-fees', auth, authorize(['ADMIN']), asyncHandler(async (req, res) => {
  const { studentIds, feesPaid } = req.body;
  
  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ error: 'studentIds must be a non-empty array' });
  }

  await Student.update(
    { feesPaid: feesPaid === true },
    { where: { id: studentIds } }
  );

  res.json({ 
    message: `Fee status updated for ${studentIds.length} students` 
  });
}));

// Update student
router.patch('/:id', auth, authorize(['ADMIN', 'TEACHER']), asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const { firstName, lastName, studentClass, section, subjectIds, profileImage, parentEmail, feesPaid } = req.body;

  await student.update({ 
    ...(firstName && { firstName }), 
    ...(lastName && { lastName }), 
    ...(studentClass && { studentClass }),
    ...(section && { section }),
    ...(profileImage && { profileImage }),
    ...(parentEmail && { parentEmail }),
    ...(feesPaid !== undefined && { feesPaid })
  });

  // Update parent's email if provided
  if (parentEmail && student.parentId) {
    await User.update({ email: parentEmail }, { where: { id: student.parentId } });
  }

  if (Array.isArray(subjectIds)) {
    await student.setSubjects(subjectIds);
  }

  res.json(student);
}));

// Delete student
router.delete('/:id', auth, authorize(['ADMIN']), asyncHandler(async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Delete parent account if exists
  if (student.parentId) {
    await User.destroy({ where: { id: student.parentId } });
  }

  await student.destroy();
  logger.info({ studentId: student.id, action: 'student_deleted' });

  res.json({ message: 'Student deleted successfully' });
}));

// Update subject
router.patch('/subjects/:id', auth, authorize(['ADMIN']), asyncHandler(async (req, res) => {
  const { name, category, level } = req.body;
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }

  await subject.update({ name, category, level });
  res.json(subject);
}));

// Delete subject
router.delete('/subjects/:id', auth, authorize(['ADMIN']), asyncHandler(async (req, res) => {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }

  await subject.destroy();
  res.json({ message: 'Subject deleted successfully' });
}));

module.exports = router;

module.exports = router;
