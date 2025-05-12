import Medusa from "@medusajs/medusa-js"

// Create a client instance
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// Create a client for server-side usage
export const createMedusaClient = () => {
  return new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    maxRetries: 3,
    publishableApiKey: PUBLISHABLE_API_KEY
  })
}

// Create a singleton client for client-side usage
let medusaClient: Medusa | null = null

export const getMedusaClient = () => {
  if (!medusaClient) {
    medusaClient = new Medusa({
      baseUrl: MEDUSA_BACKEND_URL,
      maxRetries: 3,
      publishableApiKey: PUBLISHABLE_API_KEY
    })
  }
  return medusaClient
}
