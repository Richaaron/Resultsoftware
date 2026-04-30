require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../backend/models/User');
const sequelize = require('../backend/utils/db');

async function checkTeacher() {
  try {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { username: 'teacher' } });
    if (!user) {
      console.log('Teacher user not found in database');
      return;
    }
    console.log('Teacher found:', user.toJSON());
    const passwordMatch = await bcrypt.compare('teacher123', user.password);
    console.log('Password match:', passwordMatch);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkTeacher();
