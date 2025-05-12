// A simple in-memory user store for demo purposes
// In a real app, this would be a database

export interface Address {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  company?: string;
  is_default: boolean;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone?: string;
  has_account: boolean;
  created_at: string;
  updated_at: string;
  shipping_addresses?: Address[];
}

// Store users by email
// Use a global variable to persist users between API route calls
let users: Record<string, User> = {};

// Try to load users from global scope if available
if (typeof global !== 'undefined' && (global as any).__users) {
  users = (global as any).__users;
} else if (typeof global !== 'undefined') {
  // Initialize with a demo user
  users['demo@example.com'] = {
    id: 'user_demo',
    email: 'demo@example.com',
    first_name: 'Demo',
    last_name: 'User',
    password: 'password123',
    has_account: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Store in global scope
  (global as any).__users = users;
}

export const userStore = {
  // Get a user by email
  getUser: (email: string): User | undefined => {
    return users[email];
  },

  // Create a new user
  createUser: (userData: Omit<User, 'id' | 'has_account' | 'created_at' | 'updated_at'>): User => {
    const userId = `user_${Date.now()}`;
    const newUser: User = {
      id: userId,
      ...userData,
      has_account: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users[userData.email] = newUser;

    // Update global store
    if (typeof global !== 'undefined') {
      (global as any).__users = users;
    }

    console.log(`User created: ${userData.email}`);
    return newUser;
  },

  // Check if a user exists
  userExists: (email: string): boolean => {
    return !!users[email];
  },

  // Authenticate a user
  authenticate: (email: string, password: string): User | null => {
    const user = users[email];
    if (user && user.password === password) {
      return user;
    }
    return null;
  },

  // Get all users (for debugging)
  getAllUsers: (): Record<string, User> => {
    return { ...users };
  },

  // Add a shipping address for a user
  addShippingAddress: (email: string, addressData: Omit<Address, 'id'>): Address | null => {
    const user = users[email];
    if (!user) return null;

    // Initialize shipping_addresses if it doesn't exist
    if (!user.shipping_addresses) {
      user.shipping_addresses = [];
    }

    // Create a new address with ID
    const addressId = `addr_${Date.now()}`;
    const newAddress: Address = {
      id: addressId,
      ...addressData
    };

    // If this is the first address or is_default is true, make it the default
    if (user.shipping_addresses.length === 0 || newAddress.is_default) {
      // Set all other addresses to non-default
      user.shipping_addresses.forEach(addr => addr.is_default = false);
      newAddress.is_default = true;
    }

    // Add the address to the user's shipping addresses
    user.shipping_addresses.push(newAddress);

    // Update global store
    if (typeof global !== 'undefined') {
      (global as any).__users = users;
    }

    console.log(`Address added for user: ${email}`);
    return newAddress;
  },

  // Delete a shipping address for a user
  deleteShippingAddress: (email: string, addressId: string): boolean => {
    const user = users[email];
    if (!user || !user.shipping_addresses) return false;

    // Find the address index
    const addressIndex = user.shipping_addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) return false;

    // Check if the address being deleted is the default
    const isDefault = user.shipping_addresses[addressIndex].is_default;

    // Remove the address
    user.shipping_addresses.splice(addressIndex, 1);

    // If the deleted address was the default and there are other addresses, make the first one default
    if (isDefault && user.shipping_addresses.length > 0) {
      user.shipping_addresses[0].is_default = true;
    }

    // Update global store
    if (typeof global !== 'undefined') {
      (global as any).__users = users;
    }

    console.log(`Address deleted for user: ${email}`);
    return true;
  },

  // Get all shipping addresses for a user
  getShippingAddresses: (email: string): Address[] => {
    const user = users[email];
    if (!user || !user.shipping_addresses) return [];
    return [...user.shipping_addresses];
  }
};
