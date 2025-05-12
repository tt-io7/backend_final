#!/bin/bash

echo "Starting build process..."

# Install dependencies
npm install --legacy-peer-deps --no-fund --no-audit

# Run the build
npm run build

echo "Build completed successfully!" 