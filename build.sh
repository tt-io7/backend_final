#!/bin/bash

# Set environment variables
export NODE_ENV=production

# Ensure ts-node is available
npm install -g ts-node typescript

# Run proper build process
echo "Building Medusa application..."
npx tsc medusa-config.ts --esModuleInterop --skipLibCheck
mv medusa-config.js medusa-config.cjs
cp medusa-config.cjs medusa-config.js
npm run build

echo "Build completed." 