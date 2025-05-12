import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())
console.log("Loaded Redis URL:", process.env.REDIS_URL);
console.log("STORE_CORS:", process.env.STORE_CORS);
console.log("AUTH_CORS:", process.env.AUTH_CORS);

const logger = require("./src/utils/logger")

module.exports = defineConfig({
  projectConfig: {
    redisOptions: {
      retryStrategy: (times) => {
        logger.warn(`Redis connection attempt ${times}`)
        return Math.min(times * 50, 2000)
      }
    },
    redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret123456789",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret123456789",
    }
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  featureFlags: {
    eventBusRedisModule: true,
    redisCache: true,
    redisWorkflows: true
  },
  modules: {
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL
      }
    },
    workflows: true
  }
})
