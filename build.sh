#!/bin/bash

# Set environment variables
export NODE_ENV=production

# Run proper build process
echo "Building Medusa application..."

# Use locally installed TypeScript
echo "Converting medusa-config.ts to JS..."
./node_modules/.bin/tsc medusa-config.ts --esModuleInterop --skipLibCheck || true

# Ensure config files exist
if [ -f "medusa-config.js" ]; then
  echo "Generated medusa-config.js successfully"
  cp medusa-config.js medusa-config.cjs || true
else
  echo "Failed to generate medusa-config.js, creating manually"
  # Create a basic config file if compilation fails
  echo "const { defineConfig } = require('@medusajs/medusa')
module.exports = defineConfig({
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    redis_url: process.env.REDIS_URL,
    database_type: 'postgres'
  }
})" > medusa-config.js
  cp medusa-config.js medusa-config.cjs
fi

# Run Medusa build
echo "Running Medusa build..."
npm run build

echo "Build completed." 