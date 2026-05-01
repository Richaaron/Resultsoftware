require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const sequelize = require('./utils/db');
const logger = require('./utils/logger');
const { validateEnv } = require('./utils/envValidator');
const { errorHandler, asyncHandler } = require('./middleware/errorHandler');
const { authLimiter, apiLimiter } = require('./utils/rateLimiter');
const User = require('./models/User');
const Subject = require('./models/Subject');
require('./models/StudentSubject'); // Initialize many-to-many relationship
require('./models/Message'); // Initialize Message model
require('./models/ActivityLog'); // Initialize ActivityLog model

// Validate environment variables
validateEnv();

const app = express();

// Security middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://resultsoftware.netlify.app',
    process.env.FRONTEND_URL || 'https://resultsoftware.netlify.app'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Enhanced body parser middleware for serverless compatibility
app.use((req, res, next) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk.toString();
  });
  req.on('end', () => {
    if (data && req.headers['content-type']?.includes('application/json')) {
      try {
        req.body = JSON.parse(data);
      } catch (e) {
        logger.error('JSON parse error:', e);
        req.body = {};
      }
    }
    next();
  });
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  logger.info({ method: req.method, path: req.path, requestId: req.id });
  next();
});

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/results', require('./routes/results'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/activities', require('./routes/activities'));

const { auth, authorize } = require('./middleware/auth');

app.get('/api/stats', auth, authorize(['ADMIN']), asyncHandler(async (req, res) => {
  const studentCount = await require('./models/Student').count();
  const teacherCount = await User.count({ where: { role: 'TEACHER' } });
  const subjectCount = await Subject.count();
  res.send({ studentCount, teacherCount, subjectCount });
}));

// Database initialization endpoint (for Netlify/serverless)
app.post('/api/init', asyncHandler(async (req, res) => {
  if (dbInitialized) {
    return res.json({ message: 'Database already initialized', status: 'ok' });
  }

  await sequelize.sync({ alter: true });
  await seedData();
  
  dbInitialized = true;
  logger.info('Database initialized successfully');
  res.json({ message: 'Database initialized successfully', status: 'success' });
}));

// Health check endpoint (detailed)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: {
      connected: sequelize ? 'connected' : 'disconnected'
    },
    memoryUsage: process.memoryUsage()
  });
});

// Comprehensive health check for deployment verification
app.get('/api/health/detailed', asyncHandler(async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    database: {
      connected: false,
      message: 'Checking...'
    },
    environment_variables: {
      database: !!process.env.DATABASE_URL,
      jwt: !!process.env.JWT_SECRET,
      frontend_url: !!process.env.FRONTEND_URL
    }
  };

  try {
    // Test database connection
    const result = await sequelize.query('SELECT 1 as connected');
    checks.database.connected = result[0] !== undefined;
    checks.database.message = 'Connected successfully';
  } catch (error) {
    checks.database.message = error.message;
  }

  res.json(checks);
}));

// Email configuration check endpoint
app.get('/api/email-config', (req, res) => {
  res.json({
    EMAIL_USER_SET: !!process.env.EMAIL_USER,
    EMAIL_USER_VALUE: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 10) + '***' : 'NOT SET',
    EMAIL_PASSWORD_SET: !!process.env.EMAIL_PASSWORD,
    EMAIL_PASSWORD_LENGTH: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Test email endpoint (for configuration verification)
app.post('/api/test-email', asyncHandler(async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ 
      error: 'Email address required', 
      message: 'Please provide a "to" email address in request body' 
    });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return res.status(400).json({ 
      error: 'Email not configured', 
      message: 'EMAIL_USER and EMAIL_PASSWORD environment variables not set' 
    });
  }

  try {
    const { sendTestEmail } = require('./utils/emailService');
    const result = await sendTestEmail(to);
    
    if (result.success) {
      res.json({ 
        status: 'success',
        message: 'Test email sent successfully',
        sentTo: to,
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        status: 'error',
        error: 'Email sending failed',
        message: result.error,
        sentTo: to
      });
    }
  } catch (error) {
    logger.error('Test email failed:', error);
    res.status(500).json({ 
      status: 'error',
      error: 'Failed to send test email',
      message: error.message,
      details: error.toString()
    });
  }
}));

// Error handling middleware (must be last)
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

app.use(errorHandler);

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
      logger.info('Seed: Admin password updated.');
    } else {
      logger.info('Seed: Admin user created.');
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
      logger.info('Seed: Teacher password updated.');
    } else {
      logger.info('Seed: Teacher user created.');
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
      { name: 'English Language', category: 'Primary', level: 'General', section: null },
      { name: 'Mathematics (Primary)', category: 'Primary', level: 'General', section: null },
      { name: 'Basic Science', category: 'Primary', level: 'General', section: null },
      { name: 'National Values', category: 'Primary', level: 'General', section: null },
      { name: 'Agricultural Science', category: 'Primary', level: 'General', section: null },
      { name: 'Home Economics', category: 'Primary', level: 'General', section: null },
      { name: 'Physical & Health Education', category: 'Primary', level: 'General', section: null },
      { name: 'Information Technology', category: 'Primary', level: 'General', section: null },
      { name: 'Phonics', category: 'Primary', level: 'General', section: null },
      { name: 'Quantitative Reasoning', category: 'Primary', level: 'General', section: null },
      { name: 'Verbal Reasoning', category: 'Primary', level: 'General', section: null },
      { name: 'Religious Studies', category: 'Primary', level: 'General', section: null },
      { name: 'Vocational Aptitude', category: 'Primary', level: 'General', section: null },
      { name: 'Literature', category: 'Primary', level: 'General', section: null },
      
      // Junior Secondary
      { name: 'English Language', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Mathematics (JSS)', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Basic Science', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Basic Technology', category: 'Secondary', level: 'Junior', section: null },
      { name: 'National Values', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Home Economics', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Fine Arts', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Religious Studies', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Computer Studies', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Business Studies', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Agricultural Science', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Physical & Health Education', category: 'Secondary', level: 'Junior', section: null },
      
      // Senior Secondary - Science Section
      { name: 'English Language', category: 'Secondary', level: 'Senior', section: 'Science' },
      { name: 'Mathematics (SSS)', category: 'Secondary', level: 'Senior', section: 'Science' },
      { name: 'Biology', category: 'Secondary', level: 'Senior', section: 'Science' },
      { name: 'Chemistry', category: 'Secondary', level: 'Senior', section: 'Science' },
      { name: 'Physics', category: 'Secondary', level: 'Senior', section: 'Science' },
      { name: 'Further Mathematics', category: 'Secondary', level: 'Senior', section: 'Science' },
      { name: 'Christian Religious Studies', category: 'Secondary', level: 'Senior', section: 'Science' },
      { name: 'Islamic Religious Studies', category: 'Secondary', level: 'Senior', section: 'Science' },
      
      // Senior Secondary - Art Section
      { name: 'English Language', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Mathematics (SSS)', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Economics', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Government', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Geography', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Literature in English', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'History', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Christian Religious Studies', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Islamic Religious Studies', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Yoruba Language', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Igbo Language', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Hausa Language', category: 'Secondary', level: 'Senior', section: 'Art' },
      
      // Senior Secondary - Commercial Section
      { name: 'English Language', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Mathematics (SSS)', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Economics', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Business Studies', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Accounting', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Financial Accounting', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Commerce', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Marketing', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Christian Religious Studies', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Islamic Religious Studies', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      
      // Senior Secondary - General/Other Subjects (taken by all sections)
      { name: 'Physical & Health Education', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Computer Science', category: 'Secondary', level: 'Senior', section: null },
      { name: 'French Language', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Civic Education', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Agricultural Science', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Fine Arts', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Music', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Technical Drawing', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Home Economics', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Introductory Technology', category: 'Secondary', level: 'Senior', section: null }
    ];
    await Subject.bulkCreate(subjects);
    logger.info('Seed: Nigerian curriculum subjects added.');
  }
  } catch (error) {
    logger.error('Seed data error:', error);
    throw error;
  }
};

sequelize.sync({ alter: true }).then(async () => {
  try {
    await seedData();
    dbInitialized = true;
    logger.info('Database initialized on startup');
  } catch (err) {
    logger.warn('Database initialization on startup failed - will use /api/init endpoint', err.message);
  }
  
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
}).catch(err => {
  logger.error('Critical: Database connection failed', err.message);
  // Don't crash - Netlify/serverless will use the /api/init endpoint instead
});

// Export for Vercel
module.exports = app;
