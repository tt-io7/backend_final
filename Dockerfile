# Use Node.js LTS version
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Create .npmrc with necessary settings
RUN echo "legacy-peer-deps=true" > .npmrc && \
    echo "engine-strict=false" >> .npmrc

# Install dependencies with basic npm install
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9000

# Expose the port the app runs on
EXPOSE 9000

# Run the application using our railway:start script
CMD npm run railway:start 