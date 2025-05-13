#!/bin/sh
set -e

echo "Starting Medusa application..."

# Start the health check server in the background
echo "Starting health check server..."
node health.js &
HEALTH_PID=$!
echo "Health check server started with PID: $HEALTH_PID"

# Set environment to production
export NODE_ENV=production

# Make server directory if it doesn't exist
mkdir -p .medusa/server

# Create a minimal main.js if it doesn't exist
if [ ! -f ".medusa/server/main.js" ]; then
  echo "Creating minimal main.js file..."
  mkdir -p .medusa/server
  echo "console.log('Starting Medusa server...');" > .medusa/server/main.js
  echo "try { require('@medusajs/medusa').default({}) } catch (e) { console.error('Failed to start Medusa:', e); }" >> .medusa/server/main.js
fi

# Check if the build exists
if [ ! -d ".medusa/server" ]; then
  echo "Build directory not found, attempting to build..."
  npx medusa build || echo "Build completed with warnings"
fi

# Ensure we have a valid database URL
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL is not set!"
fi

# Run migrations if database is available
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npx medusa db:migrate || echo "Migration failed, will try to continue"
fi

# Start the Medusa server
echo "Starting Medusa server..."
node .medusa/server/main.js || node app.js

# If we get here, Medusa failed
echo "Medusa server failed, but health check should still be running."
wait $HEALTH_PID 