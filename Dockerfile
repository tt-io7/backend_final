FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Use clean install without any optional dependencies
RUN npm ci --omit=dev --no-audit

# Copy application files
COPY . .

# Ensure medusa-config.js is available
RUN if [ ! -f "medusa-config.js" ] && [ -f "medusa-config.ts" ]; then echo "Using TypeScript config"; else echo "Using JavaScript config"; fi

# Add the startup script
COPY start.sh ./
RUN chmod +x start.sh

# Set production environment
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose the port
EXPOSE 9000

# Set the entry command
CMD ["./start.sh"] 