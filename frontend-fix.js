/**
 * Customer registration implementation for Medusa v2.6.1
 * This implementation handles the two-step process required by Medusa:
 * 1. First get a cart to establish a session
 * 2. Then register the customer
 */

// Example function to register a customer (in React/Next.js app)
async function registerCustomer(customerData) {
  const MEDUSA_BACKEND_URL = 'http://localhost:9000';
  
  try {
    // Initialize cart to get session
    const cartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c'
      }
    });
    
    if (!cartResponse.ok) {
      throw new Error('Failed to create cart');
    }
    
    const { cart } = await cartResponse.json();
    console.log('Cart created with ID:', cart.id);
    
    // Now register the customer with cart_id
    const registerData = {
      ...customerData,
      cart_id: cart.id
    };
    
    const registerResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
      method: 'POST',
      credentials: 'include', // Important: this sends cookies
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c'
      },
      body: JSON.stringify(registerData)
    });
    
    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return await registerResponse.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Example React component (simplified)
/*
import { useState } from 'react';

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await registerCustomer(formData);
      console.log('Registration successful:', result);
      // Redirect to login or automatically log in the user
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input 
          type="text" 
          id="first_name" 
          name="first_name" 
          value={formData.first_name} 
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="last_name">Last Name</label>
        <input 
          type="text" 
          id="last_name" 
          name="last_name" 
          value={formData.last_name} 
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange}
          required
          minLength="8"
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
*/

// ----- END OF CODE TO COPY -----

// For testing purposes
async function testRegistration() {
  // This is a test implementation that simulates what would happen in your frontend
  const MEDUSA_BACKEND_URL = 'http://localhost:9000';
  
  try {
    console.log('Creating cart to get session...');
    const cartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c'
      }
    });
    
    if (!cartResponse.ok) {
      throw new Error(`Failed to create cart: ${cartResponse.status}`);
    }
    
    const cartData = await cartResponse.json();
    console.log('Cart created with ID:', cartData.cart.id);
    
    // Register a test customer
    const email = `test${Date.now()}@example.com`;
    console.log(`Using test email: ${email}`);
    
    const registerData = {
      first_name: 'Test',
      last_name: 'User',
      email,
      password: 'Password123!',
      cart_id: cartData.cart.id
    };
    
    console.log('Registering customer...');
    const registerResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c'
      },
      body: JSON.stringify(registerData)
    });
    
    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      throw new Error(`Registration failed: ${errorData.message}`);
    }
    
    const result = await registerResponse.json();
    console.log('Registration successful:', result);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Only run this if we're executing this file directly
if (require.main === module) {
  console.log('Running test registration flow...');
  testRegistration();
} 