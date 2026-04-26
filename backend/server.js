require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sequelize = require('./utils/db');
const User = require('./models/User');
const Subject = require('./models/Subject');
require('./models/StudentSubject'); // Initialize many-to-many relationship

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://resultsoftware.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/results', require('./routes/results'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/settings', require('./routes/settings'));

const { auth, authorize } = require('./middleware/auth');

app.get('/api/stats', auth, authorize(['ADMIN']), async (req, res) => {
  try {
    const studentCount = await require('./models/Student').count();
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
    if (dbInitialized) {
      return res.json({ message: 'Database already initialized', status: 'ok' });
    }

    // Attempt to sync database
    await sequelize.sync({ alter: true });
    
    // Run seed data
    await seedData();
    
    dbInitialized = true;
    console.log('Database initialized successfully');
    res.json({ message: 'Database initialized successfully', status: 'success' });
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ message: 'Database initialization failed', error: error.message });
  }
});

// Debug endpoint - check database users
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.findAll({ 
      attributes: ['id', 'username', 'fullName', 'role', 'createdAt']
    });
    res.json({ 
      count: users.length, 
      users: users,
      dbInitialized: dbInitialized
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

// Database initialization flag
let dbInitialized = false;

const seedData = async () => {
  try {
    // Ensure admin user exists with correct password
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
    
    // Update password if user already existed
    if (!adminCreated) {
      await adminUser.update({ password: hashedAdminPassword });
      console.log('Seed: Admin password updated.');
    } else {
      console.log('Seed: Admin user created.');
    }

    // Ensure teacher user exists
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
    
    // Update password if user already existed
    if (!teacherCreated) {
      await teacherUser.update({ password: hashedTeacherPassword });
      console.log('Seed: Teacher password updated.');
    } else {
      console.log('Seed: Teacher user created.');
    }

    // Add subjects if none exist
    const subjectCount = await Subject.count();
    if (subjectCount === 0) {
      const subjects = [
      // Pre-Nursery/Nursery
      { name: 'Literacy', category: 'Nursery', level: 'Beginner' },
      { name: 'Numeracy', category: 'Nursery', level: 'Beginner' },
      { name: 'Phonics', category: 'Nursery', level: 'Beginner' },
      { name: 'Rhymes', category: 'Nursery', level: 'Beginner' },
      { name: 'Creative Arts', category: 'Nursery', level: 'Beginner' },
      
      // Primary
      { name: 'English Language', category: 'Primary', level: 'General' },
      { name: 'Mathematics', category: 'Primary', level: 'General' },
      { name: 'Basic Science', category: 'Primary', level: 'General' },
      { name: 'Social Studies', category: 'Primary', level: 'General' },
      { name: 'Civic Education', category: 'Primary', level: 'General' },
      { name: 'Agricultural Science', category: 'Primary', level: 'General' },
      { name: 'Home Economics', category: 'Primary', level: 'General' },
      { name: 'Physical & Health Education', category: 'Primary', level: 'General' },
      { name: 'Information Technology', category: 'Primary', level: 'General' },
      
      // Junior Secondary
      { name: 'English Language', category: 'Secondary', level: 'Junior' },
      { name: 'Mathematics', category: 'Secondary', level: 'Junior' },
      { name: 'Basic Science', category: 'Secondary', level: 'Junior' },
      { name: 'Basic Technology', category: 'Secondary', level: 'Junior' },
      { name: 'Social Studies', category: 'Secondary', level: 'Junior' },
      { name: 'Civic Education', category: 'Secondary', level: 'Junior' },
      { name: 'Business Studies', category: 'Secondary', level: 'Junior' },
      { name: 'Agricultural Science', category: 'Secondary', level: 'Junior' },
      { name: 'Physical & Health Education', category: 'Secondary', level: 'Junior' },
      
      // Senior Secondary
      { name: 'English Language', category: 'Secondary', level: 'Senior' },
      { name: 'Mathematics', category: 'Secondary', level: 'Senior' },
      { name: 'Biology', category: 'Secondary', level: 'Senior' },
      { name: 'Chemistry', category: 'Secondary', level: 'Senior' },
      { name: 'Physics', category: 'Secondary', level: 'Senior' },
      { name: 'Further Mathematics', category: 'Secondary', level: 'Senior' },
      { name: 'Economics', category: 'Secondary', level: 'Senior' },
      { name: 'Government', category: 'Secondary', level: 'Senior' },
      { name: 'Geography', category: 'Secondary', level: 'Senior' },
      { name: 'Literature in English', category: 'Secondary', level: 'Senior' },
      { name: 'Christian Religious Studies', category: 'Secondary', level: 'Senior' },
      { name: 'Islamic Religious Studies', category: 'Secondary', level: 'Senior' },
      { name: 'Yoruba Language', category: 'Secondary', level: 'Senior' },
      { name: 'Igbo Language', category: 'Secondary', level: 'Senior' },
      { name: 'Hausa Language', category: 'Secondary', level: 'Senior' },
      { name: 'Financial Accounting', category: 'Secondary', level: 'Senior' },
      { name: 'Commerce', category: 'Secondary', level: 'Senior' }
    ];
    await Subject.bulkCreate(subjects);
    console.log('Seed: Nigerian curriculum subjects added.');
  }
};

sequelize.sync({ alter: true }).then(async () => {
  await seedData();
  dbInitialized = true;
  console.log('Database initialized on startup');
  
  // For local development
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}).catch(err => {
  console.error('Database initialization on startup failed:', err);
  // Don't crash - Vercel will use the /api/init endpoint instead
});

// Export for Vercel
module.exports = app;
