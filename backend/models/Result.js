const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Student = require("./Student");
const Subject = require("./Subject");

const Result = sequelize.define(
  "Result",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    term: {
      type: DataTypes.STRING, // First, Second, Third
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING, // e.g., 2025/2026
      allowNull: false,
    },
    ca1Score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    ca2Score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    examScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    averageScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    grade: {
      type: DataTypes.STRING,
    },
    remark: {
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["StudentId", "SubjectId", "term", "academicYear"],
      },
    ],
  },
);

Result.belongsTo(Student);
Student.hasMany(Result);
Result.belongsTo(Subject);
Subject.hasMany(Result);

module.exports = Result;
