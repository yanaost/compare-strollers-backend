const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const FeatureGroup = sequelize.define('FeatureGroup', {
  featureGroupId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'featuregroup',
  timestamps: true,
  freezeTableName: true  // This prevents Sequelize from pluralizing the table name
});

module.exports = FeatureGroup; 