# Use Node.js LTS version
FROM node:20-alpine

# Install necessary build tools for native dependencies
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies with more fault-tolerant settings
RUN npm config set legacy-peer-deps true && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --no-fund

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production 
ENV PORT=9000

# Expose the port the app runs on
EXPOSE 9000

# Run migrations and start the application
CMD ["sh", "-c", "npm run predeploy && npm run start"] 