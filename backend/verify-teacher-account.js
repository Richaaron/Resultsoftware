require('dotenv').config({ path: ['.env.local', '.env'] });
const sequelize = require('./utils/db');
const User = require('./models/User');
const logger = require('./utils/logger');

const color = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(symbol, message, color_type = 'reset') {
  console.log(`${color[color_type]}${symbol} ${message}${color.reset}`);
}

async function verifyTeacherAccount(teacherName) {
  console.log(`\n${color.cyan}═══════════════════════════════════════════════════════════${color.reset}`);
  console.log(`${color.cyan}  TEACHER ACCOUNT VERIFICATION${color.reset}`);
  console.log(`${color.cyan}═══════════════════════════════════════════════════════════${color.reset}\n`);

  try {
    // 1. Database connectivity
    log('⏳', 'Checking database connection...', 'blue');
    await sequelize.authenticate();
    log('✓', 'Database connected', 'green');

    // 2. Find teacher
    log('⏳', `Searching for teacher: ${teacherName}`, 'blue');
    const teacher = await User.findOne({
      where: {
        fullName: teacherName,
        role: 'TEACHER'
      }
    });

    if (!teacher) {
      log('✗', `Teacher not found: ${teacherName}`, 'red');
      process.exit(1);
    }

    log('✓', `Teacher found`, 'green');
    console.log('');

    // 3. Check account status
    console.log(`${color.cyan}Account Status:${color.reset}`);
    log('ℹ', `ID: ${teacher.id}`, 'blue');
    log('ℹ', `Username: ${teacher.username}`, 'blue');
    log('ℹ', `Full Name: ${teacher.fullName}`, 'blue');
    log('ℹ', `Email: ${teacher.email}`, 'blue');

    // 4. Verify critical fields
    console.log(`\n${color.cyan}Critical Checks:${color.reset}`);
    
    if (!teacher.isActive) {
      log('✗', 'Account is DEACTIVATED - Teacher cannot login', 'red');
    } else {
      log('✓', 'Account is ACTIVE', 'green');
    }

    if (!teacher.email) {
      log('⚠', 'No email address - Future notifications will fail', 'yellow');
    } else {
      log('✓', `Email configured: ${teacher.email}`, 'green');
    }

    if (!teacher.username) {
      log('✗', 'No username - Cannot login', 'red');
    } else {
      log('✓', `Username set: ${teacher.username}`, 'green');
    }

    if (!teacher.password) {
      log('✗', 'Password not set - Cannot login', 'red');
    } else {
      log('✓', 'Password hash stored', 'green');
    }

    // 5. Check role assignments
    console.log(`\n${color.cyan}Role Assignments:${color.reset}`);
    
    const roles = [];
    if (teacher.isFormTeacher) roles.push('Form Teacher');
    if (teacher.isSubjectTeacher) roles.push('Subject Teacher');
    
    if (roles.length === 0) {
      log('⚠', 'No roles assigned - Teacher has no permissions', 'yellow');
    } else {
      log('✓', `Roles: ${roles.join(', ')}`, 'green');
    }

    // 6. Check class/subject assignments
    console.log(`\n${color.cyan}Class & Subject Assignments:${color.reset}`);
    
    if (!teacher.assignedClass && teacher.isFormTeacher) {
      log('⚠', 'Form Teacher but no class assigned', 'yellow');
    } else if (teacher.assignedClass) {
      log('✓', `Assigned Class: ${teacher.assignedClass}`, 'green');
    }

    if (!teacher.assignedSubject && teacher.isSubjectTeacher) {
      log('⚠', 'Subject Teacher but no subject assigned', 'yellow');
    } else if (teacher.assignedSubject) {
      log('✓', `Assigned Subject(s): ${teacher.assignedSubject}`, 'green');
    }

    // 7. Login simulation
    console.log(`\n${color.cyan}Login Test:${color.reset}`);
    const bcrypt = require('bcryptjs');
    
    // We can't test password directly (it's hashed), but we can verify it's a valid bcrypt hash
    if (teacher.password && teacher.password.length === 60 && teacher.password.startsWith('$2')) {
      log('✓', 'Password hash is valid (bcrypt format)', 'green');
    } else {
      log('✗', 'Password hash appears invalid', 'red');
    }

    // 8. Potential issues
    console.log(`\n${color.cyan}Potential Issues & Recommendations:${color.reset}`);
    
    const issues = [];
    
    if (!teacher.isActive) {
      issues.push({ type: 'CRITICAL', msg: 'Account deactivated - Reactivate before teacher can login' });
    }

    if (!teacher.email) {
      issues.push({ type: 'WARNING', msg: 'No email - Add email for password reset and notifications' });
    }

    if (teacher.isFormTeacher && !teacher.assignedClass) {
      issues.push({ type: 'WARNING', msg: 'Form Teacher without class - Attendance tracking disabled' });
    }

    if (teacher.isSubjectTeacher && !teacher.assignedSubject) {
      issues.push({ type: 'WARNING', msg: 'Subject Teacher without subjects - Cannot post results' });
    }

    if (issues.length === 0) {
      log('✓', 'No issues detected', 'green');
    } else {
      issues.forEach(issue => {
        const symbol = issue.type === 'CRITICAL' ? '✗' : '⚠';
        const color_type = issue.type === 'CRITICAL' ? 'red' : 'yellow';
        log(symbol, `[${issue.type}] ${issue.msg}`, color_type);
      });
    }

    // 9. First login instructions
    console.log(`\n${color.cyan}First Login Instructions:${color.reset}`);
    log('ℹ', '1. Teacher opens login portal', 'blue');
    log('ℹ', `2. Enters username: ${teacher.username}`, 'blue');
    log('ℹ', '3. Enters temporary password from email', 'blue');
    log('ℹ', `4. System redirects to /teacher dashboard`, 'blue');
    log('ℹ', '5. Teacher should change password immediately', 'blue');

    // 10. Summary
    console.log(`\n${color.cyan}Summary:${color.reset}`);
    
    const allGood = teacher.isActive && teacher.email && 
                    (teacher.isFormTeacher && teacher.assignedClass || !teacher.isFormTeacher) &&
                    (teacher.isSubjectTeacher && teacher.assignedSubject || !teacher.isSubjectTeacher);

    if (allGood) {
      log('✓', 'Account is fully configured and ready to use', 'green');
    } else {
      log('⚠', 'Account has warnings - Review above', 'yellow');
    }

    // Close database
    await sequelize.close();
    console.log(`\n${color.cyan}═══════════════════════════════════════════════════════════${color.reset}\n`);

  } catch (error) {
    log('✗', `Error: ${error.message}`, 'red');
    logger.error('Verification error:', error);
    process.exit(1);
  }
}

// Get teacher name from command line
const teacherName = process.argv[2];

if (!teacherName) {
  console.log('Usage: node verify-teacher-account.js "Teacher Full Name"');
  console.log('Example: node verify-teacher-account.js "Olumide Faluyi"');
  process.exit(1);
}

verifyTeacherAccount(teacherName);
