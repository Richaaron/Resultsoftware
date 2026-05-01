require('dotenv').config({ path: ['.env.local', '.env'] });
const sequelize = require('./utils/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const logger = require('./utils/logger');

const color = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(symbol, message, colorType = 'reset') {
  console.log(`${color[colorType]}${symbol} ${message}${color.reset}`);
}

async function debugPasswordChange(username, testPassword) {
  console.log(`\n${color.cyan}═══════════════════════════════════════════════════════════${color.reset}`);
  console.log(`${color.cyan}  PASSWORD CHANGE DIAGNOSTIC${color.reset}`);
  console.log(`${color.cyan}═══════════════════════════════════════════════════════════${color.reset}\n`);

  try {
    // 1. Database connectivity
    log('⏳', 'Connecting to database...', 'blue');
    await sequelize.authenticate();
    log('✓', 'Database connected', 'green');

    // 2. Find user
    log('⏳', `Finding user: ${username}`, 'blue');
    const user = await User.findOne({ where: { username } });

    if (!user) {
      log('✗', `User not found: ${username}`, 'red');
      process.exit(1);
    }

    log('✓', `User found: ${user.fullName}`, 'green');
    console.log('');

    // 3. Test current password (using the test password provided)
    console.log(`${color.cyan}Step 1: Testing Current Password Comparison${color.reset}`);
    const currentPasswordMatch = await bcrypt.compare(testPassword, user.password);
    
    if (currentPasswordMatch) {
      log('✓', `Current password is CORRECT`, 'green');
    } else {
      log('✗', `Current password is INCORRECT`, 'red');
      log('ℹ', 'User password hash in database:', 'blue');
      console.log(`  ${user.password}`);
    }

    console.log('');

    // 4. Simulate password change
    console.log(`${color.cyan}Step 2: Simulating Password Change${color.reset}`);
    
    const newPassword = 'NewTest@123';
    log('ℹ', `Old password: ${testPassword}`, 'blue');
    log('ℹ', `New password: ${newPassword}`, 'blue');

    const hashedNewPassword = await bcrypt.hash(newPassword, 8);
    log('✓', 'New password hashed', 'green');

    // 5. Test verification before save
    console.log('');
    console.log(`${color.cyan}Step 3: Verifying Hash Before Saving${color.reset}`);
    const preVerify = await bcrypt.compare(newPassword, hashedNewPassword);
    
    if (preVerify) {
      log('✓', 'Hash verification PASSED (before save)', 'green');
    } else {
      log('✗', 'Hash verification FAILED (before save)', 'red');
    }

    // 6. Update database
    console.log('');
    console.log(`${color.cyan}Step 4: Saving to Database${color.reset}`);
    user.password = hashedNewPassword;
    await user.save();
    log('✓', 'Password saved to database', 'green');

    // 7. Fetch fresh from database
    console.log('');
    console.log(`${color.cyan}Step 5: Fetching Fresh User from Database${color.reset}`);
    const freshUser = await User.findByPk(user.id);
    log('✓', 'User refetched from database', 'green');

    // 8. Test new password with fresh user
    console.log('');
    console.log(`${color.cyan}Step 6: Testing New Password with Fresh User${color.reset}`);
    const newPasswordMatch = await bcrypt.compare(newPassword, freshUser.password);
    
    if (newPasswordMatch) {
      log('✓', 'NEW password MATCHES freshly fetched hash', 'green');
    } else {
      log('✗', 'NEW password DOES NOT MATCH freshly fetched hash', 'red');
      log('ℹ', 'Fresh user password hash in database:', 'blue');
      console.log(`  ${freshUser.password}`);
    }

    // 9. Test old password should no longer work
    console.log('');
    console.log(`${color.cyan}Step 7: Verifying Old Password No Longer Works${color.reset}`);
    const oldPasswordMatch = await bcrypt.compare(testPassword, freshUser.password);
    
    if (!oldPasswordMatch) {
      log('✓', 'OLD password correctly rejected', 'green');
    } else {
      log('⚠', 'OLD password still matches (unexpected)', 'yellow');
    }

    // 10. Check hash format
    console.log('');
    console.log(`${color.cyan}Step 8: Hash Format Validation${color.reset}`);
    
    const hashFormat = freshUser.password;
    if (hashFormat.startsWith('$2a$') || hashFormat.startsWith('$2b$') || hashFormat.startsWith('$2y$')) {
      log('✓', `Valid bcrypt hash format: ${hashFormat.substring(0, 7)}...`, 'green');
      log('ℹ', `Full hash length: ${hashFormat.length}`, 'blue');
    } else {
      log('✗', `Invalid bcrypt hash format: ${hashFormat.substring(0, 20)}...`, 'red');
    }

    // 11. Character encoding check
    console.log('');
    console.log(`${color.cyan}Step 9: Character Encoding Analysis${color.reset}`);
    
    log('ℹ', `Test password length: ${testPassword.length}`, 'blue');
    log('ℹ', `Test password bytes: ${Buffer.byteLength(testPassword)}`, 'blue');
    log('ℹ', `New password length: ${newPassword.length}`, 'blue');
    log('ℹ', `New password bytes: ${Buffer.byteLength(newPassword)}`, 'blue');

    // 12. Summary and recommendations
    console.log('');
    console.log(`${color.cyan}SUMMARY & RECOMMENDATIONS${color.reset}`);
    
    if (newPasswordMatch && !oldPasswordMatch) {
      log('✓', 'Password change system is working correctly', 'green');
      log('ℹ', 'Recommendation: Issue is likely in frontend logout/redirect', 'blue');
      log('ℹ', 'Try:', 'blue');
      log('  ', '1. Clear browser cache (Ctrl+Shift+Delete)', 'blue');
      log('  ', '2. Close all browser tabs for this site', 'blue');
      log('  ', '3. Change password again', 'blue');
      log('  ', '4. Wait for redirect to login', 'blue');
      log('  ', '5. Log in with NEW password', 'blue');
    } else if (!newPasswordMatch) {
      log('✗', 'Password change system has a database issue', 'red');
      log('ℹ', 'Possible causes:', 'blue');
      log('  ', '1. Sequelize not persisting to database', 'blue');
      log('  ', '2. Database transaction issue', 'blue');
      log('  ', '3. Check backend logs for errors', 'blue');
    }

    // Close database
    await sequelize.close();
    console.log(`\n${color.cyan}═══════════════════════════════════════════════════════════${color.reset}\n`);

  } catch (error) {
    log('✗', `Error: ${error.message}`, 'red');
    logger.error('Diagnostic error:', error);
    process.exit(1);
  }
}

// Get username and test password from command line
const username = process.argv[2];
const testPassword = process.argv[3];

if (!username || !testPassword) {
  console.log('Usage: node debug-password-change.js <username> <current-password>');
  console.log('Example: node debug-password-change.js "olumidef21" "fvs@12345"');
  console.log('\nThis script will:');
  console.log('1. Test current password authentication');
  console.log('2. Simulate a password change');
  console.log('3. Verify the new password works');
  console.log('4. Identify any issues with the password change system');
  process.exit(1);
}

debugPasswordChange(username, testPassword);
