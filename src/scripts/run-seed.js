const seedDatabase = require('../seeders/seed');
const { sequelize } = require('../models');

const runSeed = async () => {
  try {
    console.log('Starting database seeding...');
    await seedDatabase();
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error running seed:', error);
  } finally {
    await sequelize.close();
  }
};

runSeed(); 