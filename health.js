// health.js - Simple Express server with a health endpoint for Railway
const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;

// Configure middleware
app.use(express.json());

// Track server state
let serverReady = false;

// Set server as ready after a short delay to allow Medusa to start
setTimeout(() => {
  console.log('Health check service is now reporting as ready');
  serverReady = true;
}, 30000); // 30 seconds grace period

// Health check route
app.get('/health', (req, res) => {
  if (serverReady) {
    res.status(200).json({ status: 'ok' });
  } else {
    console.log('Health check requested but server not ready yet');
    res.status(503).json({ status: 'initializing' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Medusa backend is running',
    version: process.env.npm_package_version || 'unknown',
    ready: serverReady
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Health check service running on port ${PORT}`);
});

module.exports = app; 