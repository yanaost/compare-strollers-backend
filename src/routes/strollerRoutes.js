const express = require('express');
const router = express.Router();
const strollerController = require('../controllers/strollerController');
const { Stroller } = require('../models');

// Logging middleware for all routes
router.use((req, res, next) => {
  console.log('Route accessed:', req.method, req.path);
  next();
});

// Test route that returns all strollers
router.get('/test-all', async (req, res) => {
  try {
    console.log('Test-all route accessed');
    const strollers = await Stroller.findAll();
    console.log('Found strollers:', strollers);
    res.json(strollers);
  } catch (error) {
    console.error('Error in test-all route:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search strollers by feature - with error handling wrapper
router.get('/search', async (req, res, next) => {
  try {
    console.log('Search route accessed with query:', req.query);
    await strollerController.searchStrollers(req, res);
  } catch (error) {
    console.error('Error in search route wrapper:', error);
    res.status(500).json({ 
      message: 'Error in search route',
      error: error.message
    });
  }
});

// Get strollers for comparison - must be before /:id route
router.get('/comparison-data', strollerController.getStrollersForComparison);

module.exports = router; 