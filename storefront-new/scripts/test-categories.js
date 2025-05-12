// Test script for Medusa product categories API
const http = require('http');
const https = require('https');

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

function request(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const jsonData = JSON.parse(data);
            resolve({ ok: true, status: res.statusCode, json: () => jsonData });
          } else {
            resolve({ 
              ok: false, 
              status: res.statusCode, 
              statusText: res.statusMessage,
              json: () => JSON.parse(data)
            });
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.end();
  });
}

async function testCategoriesConnection() {
  console.log(`Testing connection to Medusa server at: ${MEDUSA_URL}`);
  
  try {
    // Test product categories API
    console.log('\nTesting product categories API...');
    const response = await request(`${MEDUSA_URL}/store/product-categories`);
    console.log(`API response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Found ${data.product_categories?.length || 0} product categories`);
      
      if (data.product_categories && data.product_categories.length > 0) {
        console.log('First category:', {
          name: data.product_categories[0].name,
          id: data.product_categories[0].id,
          handle: data.product_categories[0].handle
        });
      }
    } else {
      console.log('API error:', response.statusText);
      
      // Test legacy collections API as fallback
      console.log('\nTrying legacy collections API as fallback...');
      const collectionsResponse = await request(`${MEDUSA_URL}/store/collections`);
      console.log(`Collections API response status: ${collectionsResponse.status}`);
      
      if (collectionsResponse.ok) {
        const data = await collectionsResponse.json();
        console.log(`Found ${data.collections?.length || 0} collections`);
        
        if (data.collections && data.collections.length > 0) {
          console.log('First collection:', {
            title: data.collections[0].title,
            id: data.collections[0].id,
            handle: data.collections[0].handle
          });
        }
      } else {
        console.log('Collections API error:', collectionsResponse.statusText);
      }
    }
    
    // Test products API
    console.log('\nTesting products API...');
    const productsResponse = await request(`${MEDUSA_URL}/store/products`);
    console.log(`Products API response status: ${productsResponse.status}`);
    
    if (productsResponse.ok) {
      const data = await productsResponse.json();
      console.log(`Found ${data.products?.length || 0} products`);
      
      if (data.products && data.products.length > 0) {
        console.log('First product:', {
          title: data.products[0].title,
          id: data.products[0].id,
          handle: data.products[0].handle
        });
      }
    } else {
      console.log('Products API error:', productsResponse.statusText);
    }
    
  } catch (error) {
    console.error('Connection error:', error.message);
  }
}

testCategoriesConnection(); 