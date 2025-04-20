const axios = require('axios');

// Config
const PUBLISHABLE_API_KEY = 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';
const MEDUSA_URL = 'http://localhost:9000';

// Create an axios instance that handles cookies
const api = axios.create({
  baseURL: MEDUSA_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-publishable-api-key': PUBLISHABLE_API_KEY
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
    
    // Step 2: Try the V2 standard auth flow - register with emailpass
    console.log('2. Trying emailpass registration...');
    try {
      const authResponse = await api.post('/store/auth/emailpass/register', {
        email,
        password,
        first_name: 'Test',
        last_name: 'User'
      });
      console.log('Emailpass registration successful:', !!authResponse.data);
    } catch (authError) {
      console.error('Emailpass registration error:', authError.response?.status, authError.response?.data || authError.message);
      
      // Fall back to the direct registration
      console.log('3. Falling back to direct customer registration...');
      try {
        const customerData = {
          first_name: 'Test',
          last_name: 'User',
          email,
          password,
          cart_id: cartId // Associate with the cart
        };
        
        const registerResponse = await api.post('/store/customers', customerData);
        console.log('Direct registration successful!', registerResponse.data);
      } catch (regError) {
        console.error('Direct registration error:', regError.response?.status, regError.response?.data || regError.message);
      }
    }
    
    // Step 3: Try to log in
    console.log('4. Trying to log in with the created account...');
    try {
      const loginResponse = await api.post('/store/auth/emailpass', {
        email,
        password
      });
      console.log('Login successful!', !!loginResponse.data);
    } catch (loginError) {
      console.error('Login error:', loginError.response?.status, loginError.response?.data || loginError.message);
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