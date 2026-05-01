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

    // Add proprietressName
    try {
      await sequelize.query('ALTER TABLE "Settings" ADD COLUMN "proprietressName" VARCHAR(255);');
      console.log('Successfully added proprietressName column.');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('proprietressName column already exists.');
      } else {
        console.error('Error adding proprietressName:', err.message);
      }
    }

    // Add proprietressSignature
    try {
      await sequelize.query('ALTER TABLE "Settings" ADD COLUMN "proprietressSignature" TEXT;');
      console.log('Successfully added proprietressSignature column.');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('proprietressSignature column already exists.');
      } else {
        console.error('Error adding proprietressSignature:', err.message);
      }
    }

    // Add schoolPhoneNumber
    try {
      await sequelize.query('ALTER TABLE "Settings" ADD COLUMN "schoolPhoneNumber" VARCHAR(255);');
      console.log('Successfully added schoolPhoneNumber column.');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('schoolPhoneNumber column already exists.');
      } else {
        console.error('Error adding schoolPhoneNumber:', err.message);
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
