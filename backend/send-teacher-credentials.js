require('dotenv').config({ path: ['.env.local', '.env'] });
const sequelize = require('./utils/db');
const User = require('./models/User');
const { sendTeacherWelcomeEmail } = require('./utils/emailService');
const logger = require('./utils/logger');

/**
 * Send credentials email to a specific teacher
 */
async function sendTeacherCredentials(teacherName) {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Find teacher by full name
    const teacher = await User.findOne({
      where: {
        fullName: teacherName,
        role: 'TEACHER'
      }
    });

    if (!teacher) {
      console.error(`✗ Teacher "${teacherName}" not found`);
      process.exit(1);
    }

    console.log(`✓ Found teacher: ${teacher.fullName}`);
    console.log(`  Username: ${teacher.username}`);
    console.log(`  Email: ${teacher.email}`);

    if (!teacher.email) {
      console.error('✗ Teacher has no email address on file');
      process.exit(1);
    }

    // Prepare teacher details for email
    const teacherDetails = {
      fullName: teacher.fullName,
      username: teacher.username,
      password: 'Note: Password is stored securely. Request password reset if forgotten.',
      isFormTeacher: teacher.isFormTeacher,
      isSubjectTeacher: teacher.isSubjectTeacher,
      assignedClass: teacher.assignedClass,
      assignedSubject: teacher.assignedSubject
    };

    // Send welcome email
    console.log(`\nSending credentials email to ${teacher.email}...`);
    const result = await sendTeacherWelcomeEmail(teacher.email, teacherDetails);

    if (result.success) {
      console.log(`✓ Email sent successfully to ${teacher.email}`);
      console.log(`  Message ID: ${result.messageId}`);
    } else {
      console.warn(`⚠ Email delivery issue: ${result.error}`);
      console.log(`\n📋 Teacher Credentials (to send manually or retry):`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Name: ${teacher.fullName}`);
      console.log(`Email: ${teacher.email}`);
      console.log(`Username: ${teacher.username}`);
      console.log(`Role: ${teacher.isFormTeacher ? 'Form Teacher' : ''} ${teacher.isSubjectTeacher ? 'Subject Teacher' : ''}`.trim());
      if (teacher.assignedClass) console.log(`Assigned Class: ${teacher.assignedClass}`);
      if (teacher.assignedSubject) console.log(`Assigned Subject(s): ${teacher.assignedSubject}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`\n💡 Email could not be sent due to connectivity issues.`);
      console.log(`   Please ensure Gmail is accessible and app-specific password is configured.`);
    }

    // Disconnect from database
    await sequelize.close();
    console.log('\n✓ Process completed');
    process.exit(0);

  } catch (error) {
    console.error('✗ Error:', error.message);
    logger.error('Error in send-teacher-credentials:', error);
    process.exit(1);
  }
}

// Get teacher name from command line arguments
const teacherName = process.argv[2];

if (!teacherName) {
  console.log('Usage: node send-teacher-credentials.js "Teacher Full Name"');
  console.log('Example: node send-teacher-credentials.js "Olumide Faluyi"');
  process.exit(1);
}

sendTeacherCredentials(teacherName);
