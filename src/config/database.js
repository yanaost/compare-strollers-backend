const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Function to sync database
const sync = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Unable to sync database:', error);
    throw error;
  }
};

module.exports = { sequelize, sync }; 