const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Setting = sequelize.define("Setting", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  schoolName: {
    type: DataTypes.STRING,
    defaultValue: "My Cartoon School",
  },
  logo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  primaryColor: {
    type: DataTypes.STRING,
    defaultValue: "#fbbf24",
  },
  secondaryColor: {
    type: DataTypes.STRING,
    defaultValue: "#ef4444",
  },
  principalName: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  schoolAddress: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  currentTerm: {
    type: DataTypes.STRING,
    defaultValue: "First",
  },
  currentAcademicYear: {
    type: DataTypes.STRING,
    defaultValue: "2025/2026",
  },
});

module.exports = Setting;
