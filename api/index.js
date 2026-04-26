require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sequelize = require('../backend/utils/db');
const User = require('../backend/models/User');
const Subject = require('../backend/models/Subject');
require('../backend/models/StudentSubject');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://resultsoftware.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/students', require('../backend/routes/students'));
app.use('/api/results', require('../backend/routes/results'));
app.use('/api/attendance', require('../backend/routes/attendance'));
app.use('/api/teachers', require('../backend/routes/teachers'));
app.use('/api/settings', require('../backend/routes/settings'));

const { auth, authorize } = require('../backend/middleware/auth');

app.get('/api/stats', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const studentCount = await require('../backend/models/Student').count();
    const teacherCount = await User.count({ where: { role: 'TEACHER' } });
    const subjectCount = await Subject.count();
    res.send({ studentCount, teacherCount, subjectCount });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Database initialization endpoint
app.post('/api/init', async (req, res) => {
  try {
    await sequelize.sync({ alter: true });
    await seedData();
    console.log('Database initialized successfully');
    res.json({ message: 'Database initialized successfully', status: 'success' });
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ message: 'Database initialization failed', error: error.message });
  }
});

// Debug endpoint
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.findAll({ 
      attributes: ['id', 'username', 'fullName', 'role', 'createdAt']
    });
    res.json({ 
      count: users.length, 
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const seedData = async () => {
  try {
    const hashedAdminPassword = await bcrypt.hash('admin123', 8);
    const [adminUser, adminCreated] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        password: hashedAdminPassword,
        fullName: 'System Administrator',
        role: 'ADMIN',
        isFormTeacher: false,
        isSubjectTeacher: true
      }
    });
    
    if (!adminCreated) {
      await adminUser.update({ password: hashedAdminPassword });
      console.log('Seed: Admin password updated.');
    } else {
      console.log('Seed: Admin user created.');
    }

    const hashedTeacherPassword = await bcrypt.hash('teacher123', 8);
    const [teacherUser, teacherCreated] = await User.findOrCreate({
      where: { username: 'teacher' },
      defaults: {
        password: hashedTeacherPassword,
        fullName: 'John Doe',
        role: 'TEACHER',
        isFormTeacher: false,
        isSubjectTeacher: true
      }
    });
    
    if (!teacherCreated) {
      await teacherUser.update({ password: hashedTeacherPassword });
      console.log('Seed: Teacher password updated.');
    } else {
      console.log('Seed: Teacher user created.');
    }

    const subjectCount = await Subject.count();
    if (subjectCount === 0) {
      const subjects = [
        { name: 'Literacy', category: 'Nursery', level: 'Beginner' },
        { name: 'Numeracy', category: 'Nursery', level: 'Beginner' },
        { name: 'Phonics', category: 'Nursery', level: 'Beginner' },
        { name: 'Rhymes', category: 'Nursery', level: 'Beginner' },
        { name: 'Creative Arts', category: 'Nursery', level: 'Beginner' },
        { name: 'English Language', category: 'Primary', level: 'General' },
        { name: 'Mathematics', category: 'Primary', level: 'General' },
        { name: 'Basic Science', category: 'Primary', level: 'General' },
        { name: 'Social Studies', category: 'Primary', level: 'General' },
        { name: 'Civic Education', category: 'Primary', level: 'General' },
        { name: 'Agricultural Science', category: 'Primary', level: 'General' },
        { name: 'Home Economics', category: 'Primary', level: 'General' },
        { name: 'Physical & Health Education', category: 'Primary', level: 'General' },
        { name: 'Information Technology', category: 'Primary', level: 'General' }
      ];
      await Subject.bulkCreate(subjects);
      console.log('Seed: Subjects added.');
    }
  } catch (error) {
    console.error('Seed data error:', error);
  }
};

// Initialize on startup
sequelize.sync({ alter: true }).then(() => {
  seedData();
  console.log('Database initialized on startup');
}).catch(err => {
  console.error('Database sync error:', err);
});

module.exports = app;
