#!/bin/bash

echo "Starting application..."

# Run migrations first
npm run predeploy

# Start the application
npm run start 