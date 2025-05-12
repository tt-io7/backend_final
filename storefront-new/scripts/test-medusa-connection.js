#!/usr/bin/env node

// This script tests the connection to the Medusa server
// and tries to fetch various endpoints to debug issues

// Import fetch for making API requests
const fetch = require('node-fetch');
// Load environment variables from .env files
require('dotenv').config();

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

console.log('Using Medusa URL:', MEDUSA_URL);
console.log('Using publishable key:', PUBLISHABLE_API_KEY?.substring(0, 10) + '...');

async function testEndpoint(endpoint, description) {
  console.log(`Testing ${description}...`);
  try {
    const response = await fetch(`${MEDUSA_URL}${endpoint}`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      }
    });
    const status = response.status;
    
    console.log(`Status: ${status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response:');
      console.log(JSON.stringify(data, null, 2).substring(0, 500) + '...');
    } else {
      console.log(`Error: ${response.statusText}`);
      try {
        const errorData = await response.json();
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }
    }
  } catch (error) {
    console.log(`Failed: ${error.message}`);
  }
  console.log('-'.repeat(50));
}

async function main() {
  console.log(`Testing connection to Medusa at ${MEDUSA_URL}`);
  console.log('='.repeat(50));
  
  // Test health endpoint
  await testEndpoint('/health', 'health endpoint');
  
  // Test products endpoint
  await testEndpoint('/store/products', 'products endpoint');
  
  // Test product categories endpoint
  await testEndpoint('/store/product-categories', 'product categories endpoint');
  
  // Test collections endpoint
  await testEndpoint('/store/collections', 'collections endpoint');
  
  console.log('All tests completed');
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
