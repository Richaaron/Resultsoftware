const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const User = require('./User');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  registrationNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  studentClass: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resultsReleased: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Student.belongsTo(User, { as: 'Parent', foreignKey: 'parentId' });
module.exports = Student;
