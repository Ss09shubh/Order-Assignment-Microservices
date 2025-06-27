const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  worker_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vendor_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive', 'busy']]
    }
  }
}, {
  tableName: 'workers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Worker;