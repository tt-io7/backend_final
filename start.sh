#!/bin/bash

# Set environment variables
export NODE_ENV=production

# Ensure migrations run before starting
echo "Running database migrations..."
npx medusa db:migrate

# Start the application
echo "Starting Medusa server..."
npx medusa start 