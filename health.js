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

// Standalone health check server
const express = require('express');
const http = require('http');
const healthApp = express();
const healthPort = process.env.HEALTH_PORT || 8000; // Use different port from main app

// Log environment for debugging
console.log('Health server starting with environment:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('REDIS_URL exists:', !!process.env.REDIS_URL);

// Health check endpoint
healthApp.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    version: require('./package.json').version
  });
});

// Also handle root path
healthApp.get('/', (req, res) => {
  res.status(200).json({
    service: 'Medusa Backend Health Monitor',
    status: 'ok',
    endpoints: {
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Start the server on a separate port
const healthServer = http.createServer(healthApp);
healthServer.listen(healthPort, '0.0.0.0', () => {
  console.log(`Health check server is running on port ${healthPort}`);
});

// Keep the process running even if there's an error
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 