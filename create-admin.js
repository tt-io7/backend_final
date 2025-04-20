const axios = require('axios');

async function createAdmin() {
  try {
    // Create an admin user
    const response = await axios.post('http://localhost:9000/admin/users', {
      email: 'admin@example.com',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User'
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Created Admin User:', response.data);
  } catch (error) {
    console.error('Error creating admin user:', error.response ? error.response.data : error.message);
  }
}

createAdmin();