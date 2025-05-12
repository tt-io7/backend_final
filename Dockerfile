FROM node:20.6-alpine

# Set working directory
WORKDIR /app

# Copy package files for install
COPY package*.json ./
COPY .npmrc ./

# Add build dependencies and tools
RUN apk add --no-cache python3 make g++ git

# Install dependencies with platform-specific fixes
RUN npm config set platform linux && \
    npm config set architecture x64 && \
    npm config set omit optional && \
    npm ci --no-optional --ignore-scripts || npm install --no-audit --no-optional --ignore-scripts

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Set environment
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0

# Expose port
EXPOSE 9000

# Set the command to run
CMD ["npm", "run", "railway:start"] 