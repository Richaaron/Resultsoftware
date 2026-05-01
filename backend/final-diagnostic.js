const User = require('./models/User');
const sequelize = require('./utils/db');
const bcrypt = require('bcryptjs');

async function finalDiagnostic() {
  try {
    await sequelize.authenticate();
    console.log('--- DB CONNECTION SUCCESSFUL ---');

    // 1. Find admin by username
    const admin = await User.findOne({ where: { username: 'admin' } });

    if (admin) {
      console.log('ADMIN USER FOUND:');
      console.log(`- Username: "${admin.username}", Active: ${admin.isActive}, ID: ${admin.id}`);
      
      const testPass = 'adminpassword123';
      const isMatch = await bcrypt.compare(testPass, admin.password);
      console.log(`  Does "${testPass}" match DB hash? ${isMatch}`);
      
      if (!isMatch) {
        console.log('  REPAIRING "admin" account password...');
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(testPass, salt);
        
        await User.update(
          { password: newHash, isActive: true },
          { where: { id: admin.id } }
        );
        
        const verify = await User.findByPk(admin.id);
        const finalMatch = await bcrypt.compare(testPass, verify.password);
        console.log(`  Repair verified? ${finalMatch}`);
      } else if (!admin.isActive) {
        console.log('  RE-ACTIVATING "admin" account...');
        await User.update({ isActive: true }, { where: { id: admin.id } });
        console.log('  Account activated.');
      }
    } else {
      console.log('CRITICAL: No admin user found. Creating one...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('adminpassword123', salt);
      await User.create({
        username: 'admin',
        password: hash,
        fullName: 'System Administrator',
        role: 'ADMIN',
        isActive: true
      });
      console.log('Admin user created successfully.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('DIAGNOSTIC ERROR:', error.message);
    process.exit(1);
  }
}

finalDiagnostic();
