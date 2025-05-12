// Test script for products using Medusa JS SDK
const { default: MedusaClient } = require('@medusajs/medusa-js');
require('dotenv').config();

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9001';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

console.log(`Using Medusa URL: ${MEDUSA_URL}`);
console.log(`Using publishable key: ${PUBLISHABLE_API_KEY.substring(0, 10)}...`);

async function testProductsAndCategories() {
  console.log(`Testing connection to Medusa server at: ${MEDUSA_URL}`);
  
  try {
    // Initialize the Medusa SDK client
    const medusa = new MedusaClient({
      baseUrl: MEDUSA_URL,
      maxRetries: 3,
      publishableApiKey: PUBLISHABLE_API_KEY
    });
    
    console.log('SDK initialized, testing products...');
    
    try {
      // Get products
      console.log('\nFetching products...');
      const { products } = await medusa.products.list();
      console.log(`Found ${products.length || 0} products`);
      
      if (products.length > 0) {
        console.log('First product:', {
          title: products[0].title,
          id: products[0].id,
          handle: products[0].handle || 'no handle'
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    try {
      // Try to get product categories (if available in your Medusa version)
      console.log('\nTrying to fetch product categories...');
      
      if (medusa.productCategories) {
        const result = await medusa.productCategories.list();
        console.log('Product categories result:', result);
        
        if (result.product_categories && result.product_categories.length > 0) {
          console.log(`Found ${result.product_categories.length} categories`);
          console.log('First category:', {
            name: result.product_categories[0].name,
            id: result.product_categories[0].id,
            handle: result.product_categories[0].handle || 'no handle'
          });
        }
      } else {
        console.log('productCategories endpoint is not available in this Medusa version');
      }
    } catch (error) {
      console.error('Error fetching product categories:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      console.log('This might be expected if your Medusa version doesn\'t support product categories yet');
      
      // Try legacy collections as fallback
      try {
        console.log('\nTrying to fetch collections (legacy)...');
        if (medusa.collections) {
          const { collections } = await medusa.collections.list();
          console.log(`Found ${collections.length || 0} collections`);
          
          if (collections.length > 0) {
            console.log('First collection:', {
              title: collections[0].title,
              id: collections[0].id,
              handle: collections[0].handle || 'no handle'
            });
          }
        } else {
          console.log('collections endpoint is not available');
        }
      } catch (collError) {
        console.error('Error fetching collections:', collError.message);
        if (collError.response) {
          console.error('Response status:', collError.response.status);
          console.error('Response data:', JSON.stringify(collError.response.data, null, 2));
        }
      }
    }
    
  } catch (error) {
    console.error('SDK initialization error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testProductsAndCategories(); 