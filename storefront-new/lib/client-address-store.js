// A simple client-side address store for demo purposes

// Get addresses from localStorage
export const getAddresses = () => {
  if (typeof window !== 'undefined') {
    const addressesJson = localStorage.getItem('user_addresses');
    if (addressesJson) {
      try {
        return JSON.parse(addressesJson);
      } catch (e) {
        console.error('Error parsing addresses from localStorage:', e);
        return [];
      }
    }
  }
  return [];
};

// Save addresses to localStorage
export const saveAddresses = (addresses) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_addresses', JSON.stringify(addresses));
  }
};

// Add a new address
export const addAddress = (address) => {
  const addresses = getAddresses();
  
  // Create a new address with ID
  const newAddress = {
    id: `addr_${Date.now()}`,
    ...address,
    is_default: address.is_default || false
  };
  
  // If this is the first address or is_default is true, make it the default
  if (addresses.length === 0 || newAddress.is_default) {
    // Set all other addresses to non-default
    addresses.forEach(addr => {
      addr.is_default = false;
    });
    newAddress.is_default = true;
  }
  
  // Add the new address
  addresses.push(newAddress);
  
  // Save the updated addresses
  saveAddresses(addresses);
  
  return newAddress;
};

// Update an existing address
export const updateAddress = (addressId, addressData) => {
  const addresses = getAddresses();
  
  // Find the address index
  const addressIndex = addresses.findIndex(addr => addr.id === addressId);
  if (addressIndex === -1) return null;
  
  // Check if we're setting this address as default
  const isSettingDefault = addressData.is_default && !addresses[addressIndex].is_default;
  
  // Update the address
  addresses[addressIndex] = {
    ...addresses[addressIndex],
    ...addressData,
    id: addressId // Ensure ID doesn't change
  };
  
  // If setting as default, update other addresses
  if (isSettingDefault) {
    addresses.forEach((addr, index) => {
      if (index !== addressIndex) {
        addr.is_default = false;
      }
    });
  }
  
  // Save the updated addresses
  saveAddresses(addresses);
  
  return addresses[addressIndex];
};

// Delete an address
export const deleteAddress = (addressId) => {
  const addresses = getAddresses();
  
  // Find the address index
  const addressIndex = addresses.findIndex(addr => addr.id === addressId);
  if (addressIndex === -1) return false;
  
  // Check if the address being deleted is the default
  const isDefault = addresses[addressIndex].is_default;
  
  // Remove the address
  addresses.splice(addressIndex, 1);
  
  // If the deleted address was the default and there are other addresses, make the first one default
  if (isDefault && addresses.length > 0) {
    addresses[0].is_default = true;
  }
  
  // Save the updated addresses
  saveAddresses(addresses);
  
  return true;
};

// Set an address as default
export const setDefaultAddress = (addressId) => {
  const addresses = getAddresses();
  
  // Find the address
  const address = addresses.find(addr => addr.id === addressId);
  if (!address) return false;
  
  // Set all addresses to non-default
  addresses.forEach(addr => {
    addr.is_default = false;
  });
  
  // Set the selected address as default
  address.is_default = true;
  
  // Save the updated addresses
  saveAddresses(addresses);
  
  return true;
};
