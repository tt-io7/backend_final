#!/bin/sh
set -e

echo "Starting Medusa application..."

# Set environment to production
export NODE_ENV=production

# Check if the build exists
if [ ! -d ".medusa/server" ]; then
  echo "Build directory not found, attempting to build..."
  npx medusa build
fi

# Run migrations
echo "Running database migrations..."
npx medusa db:migrate

# Start the Medusa server
echo "Starting Medusa server..."
node .medusa/server/main.js

# If Medusa fails, fall back to the simple express server
echo "Medusa server failed, starting fallback server..."
node app.js 