// This file is used for production
console.log("Loading medusa-config.js in environment:", process.env.NODE_ENV);

const { createConfig } = require('@medusajs/medusa/dist/config');

/**
 * @type {import('@medusajs/medusa').ConfigModule}
 */
const config = createConfig({
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: process.env.DATABASE_URL,
    database_type: 'postgres',
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
    auth_cors: process.env.AUTH_CORS,
    jwt_secret: process.env.JWT_SECRET || 'supersecret',
    cookie_secret: process.env.COOKIE_SECRET || 'supersecret',
    worker_mode: process.env.MEDUSA_WORKER_MODE || "combined",
  },
  plugins: [],
  featureFlags: {
    product_categories: true,
  },
  modules: {
    // Add imported modules here
  },
});

module.exports = config; 