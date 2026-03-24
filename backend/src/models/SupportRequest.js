const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SupportRequest = sequelize.define('SupportRequest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  urgency: { type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'), defaultValue: 'Medium' },
  status: { type: DataTypes.ENUM('Pending', 'Accepted', 'In-Progress', 'Completed', 'Cancelled'), defaultValue: 'Pending' },
  location: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.FLOAT, allowNull: true },
  longitude: { type: DataTypes.FLOAT, allowNull: true },
  contactPhone: { type: DataTypes.STRING, allowNull: true },
  
  // NEW FIELDS FOR BLOOD AND DATES
  availableDate: { type: DataTypes.DATEONLY, allowNull: true },
  bloodType: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true,
});

module.exports = SupportRequest;