const express = require('express');
const app = express();

// Import routes
const userRoutes = require('../setu-back/app/routes/user.routes');
const authRoutes = require('../setu-back/app/routes/auth.routes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Use routes
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal Server Error',
    },
  });
});

module.exports = app;
