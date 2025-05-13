# Railway Environment Variables Setup

Make sure the following environment variables are correctly set in your Railway project:

## Required Environment Variables

```
# Database and Redis
DATABASE_URL=<your PostgreSQL connection string>
REDIS_URL=<your Redis connection string>

# Security
JWT_SECRET=<generate a secure random string>
COOKIE_SECRET=<generate a secure random string>

# CORS settings
STORE_CORS=<your frontend URL(s), comma-separated>
ADMIN_CORS=<your admin dashboard URL(s), comma-separated>
AUTH_CORS=<your authentication app URL(s), comma-separated>
MEDUSA_BACKEND_URL=<your deployed backend URL>

# Mode settings
NODE_ENV=production
```

## Example Values

```
# Mode
NODE_ENV=production

# CORS settings (replace with your actual domains)
STORE_CORS=https://your-storefront.com,http://localhost:8000
ADMIN_CORS=https://your-admin.com,http://localhost:7000
AUTH_CORS=https://your-storefront.com,https://your-admin.com,http://localhost:8000,http://localhost:7000
MEDUSA_BACKEND_URL=https://your-backend.railway.app

# Security (generate random secure strings)
JWT_SECRET=a_very_long_random_string_at_least_32_characters
COOKIE_SECRET=another_very_long_random_string_at_least_32_characters
```

## Generating Secure Secrets

You can generate secure random strings for JWT_SECRET and COOKIE_SECRET using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Important Notes

1. Make sure the database and Redis URLs are correctly set and accessible
2. The CORS URLs should include your deployed frontend URLs
3. For local development, also include localhost URLs
4. The MEDUSA_BACKEND_URL should be the URL of your deployed backend on Railway 