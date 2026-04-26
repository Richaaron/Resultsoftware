const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Student = require("./Student");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Late"),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["StudentId", "date"],
      },
    ],
  },
);

Attendance.belongsTo(Student);

module.exports = Attendance;
