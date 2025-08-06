const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const StrollerFeatureValue = sequelize.define('StrollerFeatureValue', {
  strollerFeatureValueId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  strollerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  featureId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false 
  }
},
{
  tableName: 'strollerfeaturevalue',
  timestamps: true,
  freezeTableName: true  // This prevents Sequelize from pluralizing the table name
});

module.exports = StrollerFeatureValue; 