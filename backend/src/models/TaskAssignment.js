const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskAssignment = sequelize.define('TaskAssignment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('Assigned', 'In-Transit', 'Completed', 'Failed'),
    defaultValue: 'Assigned',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true, // Volunteers can leave notes about the delivery/task
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = TaskAssignment;