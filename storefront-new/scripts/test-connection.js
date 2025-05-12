// Simple script to test connection to Medusa store products API
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

async function testProductsConnection() {
  console.log(`Testing connection to Medusa server at: ${MEDUSA_URL}`);
  
  try {
    // Test store products API
    console.log('\nTesting store products API...');
    const response = await request(`${MEDUSA_URL}/store/products`);
    console.log(`API response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Found ${data.products?.length || 0} products`);
      
      if (data.products && data.products.length > 0) {
        console.log('First product:', {
          title: data.products[0].title,
          id: data.products[0].id,
          handle: data.products[0].handle
        });
      }
    } else {
      console.log('API error:', response.statusText);
    }
  } catch (error) {
    console.error('Connection error:', error.message);
  }
}

testProductsConnection(); 