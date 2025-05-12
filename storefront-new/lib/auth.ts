// auth.ts - Authentication and customer account utilities for Medusa
import { medusaFetch } from './medusa';

// Constants for API URLs and keys
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = "pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c";

export type Customer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  billing_address?: Address;
  shipping_addresses?: Address[];
  phone?: string;
  has_account: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  is_default?: boolean;
  metadata?: Record<string, unknown>;
};

/**
 * Register a new customer
 */
export async function registerCustomer(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone?: string
): Promise<{ customer: Customer }> {
  try {
    // Use our direct register API route
    console.log('Registering customer with email:', email);
    const response = await fetch('/api/auth/direct-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone
      }),
    });

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response received from registration API');
      throw new Error('Invalid response from server');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // If registration is successful, automatically log in the customer
    try {
      await loginCustomer(email, password);
    } catch (loginError) {
      console.error('Auto-login after registration failed:', loginError);
      // Continue even if auto-login fails, as registration was successful
    }

    return data;
  } catch (error: any) {
    console.error('Error registering customer:', error);
    // Provide more specific error messages
    if (error.message && error.message.includes('already exists')) {
      throw new Error('An account with this email already exists. Please log in instead.');
    } else if (error.message && error.message.includes('401')) {
      throw new Error('Registration failed due to authentication issues. Please try again.');
    } else if (error.message && error.message.includes('Invalid response')) {
      throw new Error('Registration failed due to server error. Please try again later.');
    }
    throw error;
  }
}

/**
 * Login a customer
 */
export async function loginCustomer(
  email: string,
  password: string
): Promise<{ customer: Customer }> {
  try {
    // Use our direct login API route
    console.log('Logging in customer with email:', email);
    const response = await fetch('/api/auth/direct-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response received from login API');
      throw new Error('Invalid response from server');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store the JWT token in localStorage if it exists
    if (data.jwt && typeof window !== 'undefined') {
      localStorage.setItem('medusa_jwt', data.jwt);
      console.log('JWT token stored in localStorage');
    }

    // Store the customer data in localStorage
    if (data.customer && typeof window !== 'undefined') {
      localStorage.setItem('medusa_user', JSON.stringify(data.customer));
      console.log('Customer data stored in localStorage');
    }

    return data;
  } catch (error: any) {
    console.error('Error logging in customer:', error);
    // Provide more specific error messages
    if (error.message && error.message.includes('Invalid credentials')) {
      throw new Error('Invalid email or password. Please try again.');
    } else if (error.message && error.message.includes('401')) {
      throw new Error('Authentication failed. Please try again.');
    } else if (error.message && error.message.includes('Invalid response')) {
      throw new Error('Login failed due to server error. Please try again later.');
    }
    throw error;
  }
}

/**
 * Get the currently authenticated customer
 */
export async function getCustomer(): Promise<{ customer: Customer } | null> {
  try {
    // Use our direct me API route
    console.log('Getting current customer');
    const response = await fetch('/api/auth/direct-me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response received from me API');
      return null;
    }

    const data = await response.json();

    // Verify that we have a valid customer object
    if (data && data.customer && data.customer.id) {
      return data;
    }

    return null;
  } catch (error) {
    // Don't log 401 errors as they're expected when not logged in
    if (error instanceof Error && !error.message.includes('401')) {
      console.error('Error getting customer:', error);
    }
    return null;
  }
}

/**
 * Logout the current customer
 */
export async function logoutCustomer(): Promise<void> {
  try {
    // Use our direct logout API route
    console.log('Logging out customer');
    const response = await fetch('/api/auth/direct-logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response received from logout API');
      return; // Return without throwing an error
    }

    const data = await response.json();

    if (!data.success) {
      console.error('Logout was not successful:', data);
    }
  } catch (error) {
    console.error('Error logging out customer:', error);
    // Don't throw the error, as we want to clear the customer state anyway
  }
}

/**
 * Update customer information
 */
export async function updateCustomer(
  data: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    metadata: Record<string, unknown>;
  }>
): Promise<{ customer: Customer }> {
  try {
    const response = await medusaFetch<{ customer: Customer }>({
      method: 'POST',
      path: '/auth/customer',
      payload: data,
    });

    return response;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

/**
 * Add a shipping address for the customer
 */
export async function addShippingAddress(
  address: Omit<Address, 'id'>
): Promise<{ address: Address }> {
  try {
    console.log('Adding shipping address:', address);

    // Use our direct API route for adding addresses
    const response = await fetch('/api/auth/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
      credentials: 'include', // Important: include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from add address API:', errorData);
      throw new Error(errorData.error || 'Failed to add address');
    }

    const data = await response.json();
    console.log('Address added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
}

/**
 * Get all shipping addresses for the customer
 */
export async function getShippingAddresses(): Promise<{ addresses: Address[] }> {
  try {
    console.log('Getting shipping addresses');

    // Use our direct API route for getting addresses
    const response = await fetch('/api/auth/addresses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from get addresses API:', errorData);
      throw new Error(errorData.error || 'Failed to get addresses');
    }

    const data = await response.json();
    console.log('Addresses retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error getting addresses:', error);
    throw error;
  }
}

/**
 * Set a shipping address as default
 */
export async function setDefaultShippingAddress(addressId: string): Promise<{ address: Address }> {
  try {
    console.log('Setting shipping address as default:', addressId);

    // Use our direct API route for setting default address
    const response = await fetch(`/api/auth/addresses/${addressId}/default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from set default address API:', errorData);
      throw new Error(errorData.error || 'Failed to set default address');
    }

    const data = await response.json();
    console.log('Address set as default successfully:', data);
    return data;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
}

/**
 * Delete a shipping address
 */
export async function deleteShippingAddress(addressId: string): Promise<{ success: boolean }> {
  try {
    console.log('Deleting shipping address:', addressId);

    // Use our direct API route for deleting addresses
    const response = await fetch(`/api/auth/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from delete address API:', errorData);
      throw new Error(errorData.error || 'Failed to delete address');
    }

    const data = await response.json();
    console.log('Address deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await medusaFetch({
      method: 'POST',
      path: '/auth/customer/password-token',
      payload: { email },
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
}

/**
 * Reset password
 */
export async function resetPassword(
  token: string,
  password: string
): Promise<void> {
  try {
    await medusaFetch({
      method: 'POST',
      path: '/auth/customer/password-reset',
      payload: { token, password },
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}