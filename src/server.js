const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const strollerRoutes = require('./routes/strollerRoutes');

const { sequelize, Stroller } = require('./models');
const { sync } = require('./config/database');
const seedDatabase = require('./seeders/seed');

// Create Express app
const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/health', (_req, res) => res.send('ok')); // fast, no DB call

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => console.log(`API listening on ${port}`));

// CORS configuration - more permissive for development
app.use(cors({
    origin: 'http://localhost:5173', // Explicitly set your frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Handle OPTIONS requests explicitly
app.options('*', cors());

// Middleware
app.use(bodyParser.json()); // This helps us read JSON data from requests
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/strollers', strollerRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Compare Strollers API!' });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection is working');

    // Test table existence
    const tableNames = await sequelize.getQueryInterface().showAllTables();
    console.log('Available tables:', tableNames);

    // Test stroller table
    const strollerCount = await Stroller.count();
    console.log('Number of strollers in database:', strollerCount);

    res.json({
      message: 'Database test successful',
      tables: tableNames,
      strollerCount
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    original: err.original
  });
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message,
    details: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      original: err.original
    } : undefined
  });
});

// Set port
const PORT = process.env.PORT || 5001;

// Sync database, seed data, and start server
const startServer = async () => {
  try {
    // Use the sync function from database config
    await sync();
    console.log('Database tables synchronized successfully');

    // Seed the database
    await seedDatabase();
    console.log('Database seeded successfully');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Test the server by visiting: http://localhost:${PORT}`);
      console.log(`Test the database by visiting: http://localhost:${PORT}/test-db`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer(); 