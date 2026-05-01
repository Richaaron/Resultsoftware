/**
 * Migration script: Update Junior Secondary subjects
 * - Removes: Social Studies, Civic Education
 * - Adds: National Values, Home Economics, Fine Arts, Religious Studies, Computer Studies, Civic Education
 *
 * Run from project root: node update-jss-subjects.js
 */

require('dotenv').config({ path: './backend/.env' });

const { Sequelize, DataTypes, Op } = require('sequelize');

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

const REMOVE = ['Social Studies'];

const ADD = [
  { name: 'National Values',   category: 'Secondary', level: 'Junior', section: null },
  { name: 'Civic Education',   category: 'Secondary', level: 'Junior', section: null },
  { name: 'Home Economics',    category: 'Secondary', level: 'Junior', section: null },
  { name: 'Fine Arts',         category: 'Secondary', level: 'Junior', section: null },
  { name: 'Religious Studies', category: 'Secondary', level: 'Junior', section: null },
  { name: 'Computer Studies',  category: 'Secondary', level: 'Junior', section: null },
];

async function run() {
  try {
    await sequelize.authenticate();
    console.log('\n✅ Database connected\n');

    // 1. Remove old JSS subjects
    console.log('── Removing old JSS subjects ─────────────────────');
    for (const name of REMOVE) {
      const count = await Subject.destroy({
        where: { name, category: 'Secondary', level: 'Junior' },
      });
      if (count > 0) {
        console.log(`  ✅ Removed: ${name}`);
      } else {
        console.log(`  ⚠  Not found (already removed?): ${name}`);
      }
    }

    // 2. Add new JSS subjects
    console.log('\n── Adding new JSS subjects ───────────────────────');
    for (const sub of ADD) {
      const exists = await Subject.findOne({
        where: { name: sub.name, category: 'Secondary', level: 'Junior' },
      });
      if (exists) {
        console.log(`  ⏭  Already exists: ${sub.name}`);
      } else {
        await Subject.create(sub);
        console.log(`  ✅ Added: ${sub.name}`);
      }
    }

    console.log('\n🎉 JSS subjects updated successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  }
}

run();
