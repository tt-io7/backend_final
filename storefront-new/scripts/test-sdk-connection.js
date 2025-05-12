// Test script for Medusa JS SDK connection
const { createClient } = require("@medusajs/js-sdk");

// Define the backend URL
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

async function testSdkConnection() {
  console.log(`Testing connection to Medusa server at: ${MEDUSA_BACKEND_URL}`);
  
  try {
    // Initialize the Medusa SDK
    const medusa = createClient({
      baseUrl: MEDUSA_BACKEND_URL,
      maxRetries: 3,
      publishableApiKey: PUBLISHABLE_API_KEY
    });
    
    console.log('SDK initialized, testing API connectivity...');
    
    // Test products endpoint
    console.log('\nTesting products API...');
    const { products } = await medusa.products.list();
    console.log(`Products API success! Found ${products.length} products`);
    if (products.length > 0) {
      console.log(`First product: ${products[0].title}`);
    }
    
    // Test regions endpoint
    console.log('\nTesting regions API...');
    const { regions } = await medusa.regions.list();
    console.log(`Regions API success! Found ${regions.length} regions`);
    
    console.log('\nAll tests passed! Medusa JS SDK connection is working properly.');
    
  } catch (error) {
    console.error('SDK Connection error:', error);
    
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
  }
}

// Run the test
testSdkConnection(); 