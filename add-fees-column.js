require('dotenv').config({ path: './backend/.env' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    await sequelize.query('ALTER TABLE "Students" ADD COLUMN IF NOT EXISTS "feesPaid" BOOLEAN DEFAULT false;');
    console.log('✅ feesPaid column added to Students table.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

run();
