const axios = require('axios');

// The API key we're testing
const PUBLISHABLE_API_KEY = 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';
const MEDUSA_URL = 'http://localhost:9000';

async function testCustomerRegistration() {
  try {
    // First check if the server is running
    console.log('Checking if Medusa server is running...');
    try {
      const healthCheck = await axios.get(`${MEDUSA_URL}/health`);
      console.log('Server is running, health status:', healthCheck.data);
    } catch (healthError) {
      console.error('Cannot connect to Medusa server. Make sure it is running on', MEDUSA_URL);
      console.error('Error details:', healthError.message);
      return;
    }

    console.log('1. Creating cart to establish session...');
    try {
      const cartResponse = await axios.post(`${MEDUSA_URL}/store/carts`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY
        }
      });
      
      console.log('Cart created successfully:', cartResponse.data.cart.id);
      
      // Get cookie from response
      const cookies = cartResponse.headers['set-cookie'];
      if (!cookies) {
        throw new Error('No session cookie received from cart creation');
      }
      
      console.log('2. Attempting to register a customer with the session...');
      const customerData = {
        first_name: 'Test',
        last_name: 'User',
        email: `test${Date.now()}@example.com`, // Unique email
        password: 'Password123!'
      };
      
      const registerResponse = await axios.post(`${MEDUSA_URL}/store/customers`, customerData, {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
          'Cookie': cookies.join('; ')
        }
      });
      
      console.log('Registration successful!', registerResponse.data);
      
      // After registration, try to log in
      console.log('3. Trying to log in with the created account...');
      const loginResponse = await axios.post(`${MEDUSA_URL}/store/auth`, {
        email: customerData.email,
        password: customerData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY
        }
      });
      
      console.log('Login successful!', loginResponse.data);
    } catch (apiError) {
      console.error('API Error:', apiError.message);
      if (apiError.response) {
        console.error('Response status:', apiError.response.status);
        console.error('Response data:', apiError.response.data);
      } else if (apiError.request) {
        console.error('No response received from request:', apiError.request._currentUrl);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

testCustomerRegistration(); 