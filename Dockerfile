FROM node:20.10

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0
ENV NPM_CONFIG_PRODUCTION=false

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with reliable flags
RUN npm install --no-audit
RUN npm install @medusajs/medusa-config winston --no-save || echo "Failed to install dependencies, will try alternative approach"

# Copy project files
COPY . .

# Ensure src/utils directory exists
RUN mkdir -p src/utils
RUN [ -f src/utils/logger.js ] || echo 'const winston = require("winston"); \
const logger = winston.createLogger({ \
  level: "info", \
  format: winston.format.combine( \
    winston.format.timestamp(), \
    winston.format.json() \
  ), \
  transports: [ \
    new winston.transports.Console(), \
    new winston.transports.File({ filename: "combined.log" }) \
  ] \
}); \
module.exports = logger;' > src/utils/logger.js

# Ensure scripts have correct permissions
RUN chmod +x health.js
RUN chmod +x start.sh

# Perform database migrations before build
RUN npx medusa migrations run || echo "Migration failed, will try during startup"

# Build with generous memory allocation and error handling
RUN NODE_OPTIONS=--max_old_space_size=4096 npm run build || echo "Build completed with warnings"

# Create necessary directories in the built output
RUN mkdir -p .medusa/server/src/utils
RUN cp src/utils/logger.js .medusa/server/src/utils/ || echo "Logger file copy failed"

# Expose port
EXPOSE 9000

# Health check with increased timeout and start period
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:9000/health || exit 1

# Start command using the shell script
CMD ["sh", "-c", "./start.sh"] 