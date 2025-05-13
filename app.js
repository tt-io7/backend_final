// Simple fallback server in case Medusa fails to start

const express = require('express');
const app = express();
const port = process.env.PORT || 9000;

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({
    status: 'ok',
    message: 'Fallback server running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).send({
    status: 'ok',
    message: 'Medusa backend fallback server',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      REDIS_URL: process.env.REDIS_URL ? 'Set' : 'Not set'
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Fallback server running on port ${port}`);
}); 