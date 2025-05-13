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

# Build the application
RUN npm run build

# Expose the port
EXPOSE 9000

# Set the entry command directly (no shell script)
CMD ["node", ".medusa/server/main.js"] 