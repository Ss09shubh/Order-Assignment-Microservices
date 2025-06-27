const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vendor_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  api_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive']]
    }
  }
}, {
  tableName: 'vendors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Vendor;