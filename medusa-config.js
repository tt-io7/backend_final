// This file is used for production
console.log("Loading medusa-config.js in environment:", process.env.NODE_ENV);

const { defineConfig } = require('@medusajs/medusa-config')

/**
 * @type {import('@medusajs/medusa').ConfigModule}
 */
const config = defineConfig({
  projectConfig: {
    database_url: process.env.DATABASE_URL,
    database_type: process.env.DATABASE_TYPE || "postgres",
    redis_url: process.env.REDIS_URL,
    store_cors: process.env.STORE_CORS || "http://localhost:8000,http://localhost:4000",
    admin_cors: process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001",
    jwt_secret: process.env.JWT_SECRET || "supersecret",
    cookie_secret: process.env.COOKIE_SECRET || "supersecret",
    database_extra: process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false } } : {},
  },
  plugins: [],
  featureFlags: {
    product_categories: true,
  },
  modules: {
    eventBus: {
      resolve: '@medusajs/event-bus-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    cacheService: {
      resolve: '@medusajs/cache-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  },
});

module.exports = config; 