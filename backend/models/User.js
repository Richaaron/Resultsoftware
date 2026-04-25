const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'TEACHER', 'PARENT'),
    allowNull: false
  },
  isFormTeacher: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isSubjectTeacher: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  assignedClass: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assignedSubject: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = User;
