require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sequelize = require('./utils/db');
const User = require('./models/User');
const Subject = require('./models/Subject');
require('./models/StudentSubject'); // Initialize many-to-many relationship

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/results', require('./routes/results'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/teachers', require('./routes/teachers'));

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

const PORT = process.env.PORT || 5000;

const seedData = async () => {
  const adminExists = await User.findOne({ where: { username: 'admin' } });
  if (!adminExists) {
    const hashedAdminPassword = await bcrypt.hash('admin123', 8);
    await User.create({
      username: 'admin',
      password: hashedAdminPassword,
      fullName: 'System Administrator',
      role: 'ADMIN'
    });

    const hashedTeacherPassword = await bcrypt.hash('teacher123', 8);
    await User.create({
      username: 'teacher',
      password: hashedTeacherPassword,
      fullName: 'John Doe',
      role: 'TEACHER'
    });
    console.log('Seed: Initial users created.');
  }

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
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
