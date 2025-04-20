const axios = require('axios');

// Config for your specific setup
const PUBLISHABLE_API_KEY = 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';
const MEDUSA_URL = 'http://localhost:9000';
const FRONTEND_URL = 'http://localhost:3000';

// Create an axios instance that handles cookies
const api = axios.create({
  baseURL: MEDUSA_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-publishable-api-key': PUBLISHABLE_API_KEY,
    'Origin': FRONTEND_URL
  }
});

async function testCustomerRegistration() {
  try {
    // First check if the server is running
    console.log('Checking if Medusa server is running...');
    try {
      const healthCheck = await api.get('/health');
      console.log('Server is running, health status:', healthCheck.data);
    } catch (healthError) {
      console.error('Cannot connect to Medusa server. Make sure it is running on', MEDUSA_URL);
      console.error('Error details:', healthError.message);
      return;
    }

    // Generate a unique email for testing
    const email = `test${Date.now()}@example.com`;
    const password = 'Password123!';
    
    console.log(`Email being used for testing: ${email}`);

    // Step 1: Create a cart to establish a session
    console.log('1. Creating a cart to establish session...');
    const cartResponse = await api.post('/store/carts');
    console.log('Cart created with ID:', cartResponse.data.cart.id);
    const cartId = cartResponse.data.cart.id;
    
    // Log the cookies received
    console.log('Cookies received:', cartResponse.headers['set-cookie'] ? 'Yes' : 'No');
    
    // Extract the key cookies
    if (cartResponse.headers['set-cookie']) {
      console.log('Session cookie found');
    }
    
    // Step 2: Customer registration with cart ID
    console.log('2. Registering customer with cart ID:', cartId);
    try {
      const customerData = {
        first_name: 'Test',
        last_name: 'User',
        email,
        password,
        cart_id: cartId // Associate with the cart
      };
      
      const registerResponse = await api.post('/store/customers', customerData);
      console.log('Registration successful!', registerResponse.data);
    } catch (regError) {
      console.error('Registration error:', regError.response?.data);
      
      // Print detailed header information for debugging
      if (regError.response) {
        console.log('Request headers sent:', regError.config.headers);
        console.log('Response headers received:', regError.response.headers);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCustomerRegistration(); 