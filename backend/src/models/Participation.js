const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Participation = sequelize.define('Participation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }
}, {
  timestamps: true,
});

module.exports = Participation;