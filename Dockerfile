# Use Node.js LTS version
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using npm instead of yarn
RUN npm ci

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
CMD ["npm", "run", "start"] 