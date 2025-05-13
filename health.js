// health.js - Simple Express server with a health endpoint for Railway
const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;
const http = require('http');

// Configure middleware
app.use(express.json());

// Track server state
let serverReady = false;

// Set server as ready after a longer delay to allow Medusa to fully initialize
setTimeout(() => {
  console.log('Health check service is now reporting as ready');
  serverReady = true;
}, 120000); // 2 minutes grace period

// Health check route
app.get('/health', (req, res) => {
  if (serverReady) {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
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

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const port = 9000;
server.listen(port, () => {
  console.log(`Health check server running on port ${port}`);
});

// Add error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app; 