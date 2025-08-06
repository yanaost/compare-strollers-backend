const { sequelize } = require('../config/database');
const Stroller = require('./Stroller');
const Feature = require('./Feature');
const StrollerFeatureValue = require('./StrollerFeatureValue');
const FeatureGroup = require('./FeatureGroup');

// Define associations
Stroller.belongsToMany(FeatureGroup, { 
  through: 'StrollerFeatureGroup',
  foreignKey: 'strollerId',
  otherKey: 'featureGroupId',
  as: 'strollerGroups'
});

FeatureGroup.belongsToMany(Stroller, { 
  through: 'StrollerFeatureGroup',
  foreignKey: 'featureGroupId',
  otherKey: 'strollerId',
  as: 'strollers'
});

// Feature Group associations
Feature.belongsTo(FeatureGroup, { 
  foreignKey: 'featureGroupId',
  as: 'groupFields'
});

FeatureGroup.hasMany(Feature, { 
  foreignKey: 'featureGroupId',
  as: 'groupFields'
});

// StrollerFeatureValue associations
StrollerFeatureValue.belongsTo(Stroller, {
  foreignKey: 'strollerId',
  as: 'Stroller'
});

Stroller.hasMany(StrollerFeatureValue, {
  foreignKey: 'strollerId',
  as: 'StrollerFeatureValues'
});

StrollerFeatureValue.belongsTo(Feature, {
  foreignKey: 'featureId',
  as: 'Feature'
});

Feature.hasMany(StrollerFeatureValue, {
  foreignKey: 'featureId',
  as: 'StrollerFeatureValues'
});

module.exports = {
  sequelize,
  Stroller,
  Feature,
  StrollerFeatureValue,
  FeatureGroup
}; 