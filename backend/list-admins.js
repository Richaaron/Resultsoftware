const User = require('./models/User');
const sequelize = require('./utils/db');

async function listAdmins() {
  try {
    await sequelize.authenticate();
    const admins = await User.findAll({ where: { role: 'ADMIN' } });
    console.log('ALL ADMINS IN SYSTEM:');
    admins.forEach(a => {
      console.log(`- Username: "${a.username}", FullName: "${a.fullName}", Active: ${a.isActive}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

listAdmins();
