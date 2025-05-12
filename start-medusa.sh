#!/bin/bash

# Script to start Medusa application in production mode
echo "Starting Medusa in production mode..."

# Change to the built server directory
cd .medusa/server

# Install dependencies
echo "Installing dependencies..."
npm install

# Run migrations and setup
echo "Running predeploy migrations..."
npm run predeploy

# Start the application
echo "Starting Medusa server..."
npm run start 