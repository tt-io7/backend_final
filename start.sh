#!/bin/sh

# Navigate to the built directory
cd .medusa/server || { echo "Failed to cd into .medusa/server"; exit 1; }

# Install dependencies
echo "Installing dependencies..."
npm install

# Run migrations
echo "Running migrations..."
npm run predeploy

# Start the Medusa server
echo "Starting Medusa server..."
npm run start 