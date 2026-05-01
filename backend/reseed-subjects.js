require('dotenv').config();
const sequelize = require('./utils/db');
const Subject = require('./models/Subject');

const reseedSubjects = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected to database');

    // Delete all existing subjects
    console.log('Deleting existing subjects...');
    await Subject.destroy({ where: {} });
    console.log('Subjects deleted');

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
      { name: 'Basic Technology', category: 'Secondary', level: 'Senior', section: null }
    ];

    console.log('Adding new subjects...');
    await Subject.bulkCreate(subjects);
    console.log('✅ Subjects reseeded successfully!');
    console.log(`Total subjects added: ${subjects.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error reseeding subjects:', error.message);
    process.exit(1);
  }
};

reseedSubjects();
