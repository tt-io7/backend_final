FROM node:20.10

# Set working directory
WORKDIR /app

# Copy package definition files for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Move to the built directory and install production dependencies
WORKDIR /app/.medusa/server
RUN npm install

# Set environment
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0
ENV NPM_CONFIG_OPTIONAL=false
ENV NPM_CONFIG_IGNORE_SCRIPTS=true

# Expose port
EXPOSE 9000

# Start command
CMD ["npm", "run", "start"] 