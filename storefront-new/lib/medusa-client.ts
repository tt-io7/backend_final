import Medusa from "@medusajs/medusa-js";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9001";
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c";

// Initialize the Medusa SDK client
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
  publishableApiKey: PUBLISHABLE_API_KEY
});

// Define the types for the Medusa API
// Define the address interface
export interface Address {
  id?: string
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
  is_default?: boolean
}

// Define the Customer interface
export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  billing_address?: Address;
  shipping_addresses?: Address[];
  phone?: string;
  has_account: boolean;
  metadata?: Record<string, unknown>;
  created_at: string | Date;
  updated_at: string | Date;
}

// Define the FetchError type to handle API errors
export class FetchError extends Error {
  status?: number;
  statusText?: string;
  response?: any;
  
  constructor(message: string, options?: { status?: number, statusText?: string, response?: any }) {
    super(message);
    this.name = "FetchError";
    this.status = options?.status;
    this.statusText = options?.statusText;
    this.response = options?.response;
  }
}

// Export the store API methods for direct access
export const medusaStoreApi = {
  // Product methods
  getProducts: async (options?: any) => {
    try {
      // Filter out parameters that Medusa backend doesn't support
      const { countryCode, ...validParams } = options || {};
      
      const { products, count } = await sdk.products.list(validParams);
      return { products, count };
    } catch (error) {
      console.error("Error fetching products:", error);
      // Check if it's a connection error
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error("Cannot connect to Medusa server. Please make sure it's running.");
      }
      return { products: [], count: 0 };
    }
  },
  
  getProduct: async (handle: string) => {
    try {
      const { product } = await sdk.products.retrieve(handle);
      return { product };
      } catch (error) {
      console.error(`Error fetching product with handle ${handle}:`, error);
      // Check if it's a connection error
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error("Cannot connect to Medusa server. Please make sure it's running.");
      }
      return { product: null };
    }
  },
  
  // Categories methods
  getCategories: async (options?: any) => {
    try {
      // Filter out parameters that Medusa backend doesn't support
      const { countryCode, ...validParams } = options || {};
      
      // In Medusa, categories are called "product_categories"
      const { product_categories, count } = await sdk.productCategories.list(validParams);
      return { product_categories, count };
      } catch (error) {
      console.error("Error fetching categories:", error);
      // Check if it's a connection error
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new Error("Cannot connect to Medusa server. Please make sure it's running.");
      }
      return { product_categories: [], count: 0 };
    }
  },
  
  getCategory: async (handle: string) => {
    try {
      const { product_category } = await sdk.productCategories.retrieve(handle);
      return { category: product_category };
      } catch (error) {
      console.error(`Error fetching category with handle ${handle}:`, error);
      return { category: null };
      }
    },

  // Collections methods (legacy)
  getCollections: async (options?: any) => {
    try {
      // Filter out parameters that Medusa backend doesn't support
      const { countryCode, ...validParams } = options || {};
      
      const { collections, count } = await sdk.collections.list(validParams);
      return { collections, count };
      } catch (error) {
      console.error("Error fetching collections:", error);
      return { collections: [], count: 0 };
      }
    },

  getCollection: async (handle: string) => {
      try {
      const { collection } = await sdk.collections.retrieve(handle);
      return { collection };
      } catch (error) {
      console.error(`Error fetching collection with handle ${handle}:`, error);
      return { collection: null };
    }
  },
  
  getProductsByCategory: async (categoryId: string, options?: any) => {
    try {
      // Remove countryCode parameter that Medusa backend doesn't support
      const { countryCode, ...validParams } = options || {};
      
      // Use the filter to get products by category
      const queryOptions = {
        ...validParams,
        category_id: [categoryId]
      };
      const { products, count } = await sdk.products.list(queryOptions);
      return { products, count };
      } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      return { products: [], count: 0 };
      }
    },

  // Customer methods
  getCustomerProfile: async () => {
      try {
      const { customer } = await sdk.customers.retrieve();
      return { customer };
      } catch (error) {
      console.error("Error fetching customer profile:", error);
      return { customer: null };
      }
    },

  // Address methods
    getCustomerAddresses: async () => {
      try {
      const { customer } = await sdk.customers.retrieve();
      return { addresses: customer.shipping_addresses || [] };
      } catch (error) {
      console.error("Error fetching customer addresses:", error);
      return { addresses: [] };
    }
  },
  
  addCustomerAddress: async (address: Address) => {
    // Convert our interface to match Medusa's format
    const { customer } = await sdk.customers.addresses.addAddress({
      address: {
        first_name: address.first_name,
        last_name: address.last_name,
        address_1: address.address_1,
        address_2: address.address_2 || "",
        city: address.city,
        country_code: address.country_code,
        postal_code: address.postal_code,
        company: address.company || "",
        phone: address.phone || "",
        province: address.province || ""
      }
    });
    
    return { 
      address: customer.shipping_addresses?.find(a => 
        a.address_1 === address.address_1 && 
        a.first_name === address.first_name
      ) 
    };
  },
  
  updateCustomerAddress: async (addressId: string, address: Partial<Address>) => {
    // Convert our interface to match Medusa's format
    const addressPayload: Record<string, any> = {};
    
    if (address.first_name) addressPayload.first_name = address.first_name;
    if (address.last_name) addressPayload.last_name = address.last_name;
    if (address.address_1) addressPayload.address_1 = address.address_1;
    if (address.address_2) addressPayload.address_2 = address.address_2;
    if (address.city) addressPayload.city = address.city;
    if (address.postal_code) addressPayload.postal_code = address.postal_code;
    if (address.province) addressPayload.province = address.province;
    if (address.country_code) addressPayload.country_code = address.country_code;
    if (address.company) addressPayload.company = address.company;
    if (address.phone) addressPayload.phone = address.phone;
    
    const { customer } = await sdk.customers.addresses.updateAddress(addressId, {
      address: addressPayload
    });
    
    return { 
      address: customer.shipping_addresses?.find(a => a.id === addressId) 
    };
  },
  
  deleteCustomerAddress: async (addressId: string) => {
    await sdk.customers.addresses.deleteAddress(addressId);
  },
  
  setDefaultCustomerAddress: async (addressId: string) => {
    // For Medusa, we need to use the updateAddress endpoint with a special property
    const { customer } = await sdk.customers.addresses.updateAddress(addressId, {
      address: { country_code: "us" }, // Need to provide some value
      metadata: { is_default: true } // Use metadata to track default
    });
    
    return { 
      address: customer.shipping_addresses?.find(a => a.id === addressId) 
    };
  }
};

// Export the SDK as default
export default sdk;