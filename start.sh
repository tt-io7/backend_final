#!/bin/bash

# Set environment variables
export NODE_ENV=production

# Check if built directory exists
if [ -d ".medusa/server" ]; then
  echo "Found built Medusa application, using it..."
  cd .medusa/server
  npm install
else
  echo "No built directory found, running from root..."
fi

# Ensure migrations run before starting
echo "Running database migrations..."
npx medusa db:migrate

# Start the application
echo "Starting Medusa server..."
npx medusa start 