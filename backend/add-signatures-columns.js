const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Add principalSignature
    try {
      await sequelize.query('ALTER TABLE "Settings" ADD COLUMN "principalSignature" TEXT;');
      console.log('Successfully added principalSignature column.');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('principalSignature column already exists.');
      } else {
        console.error('Error adding principalSignature:', err.message);
      }
    }

    // Add headTeacherSignature
    try {
      await sequelize.query('ALTER TABLE "Settings" ADD COLUMN "headTeacherSignature" TEXT;');
      console.log('Successfully added headTeacherSignature column.');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('headTeacherSignature column already exists.');
      } else {
        console.error('Error adding headTeacherSignature:', err.message);
      }
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

runMigration();
