#!/bin/bash

# Script to restart the Next.js development server with a clean cache

echo "Stopping any running Next.js processes..."
pkill -f "next dev" || true

echo "Cleaning Next.js cache..."
rm -rf .next

echo "Cleaning node_modules/.cache..."
rm -rf node_modules/.cache

echo "Cleaning PostCSS cache..."
rm -rf node_modules/.cache/postcss-*

echo "Installing any missing dependencies..."
npm install --legacy-peer-deps # Use legacy peer deps just in case

echo "Rebuilding Tailwind CSS..."
npx tailwindcss --postcss postcss.config.mjs -i ./app/globals.css -o ./app/output.css

echo "Starting Next.js development server in development mode..."
export NODE_ENV=development
export TAILWIND_MODE=watch
npm run dev