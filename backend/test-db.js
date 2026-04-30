const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgresql://postgres.hiwtaiwxqzcluftmgxeo:Youcannotguessmypasswordnever@aws-0-eu-west-1.pooler.supabase.com:6543/postgres', {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("ADMIN", "TEACHER", "PARENT"),
    defaultValue: "TEACHER",
  },
  isFormTeacher: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isSubjectTeacher: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  profileImage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assignedClass: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  assignedSubject: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

async function run() {
  try {
    const teacher = await User.create({
      username: "johndoe123",
      password: "password123",
      fullName: "John Doe",
      email: "john@example.com",
      role: "TEACHER",
      isFormTeacher: false,
      isSubjectTeacher: true,
      assignedClass: "Primary 1",
      assignedSubject: "Mathematics",
      profileImage: null,
    });
    console.log("Teacher created!", teacher.toJSON());
    // clean up
    await User.destroy({ where: { username: "johndoe123" } });
    process.exit(0);
  } catch (e) {
    console.error("Error creating teacher:", e.message);
    if (e.original) {
       console.error("Original error:", e.original.message);
    }
    process.exit(1);
  }
}
run();
