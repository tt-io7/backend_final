const axios = require('axios');
require('dotenv').config();

async function createPublishableKey() {
  try {
    // First authenticate to get a session
    const authResponse = await axios.post('http://localhost:9000/admin/auth', {
      email: 'admin@example.com',
      password: 'supersecret'
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    
    console.log('Authentication successful');
    
    // Get cookie from auth response
    const cookies = authResponse.headers['set-cookie'];
    
    if (!cookies) {
      console.error('No cookies returned from authentication');
      return;
    }
    
    // Create a publishable API key
    const response = await axios.post('http://localhost:9000/admin/publishable-api-keys', {
      title: 'Storefront',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    });
    
    console.log('Created Publishable API Key:', response.data);
    
    // Now let's activate it by linking it to a sales channel
    if (response.data.publishable_api_key) {
      const keyId = response.data.publishable_api_key.id;
      const key = response.data.publishable_api_key.key;
      
      console.log('New Publishable API Key:', key);
      console.log('Add this to your .env file as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=' + key);
      
      // First, get the sales channels
      const salesChannelsResponse = await axios.get('http://localhost:9000/admin/sales-channels', {
        headers: {
          'Cookie': cookies
        }
      });
      
      if (salesChannelsResponse.data.sales_channels && salesChannelsResponse.data.sales_channels.length > 0) {
        const salesChannelId = salesChannelsResponse.data.sales_channels[0].id;
        
        // Link the sales channel to the publishable API key
        const linkResponse = await axios.post(`http://localhost:9000/admin/publishable-api-keys/${keyId}/sales-channels`, {
          sales_channel_ids: [salesChannelId]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies
          }
        });
        
        console.log('Linked Sales Channel to Publishable API Key:', linkResponse.data);
      } else {
        console.log('No sales channels found');
      }
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

createPublishableKey();