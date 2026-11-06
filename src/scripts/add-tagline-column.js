// One-off: sequelize.sync() does not alter existing tables, so the new
// Stroller.tagline column has to be added to an already-created DB by hand.
const { sequelize } = require('../models');

const run = async () => {
  try {
    await sequelize.query('ALTER TABLE stroller ADD COLUMN IF NOT EXISTS tagline VARCHAR(255)');
    console.log('stroller.tagline column is present');
  } catch (error) {
    console.error('Error adding tagline column:', error);
  } finally {
    await sequelize.close();
  }
};

run();
