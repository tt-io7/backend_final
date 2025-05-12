// health.js - Simple Express server with a health endpoint for Railway
const express = require('express');
const app = express();
const PORT = process.env.HEALTH_PORT || 9000;

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Medusa backend is running',
    version: process.env.npm_package_version || 'unknown'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Health check service running on port ${PORT}`);
});

module.exports = app; 