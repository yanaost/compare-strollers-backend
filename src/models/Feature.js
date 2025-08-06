const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Feature = sequelize.define('Feature', {
  featureId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featureGroupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'featuregroup',
      key: 'featureGroupId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'feature',
  timestamps: true,
  freezeTableName: true  // This prevents Sequelize from pluralizing the table name
});

module.exports = Feature; 