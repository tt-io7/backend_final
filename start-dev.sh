#!/bin/bash

# Start Medusa backend
echo "Starting Medusa backend..."
npm run dev &
MEDUSA_PID=$!

# Wait for Medusa to start
echo "Waiting for Medusa to start..."
sleep 10

# Start traditional storefront
echo "Starting traditional storefront..."
cd storefront
npm run dev &
STOREFRONT_PID=$!

# Start mystery box storefront
echo "Starting mystery box storefront..."
cd ../mystery-box
npm run dev &
MYSTERY_BOX_PID=$!

# Function to handle script termination
cleanup() {
  echo "Shutting down all services..."
  kill $MEDUSA_PID
  kill $STOREFRONT_PID
  kill $MYSTERY_BOX_PID
  exit
}

# Set up trap to catch termination signals
trap cleanup SIGINT SIGTERM

# Keep script running
echo "All services started!"
echo "- Medusa backend: http://localhost:9000"
echo "- Traditional storefront: http://localhost:3000"
echo "- Mystery box storefront: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait indefinitely
wait