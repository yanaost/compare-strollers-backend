const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Stroller = sequelize.define('Stroller', {
  strollerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  modelName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modelDescription: {
    // Prose, and longer than 255 characters for some models.
    type: DataTypes.TEXT,
    allowNull: true
  },
  tagline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  alternativeModelNames: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true
  }
},
{
    tableName: 'stroller',
    timestamps: true,
    freezeTableName: true  // This prevents Sequelize from pluralizing the table name
});

module.exports = Stroller; 