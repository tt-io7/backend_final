FROM node:20.6-alpine

# Set working directory
WORKDIR /app

# Copy package files for install
COPY package*.json ./
COPY .npmrc ./

# Add build dependencies and tools
RUN apk add --no-cache python3 make g++ git curl bash

# Install SWC binaries and dependencies
RUN npm config set platform linux && \
    npm config set architecture x64 && \
    npm config set omit optional && \
    npm i -g @swc/cli @swc/core ts-node typescript

# Install dependencies with platform-specific fixes
RUN npm ci --no-optional || npm install --no-audit --no-optional

# Copy all files
COPY . .

# Make scripts executable
RUN chmod +x build.sh
RUN chmod +x start.sh

# Run build script instead of direct build command
RUN ./build.sh

# Set environment
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0

# Expose port
EXPOSE 9000

# Set the command to run (with fallback to script if the package.json command fails)
CMD ["sh", "-c", "npm run railway:start || ./start.sh"] 