const User = require('./models/User');
const sequelize = require('./utils/db');
const bcrypt = require('bcryptjs');

async function checkAndFix() {
  try {
    await sequelize.authenticate();
    console.log('--- DB CONNECTION SUCCESSFUL ---');

    // 1. Delete any duplicate admin users
    const allAdmins = await User.findAll({ 
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('username')), 
        'admin'
      )
    });
    
    console.log(`Found ${allAdmins.length} potential admin users.`);
    
    if (allAdmins.length > 1) {
      console.log('Cleaning up duplicates...');
      for (let i = 1; i < allAdmins.length; i++) {
        await allAdmins[i].destroy();
      }
    }

    // 2. Reset the main admin account
    const testPass = 'adminpassword123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(testPass, salt);
    
    const [admin, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        password: hash,
        fullName: 'System Administrator',
        role: 'ADMIN',
        isActive: true
      }
    });

    if (!created) {
      console.log('Updating existing admin...');
      await admin.update({
        username: 'admin', // Ensure lowercase
        password: hash,
        isActive: true,
        role: 'ADMIN'
      });
    }

    // 3. Final verification
    const finalAdmin = await User.findOne({ where: { username: 'admin' } });
    const isMatch = await bcrypt.compare(testPass, finalAdmin.password);
    
    console.log('--- FINAL STATUS ---');
    console.log('Username:', finalAdmin.username);
    console.log('Password Match:', isMatch);
    console.log('DB Hash:', finalAdmin.password);
    console.log('User ID:', finalAdmin.id);
    
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

checkAndFix();
