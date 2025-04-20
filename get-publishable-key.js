const axios = require('axios');

async function getPublishableKey() {
  try {
    // Define the publishable API key we're trying to validate
    const apiKey = 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';
    
    // Try to use the API key to make a request to verify it works
    const response = await axios.get('http://localhost:9000/store/products', {
      headers: {
        'x-publishable-api-key': apiKey
      }
    });
    
    console.log('API key is valid. Products:', response.data);
  } catch (error) {
    console.error('Error using publishable API key:', error.response ? error.response.data : error.message);

    // Check if the API is running at all
    try {
      const statusResponse = await axios.get('http://localhost:9000/health');
      console.log('API is running. Health status:', statusResponse.data);
    } catch (healthError) {
      console.error('API might not be running properly:', healthError.message);
    }
  }
}

getPublishableKey();