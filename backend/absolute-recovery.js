const User = require('./models/User');
const sequelize = require('./utils/db');
const bcrypt = require('bcryptjs');

async function absoluteFinalFix() {
  try {
    await sequelize.authenticate();
    console.log('--- DB CONNECTED ---');

    // 1. Delete ALL admins to start fresh
    console.log('Clearing all admin accounts...');
    await User.destroy({ where: { role: 'ADMIN' } });

    // 2. Create fresh admin with simple password
    const username = 'admin';
    const password = 'adminpassword123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({
      username: username,
      password: hash,
      fullName: 'System Administrator',
      role: 'ADMIN',
      isActive: true
    });

    // 3. Verify
    const admin = await User.findOne({ where: { username: 'admin' } });
    const match = await bcrypt.compare(password, admin.password);
    
    console.log('--- RECOVERY SUCCESSFUL ---');
    console.log('Username:', admin.username);
    console.log('Password:', password);
    console.log('Verified Match:', match);
    console.log('DB ID:', admin.id);
    
    process.exit(0);
  } catch (error) {
    console.error('RECOVERY FAILED:', error.message);
    process.exit(1);
  }
}

absoluteFinalFix();
