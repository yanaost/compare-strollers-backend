const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

/**
 * One comparison page.
 *
 * The frontend used to hardcode this list in src/config/comparisons.ts, which
 * meant adding a page was a code change and a redeploy. Keeping it here makes
 * the set of pages data: the frontend build reads these rows and generates
 * exactly one static page per row.
 *
 * `slug` is the URL, written out rather than derived, so renaming a model does
 * not move an indexed page. `strollerIds` is the column order on the page.
 */
const Comparison = sequelize.define('Comparison', {
  comparisonId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  strollerIds: {
    type: DataTypes.JSON,
    allowNull: false
  },
  // List order on the home page. Card copy stays in the frontend.
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
},
{
  tableName: 'comparison',
  timestamps: true,
  freezeTableName: true
});

module.exports = Comparison;
