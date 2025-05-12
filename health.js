// health.js - Simple Express server with a health endpoint for Railway
const express = require('express');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Fallback route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Medusa server is running. This is a health check service.'
  });
});

// Start server
const PORT = process.env.HEALTH_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
}); 