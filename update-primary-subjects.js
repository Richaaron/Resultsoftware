/**
 * Migration script: Update Primary subjects to live database
 * - Removes: Yoruba, Igbo, Hausa, Social Studies
 * - Adds: Phonics, National Values, Quantitative Reasoning, Verbal Reasoning,
 *         Religious Studies, Vocational Aptitude, Literature
 *
 * Run from project root: node update-primary-subjects.js
 */

require('dotenv').config({ path: './backend/.env' });

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

const Subject = sequelize.define('Subject', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:     { type: DataTypes.STRING,  allowNull: false },
  category: { type: DataTypes.STRING,  allowNull: false },
  level:    { type: DataTypes.STRING,  allowNull: false },
  section:  { type: DataTypes.STRING,  allowNull: true },
});

const REMOVE_PRIMARY_SUBJECTS = ['Yoruba', 'Igbo', 'Hausa', 'Social Studies'];

const NEW_PRIMARY_SUBJECTS = [
  { name: 'Phonics',                category: 'Primary', level: 'General', section: null },
  { name: 'National Values',        category: 'Primary', level: 'General', section: null },
  { name: 'Quantitative Reasoning', category: 'Primary', level: 'General', section: null },
  { name: 'Verbal Reasoning',       category: 'Primary', level: 'General', section: null },
  { name: 'Religious Studies',      category: 'Primary', level: 'General', section: null },
  { name: 'Vocational Aptitude',    category: 'Primary', level: 'General', section: null },
  { name: 'Literature',             category: 'Primary', level: 'General', section: null },
];

async function run() {
  try {
    await sequelize.authenticate();
    console.log('\n✅ Database connected\n');

    // 1. Remove old Primary subjects
    console.log('── Removing old Primary subjects ────────────────');
    for (const name of REMOVE_PRIMARY_SUBJECTS) {
      const count = await Subject.destroy({
        where: { name, category: 'Primary', level: 'General' },
      });
      if (count > 0) {
        console.log(`  ✅ Removed: ${name}`);
      } else {
        console.log(`  ⚠  Not found (already removed?): ${name}`);
      }
    }

    // 2. Add new Primary subjects
    console.log('\n── Adding new Primary subjects ───────────────────');
    for (const sub of NEW_PRIMARY_SUBJECTS) {
      const exists = await Subject.findOne({
        where: { name: sub.name, category: 'Primary', level: 'General' },
      });
      if (exists) {
        console.log(`  ⏭  Already exists: ${sub.name}`);
      } else {
        await Subject.create(sub);
        console.log(`  ✅ Added: ${sub.name}`);
      }
    }

    console.log('\n🎉 Primary subjects updated successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  }
}

run();
