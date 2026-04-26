const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./User");

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  registrationNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  studentClass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resultsReleased: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  admissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  guardianPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Student.belongsTo(User, { as: "Parent", foreignKey: "parentId" });
module.exports = Student;
