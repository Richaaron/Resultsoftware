#!/usr/bin/env node
/**
 * Verify Admin Login - Comprehensive diagnostic script
 * Checks database connection, admin user existence, and password validity
 */

require('dotenv').config({ path: 'backend/.env.local' });
require('dotenv').config({ path: 'backend/.env' });
const bcrypt = require('bcryptjs');
const sequelize = require('./backend/utils/db');
const User = require('./backend/models/User');
const logger = require('./backend/utils/logger');

const ADMIN_PASSWORD = 'FolushoVictory2026';

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

async function verifyAdminLogin() {
  console.log(`\n${color.cyan}═══════════════════════════════════════════════════════════${color.reset}`);
  console.log(`${color.cyan}  ADMIN LOGIN VERIFICATION${color.reset}`);
  console.log(`${color.cyan}═══════════════════════════════════════════════════════════${color.reset}\n`);

  try {
    // Step 1: Check environment variables
    log('⏳', 'Step 1: Checking environment variables...', 'blue');
    if (!process.env.DATABASE_URL) {
      log('✗', 'DATABASE_URL not found in environment', 'red');
      log('ℹ', 'Create a .env.local file with DATABASE_URL', 'yellow');
      process.exit(1);
    }
    log('✓', 'DATABASE_URL is set', 'green');

    // Step 2: Test database connection
    log('\n⏳', 'Step 2: Testing database connection...', 'blue');
    await sequelize.authenticate();
    log('✓', 'Database connection successful', 'green');

    // Step 3: Check if admin user exists
    log('\n⏳', 'Step 3: Checking for admin user...', 'blue');
    const admin = await User.findOne({ where: { username: 'admin', role: 'ADMIN' } });

    if (!admin) {
      log('✗', 'Admin user not found in database', 'red');
      log('\n📋 Creating admin user now...', 'yellow');
      
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 8);
      const newAdmin = await User.create({
        username: 'admin',
        password: hashedPassword,
        fullName: 'System Administrator',
        role: 'ADMIN',
        isActive: true,
        isFormTeacher: false,
        isSubjectTeacher: true
      });
      
      log('✓', 'Admin user created successfully', 'green');
      log('ℹ', `Username: admin`, 'blue');
      log('ℹ', `Password: ${ADMIN_PASSWORD}`, 'blue');
    } else {
      log('✓', 'Admin user found', 'green');
      log('ℹ', `ID: ${admin.id}`, 'blue');
      log('ℹ', `Username: ${admin.username}`, 'blue');
      log('ℹ', `Full Name: ${admin.fullName}`, 'blue');
      log('ℹ', `Active: ${admin.isActive ? 'Yes' : 'No'}`, 'blue');

      // Step 4: Test password
      log('\n⏳', 'Step 4: Testing password match...', 'blue');
      const passwordMatch = await bcrypt.compare(ADMIN_PASSWORD, admin.password);
      
      if (passwordMatch) {
        log('✓', 'Password verification successful', 'green');
      } else {
        log('✗', 'Password does not match — updating now...', 'red');
        log('\n🔧', `Resetting password to "${ADMIN_PASSWORD}"...`, 'yellow');
        
        const newHashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 8);
        admin.password = newHashedPassword;
        admin.isActive = true;
        await admin.save();
        
        log('✓', 'Password reset successfully', 'green');
      }

      // Step 5: Verify active status
      if (!admin.isActive) {
        log('\n⚠', 'Admin account is deactivated', 'yellow');
        log('🔧', 'Activating admin account...', 'yellow');
        admin.isActive = true;
        await admin.save();
        log('✓', 'Admin account activated', 'green');
      }
    }

    console.log(`\n${color.cyan}═══════════════════════════════════════════════════════════${color.reset}`);
    console.log(`${color.green}✓ VERIFICATION COMPLETE${color.reset}`);
    console.log(`${color.cyan}═══════════════════════════════════════════════════════════${color.reset}`);
    console.log(`\n${color.cyan}LOGIN CREDENTIALS:${color.reset}`);
    console.log(`  Username: ${color.green}admin${color.reset}`);
    console.log(`  Password: ${color.green}${ADMIN_PASSWORD}${color.reset}`);
    console.log(`\n${color.cyan}NEXT STEPS:${color.reset}`);
    console.log(`  1. Go to: https://folushovictory.netlify.app/login`);
    console.log(`  2. Enter username: admin`);
    console.log(`  3. Enter password: ${ADMIN_PASSWORD}`);
    console.log(`  4. Click Sign In\n`);

    process.exit(0);
  } catch (error) {
    console.error(`\n${color.red}✗ ERROR: ${error.message}${color.reset}`);
    
    if (error.message.includes('Received undefined')) {
      log('\n🔧', 'The DATABASE_URL environment variable is not set', 'yellow');
      log('📝', 'Create backend/.env.local file with:', 'blue');
      console.log(`\n  DATABASE_URL=postgresql://...`);
      console.log(`  JWT_SECRET=your-secret-here\n`);
    }
    
    process.exit(1);
  } finally {
    try {
      await sequelize.close();
    } catch (err) {
      // Ignore close errors
    }
  }
}

verifyAdminLogin();
