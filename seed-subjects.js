/**
 * Seed script: Add missing Senior Secondary subjects & fix section assignments
 * Run from project root: node seed-subjects.js
 */

// Load env from backend
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

// ── New subjects to add ───────────────────────────────────────────────────────
const newSubjects = [
  { name: 'Agricultural Science', category: 'Secondary', level: 'Senior', section: 'Science'     },
  { name: 'Civic Education',      category: 'Secondary', level: 'Senior', section: null           },
  { name: 'Marketing',            category: 'Secondary', level: 'Senior', section: 'Commercial'   },
];

// ── Section corrections for existing subjects ─────────────────────────────────
// null = Core (visible to ALL SSS sections)
const sectionFixes = [
  // Core
  { name: 'English Language',            section: null },
  { name: 'Mathematics',                 section: null },
  { name: 'Christian Religious Studies', section: null },
  { name: 'Islamic Religious Studies',   section: null },
  { name: 'Civic Education',             section: null },
  { name: 'Hausa Language',              section: null },
  { name: 'Igbo Language',               section: null },
  { name: 'Yoruba Language',             section: null },
  { name: 'Economics',                   section: null }, // shared Art + Commercial

  // Science
  { name: 'Biology',             section: 'Science' },
  { name: 'Chemistry',           section: 'Science' },
  { name: 'Physics',             section: 'Science' },
  { name: 'Further Mathematics', section: 'Science' },
  { name: 'Agricultural Science',section: 'Science' },

  // Art
  { name: 'Literature in English', section: 'Art' },
  { name: 'Government',            section: 'Art' },
  { name: 'Geography',             section: 'Art' },

  // Commercial
  { name: 'Commerce',             section: 'Commercial' },
  { name: 'Financial Accounting', section: 'Commercial' },
  { name: 'Marketing',            section: 'Commercial' },
];

async function run() {
  try {
    await sequelize.authenticate();
    console.log('\n✅ Database connected\n');

    // 1. Add missing subjects
    console.log('── Adding new subjects ────────────────────────────');
    for (const sub of newSubjects) {
      const exists = await Subject.findOne({
        where: { name: sub.name, category: 'Secondary', level: 'Senior' }
      });
      if (exists) {
        console.log(`  ⏭  Already exists: ${sub.name}`);
      } else {
        await Subject.create(sub);
        console.log(`  ✅ Added: ${sub.name} [${sub.section || 'Core (All Sections)'}]`);
      }
    }

    // 2. Fix sections on existing subjects
    console.log('\n── Fixing sections on existing subjects ───────────');
    for (const fix of sectionFixes) {
      const [count] = await Subject.update(
        { section: fix.section },
        { where: { name: fix.name, category: 'Secondary', level: 'Senior' } }
      );
      if (count > 0) {
        console.log(`  ✅ Updated: ${fix.name}  →  [${fix.section || 'Core (All Sections)'}]`);
      } else {
        console.log(`  ⚠  Not found (skip): ${fix.name}`);
      }
    }

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
}

run();
