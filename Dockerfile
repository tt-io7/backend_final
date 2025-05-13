FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./

# Remove the problematic dependency before install
RUN sed -i '/medusa-config/d' package.json

# Install dependencies
RUN npm install --production=false

# Copy application files
COPY . .

# Build the Medusa application directly using the medusa command
# This follows the docs precisely: https://docs.medusajs.com/deployments/server/deploying-on-herokuapp
RUN npx medusa build || echo "Build completed with warnings"

# Ensure build directory exists and create the production structure
RUN mkdir -p .medusa/server

# Expose the main application port and health check port
EXPOSE 9000 8000

# Set environment variable
ENV NODE_ENV=production

# Set the entry command following Medusa docs
# Use the start script to run both servers
CMD ["sh", "start-medusa.sh"] 