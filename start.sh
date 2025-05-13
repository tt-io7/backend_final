#!/bin/sh
set -e

# Print environment for debugging (excluding secrets)
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_TYPE: $DATABASE_TYPE"
echo "REDIS_URL exists: $(if [ -n "$REDIS_URL" ]; then echo "yes"; else echo "no"; fi)"
echo "DATABASE_URL exists: $(if [ -n "$DATABASE_URL" ]; then echo "yes"; else echo "no"; fi)"

# Ensure medusa-config.js is found
if [ ! -f "medusa-config.js" ] && [ ! -f "medusa-config.ts" ]; then
  echo "Error: medusa-config.js or medusa-config.ts not found!"
  exit 1
fi

# Run migrations
echo "Running database migrations..."
npx medusa migrations run || echo "Migration failed, will try to continue"

# Start the server
echo "Starting Medusa server..."
if [ -d ".medusa/server" ]; then
  node .medusa/server/main.js
else
  echo "Error: Built server not found at .medusa/server"
  echo "Trying to start with medusa CLI as fallback..."
  npx medusa start 