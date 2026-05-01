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
      { name: 'Mathematics', category: 'Primary', level: 'General', section: null },
      { name: 'English Language', category: 'Primary', level: 'General', section: null },
      { name: 'National Values', category: 'Primary', level: 'General', section: null },
      { name: 'Agricultural Science', category: 'Primary', level: 'General', section: null },
      { name: 'Physical & Health Education', category: 'Primary', level: 'General', section: null },
      { name: 'Phonics', category: 'Primary', level: 'General', section: null },
      { name: 'Literature', category: 'Primary', level: 'General', section: null },
      { name: 'Quantitative Reasoning', category: 'Primary', level: 'General', section: null },
      { name: 'Verbal Reasoning', category: 'Primary', level: 'General', section: null },
      { name: 'Vocational Aptitude', category: 'Primary', level: 'General', section: null },
      { name: 'Religious Knowledge', category: 'Primary', level: 'General', section: null },
      { name: 'Basic Science & Technology', category: 'Primary', level: 'General', section: null },
      { name: 'Cultural & Creative Arts', category: 'Primary', level: 'General', section: null },
      
      // Junior Secondary
      { name: 'Mathematics', category: 'Secondary', level: 'Junior', section: null },
      { name: 'English Language', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Basic Technology', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Basic Science', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Home Economics', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Fine Arts', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Computer Studies', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Religious Knowledge', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Hausa', category: 'Secondary', level: 'Junior', section: null },
      { name: 'National Values', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Physical & Health Education', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Agricultural Science', category: 'Secondary', level: 'Junior', section: null },
      { name: 'Business Studies', category: 'Secondary', level: 'Junior', section: null },
      
      // Senior Secondary - Science Section
      { name: 'Chemistry', category: 'Secondary', level: 'Senior', section: 'Science' },
      { name: 'Physics', category: 'Secondary', level: 'Senior', section: 'Science' },
      
      // Senior Secondary - Art Section
      { name: 'Literature in English', category: 'Secondary', level: 'Senior', section: 'Art' },
      { name: 'Government', category: 'Secondary', level: 'Senior', section: 'Art' },
      
      // Senior Secondary - Commercial Section
      { name: 'Commerce', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      { name: 'Accounting', category: 'Secondary', level: 'Senior', section: 'Commercial' },
      
      // Senior Secondary - General/Other Subjects (taken by all sections)
      { name: 'Biology', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Mathematics', category: 'Secondary', level: 'Senior', section: null },
      { name: 'English Language', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Marketing', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Civic Education', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Economics', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Geography', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Agricultural Science', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Computer Studies', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Data Processing', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Animal Husbandry', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Fishery', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Dyeing & Bleaching', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Catering Craft', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Physical & Health Education', category: 'Secondary', level: 'Senior', section: null },
      { name: 'French', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Food & Nutrition', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Home Management', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Further Mathematics', category: 'Secondary', level: 'Senior', section: null },
      { name: 'History', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Visual Arts', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Christian Religious Studies', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Islamic Religious Studies', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Book Keeping', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Office Practice', category: 'Secondary', level: 'Senior', section: null },
      { name: 'Insurance', category: 'Secondary', level: 'Senior', section: null }
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
