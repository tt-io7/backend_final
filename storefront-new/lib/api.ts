import type { Product, ProductOptionValue } from '../types/product'
import medusaApi from './medusa'

// Mock data for fallback/development when Medusa server is not available
const mockProducts: Product[] = [
  {
    id: 'prod_01',
    title: 'Wireless Headphones',
    handle: 'wireless-headphones',
    description: 'Premium sound quality with noise cancellation technology.',
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Headphones',
    images: [
      { id: 'img_01', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Headphones+1', alt: 'Headphones front view' },
      { id: 'img_02', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Headphones+2', alt: 'Headphones side view' },
    ],
    price: {
      amount: 19900,
      currency_code: 'USD',
    },
    variants: [
      {
        id: 'var_01',
        title: 'Black',
        sku: 'HP-BLK-01',
        price: {
          amount: 19900,
          currency_code: 'USD',
        },
        inventory_quantity: 10,
        options: [
          {
            id: 'opt_val_01',
            value: 'Black',
            option_id: 'opt_01'
          }
        ],
        thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Headphones',
      },
      {
        id: 'var_02',
        title: 'White',
        sku: 'HP-WHT-01',
        price: {
          amount: 19900,
          currency_code: 'USD',
        },
        inventory_quantity: 5,
        options: [
          {
            id: 'opt_val_02',
            value: 'White',
            option_id: 'opt_01'
          }
        ],
        thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Headphones',
      },
    ],
    options: [
      {
        id: 'opt_01',
        title: 'Color',
        values: [
          {
            id: 'opt_val_01',
            value: 'Black',
            option_id: 'opt_01'
          },
          {
            id: 'opt_val_02',
            value: 'White',
            option_id: 'opt_01'
          }
        ],
      },
    ],
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'prod_02',
    title: 'Smartwatch',
    handle: 'smartwatch',
    description: 'Track your fitness and stay connected with notifications.',
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Smartwatch',
    images: [
      { id: 'img_03', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Smartwatch+1', alt: 'Smartwatch front view' },
      { id: 'img_04', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Smartwatch+2', alt: 'Smartwatch side view' },
    ],
    price: {
      amount: 24900,
      currency_code: 'USD',
    },
    compare_at_price: {
      amount: 29900,
      currency_code: 'USD',
    },
    variants: [
      {
        id: 'var_03',
        title: 'Black',
        sku: 'SW-BLK-01',
        price: {
          amount: 24900,
          currency_code: 'USD',
        },
        compare_at_price: {
          amount: 29900,
          currency_code: 'USD',
        },
        inventory_quantity: 8,
        options: [
          {
            id: 'opt_val_03',
            value: 'Black',
            option_id: 'opt_02'
          }
        ],
        thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Smartwatch',
      },
    ],
    options: [
      {
        id: 'opt_02',
        title: 'Color',
        values: [
          {
            id: 'opt_val_03',
            value: 'Black',
            option_id: 'opt_02'
          }
        ],
      },
    ],
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-01T00:00:00Z',
  },
  {
    id: 'prod_03',
    title: 'Ultra Slim Laptop',
    handle: 'ultra-slim-laptop',
    description: 'Powerful performance in a sleek, lightweight design.',
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Laptop',
    images: [
      { id: 'img_05', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Laptop+1', alt: 'Laptop front view' },
      { id: 'img_06', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Laptop+2', alt: 'Laptop open view' },
    ],
    price: {
      amount: 99900,
      currency_code: 'USD',
    },
    variants: [
      {
        id: 'var_04',
        title: '8GB RAM / 256GB SSD',
        sku: 'LP-8-256',
        price: {
          amount: 99900,
          currency_code: 'USD',
        },
        inventory_quantity: 3,
        options: [
          {
            id: 'opt_val_04',
            value: '8GB RAM / 256GB SSD',
            option_id: 'opt_03'
          }
        ],
        thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Laptop',
      },
      {
        id: 'var_05',
        title: '16GB RAM / 512GB SSD',
        sku: 'LP-16-512',
        price: {
          amount: 129900,
          currency_code: 'USD',
        },
        inventory_quantity: 2,
        options: [
          {
            id: 'opt_val_05',
            value: '16GB RAM / 512GB SSD',
            option_id: 'opt_03'
          }
        ],
        thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Laptop',
      },
    ],
    options: [
      {
        id: 'opt_03',
        title: 'Configuration',
        values: [
          {
            id: 'opt_val_04',
            value: '8GB RAM / 256GB SSD',
            option_id: 'opt_03'
          },
          {
            id: 'opt_val_05',
            value: '16GB RAM / 512GB SSD',
            option_id: 'opt_03'
          }
        ],
      },
    ],
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2023-03-01T00:00:00Z',
  },
  {
    id: 'prod_04',
    title: 'Wireless Earbuds Pro',
    handle: 'wireless-earbuds-pro',
    description: 'Premium sound quality with active noise cancellation.',
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Earbuds',
    images: [
      { id: 'img_07', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Earbuds+1', alt: 'Earbuds in case' },
      { id: 'img_08', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Earbuds+2', alt: 'Earbuds outside case' },
    ],
    price: {
      amount: 12900,
      currency_code: 'USD',
    },
    variants: [
      {
        id: 'var_06',
        title: 'Black',
        sku: 'EB-BLK-01',
        price: {
          amount: 12900,
          currency_code: 'USD',
        },
        inventory_quantity: 15,
        options: [
          {
            id: 'opt_val_06',
            value: 'Black',
            option_id: 'opt_04'
          }
        ],
        thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Earbuds',
      },
      {
        id: 'var_07',
        title: 'White',
        sku: 'EB-WHT-01',
        price: {
          amount: 12900,
          currency_code: 'USD',
        },
        inventory_quantity: 12,
        options: [
          {
            id: 'opt_val_07',
            value: 'White',
            option_id: 'opt_04'
          }
        ],
        thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Earbuds',
      },
    ],
    options: [
      {
        id: 'opt_04',
        title: 'Color',
        values: [
          {
            id: 'opt_val_06',
            value: 'Black',
            option_id: 'opt_04'
          },
          {
            id: 'opt_val_07',
            value: 'White',
            option_id: 'opt_04'
          }
        ],
      },
    ],
    created_at: '2023-04-01T00:00:00Z',
    updated_at: '2023-04-01T00:00:00Z',
  },
]

/**
 * Fetches all products with optional filtering
 */
export async function fetchProducts(options?: {
  limit?: number
  offset?: number
  filters?: Record<string, any>
}): Promise<Product[]> {
  try {
    // Try to fetch from Medusa backend
    const response = await medusaApi.products.list({
      limit: options?.limit || 12,
      offset: options?.offset || 0,
      ...options?.filters
    })
    
    // Map Medusa products to our Product type
    return response.products.map(mapMedusaProduct)
  } catch (error) {
    console.warn('Error fetching from Medusa, using mock data:', error)
    // Fallback to mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts)
      }, 500)
    })
  }
}

/**
 * Fetches a product by handle
 */
export async function fetchProductByHandle(handle: string): Promise<Product | null> {
  try {
    // Try to fetch from Medusa backend
    const response = await medusaApi.products.retrieve(handle)
    return mapMedusaProduct(response.product)
  } catch (error) {
    console.warn('Error fetching from Medusa, using mock data:', error)
    // Fallback to mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find((p) => p.handle === handle)
        resolve(product || null)
      }, 500)
    })
  }
}

/**
 * Fetches featured products from the Medusa backend
 * @returns Array of featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { products } = await medusaApi.products.list({
      limit: 6,
      collection_id: ['featured'],
    });

    if (!products || products.length === 0) {
      return mockProducts;
    }

    return products;
  } catch (error) {
    return mockProducts;
  }
}

/**
 * Fetches new arrivals
 */
export async function fetchNewArrivals(): Promise<Product[]> {
  try {
    // Create a date 30 days ago in ISO format
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { products } = await medusaApi.products.list({
      limit: 3,
      // Use a simple string query parameter instead of an object
      order: "created_at:desc"
    });

    if (!products || products.length === 0) {
      return mockProducts.slice(0, 3);
    }

    return products;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return mockProducts.slice(0, 3);
  }
}

/**
 * Searches products by query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // Try to fetch from Medusa backend with a search query
    const response = await medusaApi.products.list({
      q: query
    })
    
    return response.products.map(mapMedusaProduct)
  } catch (error) {
    console.warn('Error fetching from Medusa, using mock data:', error)
    // Fallback to mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockProducts.filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        resolve(results)
      }, 500)
    })
  }
}

/**
 * Maps a Medusa product to our Product type
 */
function mapMedusaProduct(medusaProduct: any): Product {
  // Return early if medusaProduct is undefined or null
  if (!medusaProduct) {
    return {
      id: `empty-${Math.random().toString(36).substring(7)}`,
      title: 'Placeholder Product',
      handle: 'placeholder-product',
      description: 'This is a placeholder product.',
      thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Placeholder',
      images: [],
      price: {
        amount: 0,
        currency_code: 'USD',
      },
      variants: [
        {
          id: `var-empty-${Math.random().toString(36).substring(7)}`,
          title: 'Default Variant',
          sku: 'DEFAULT-SKU',
          price: {
            amount: 0,
            currency_code: 'USD',
          },
          inventory_quantity: 0,
          options: [],
          thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Placeholder',
        },
      ],
      options: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {},
    };
  }

  // Map option values first for easier variant mapping
  const mappedOptions = medusaProduct.options?.map((option: any) => ({
    id: option?.id || `opt-${Math.random().toString(36).substring(7)}`,
    title: option?.title || 'Option',
    values: option?.values?.map((val: any) => ({
      id: val?.id || `val-${Math.random().toString(36).substring(7)}`,
      value: val?.value || 'Value',
      option_id: option?.id || `opt-${Math.random().toString(36).substring(7)}`
    })) || [],
  })) || [];

  // Safely access nested properties
  const firstVariant = medusaProduct.variants?.[0] || {};
  const firstPrice = firstVariant.prices?.[0] || {};

  return {
    id: medusaProduct.id || `prod-${Math.random().toString(36).substring(7)}`,
    title: medusaProduct.title || 'Untitled Product',
    handle: medusaProduct.handle || 'untitled-product',
    description: medusaProduct.description || '',
    thumbnail: medusaProduct.thumbnail || '',
    images: medusaProduct.images?.map((img: any) => ({
      id: img?.id || `img-${Math.random().toString(36).substring(7)}`,
      url: img?.url || '',
      alt: img?.alt || medusaProduct.title || 'Product Image'
    })) || [],
    price: {
      amount: firstPrice?.amount || 0,
      currency_code: firstPrice?.currency_code || 'USD',
    },
    compare_at_price: firstVariant.original_price && firstVariant.calculated_price < firstVariant.original_price 
      ? {
          amount: firstVariant.original_price || 0,
          currency_code: firstPrice?.currency_code || 'USD',
        }
      : undefined,
    variants: medusaProduct.variants?.map((variant: any) => {
      const variantPrice = variant?.prices?.[0] || {};
      
      return {
        id: variant?.id || `var-${Math.random().toString(36).substring(7)}`,
        title: variant?.title || 'Default Variant',
        sku: variant?.sku || '',
        price: {
          amount: variantPrice?.amount || 0,
          currency_code: variantPrice?.currency_code || 'USD',
        },
        compare_at_price: variant?.original_price && variant?.calculated_price < variant?.original_price
          ? {
              amount: variant.original_price || 0,
              currency_code: variantPrice?.currency_code || 'USD',
            }
          : undefined,
        inventory_quantity: variant?.inventory_quantity || 0,
        options: variant?.options?.map((option: any) => {
          // Find the corresponding option value from our mapped options
          const optionObj = mappedOptions.find((o: { id: string }) => o.id === option?.option_id);
          const valueObj = optionObj?.values.find((v: { value: string }) => v.value === option?.value);
          
          return {
            id: valueObj?.id || `opt-val-${Math.random().toString(36).substring(7)}`,
            value: option?.value || '',
            option_id: option?.option_id || ''
          };
        }) || [],
        thumbnail: variant?.thumbnail || medusaProduct.thumbnail || '',
      };
    }) || [
      // Include a default variant if none exist
      {
        id: `default-${Math.random().toString(36).substring(7)}`,
        title: 'Default Variant',
        sku: '',
        price: {
          amount: 0,
          currency_code: 'USD',
        },
        inventory_quantity: 0,
        options: [],
        thumbnail: medusaProduct.thumbnail || '',
      }
    ],
    options: mappedOptions,
    created_at: medusaProduct.created_at || new Date().toISOString(),
    updated_at: medusaProduct.updated_at || new Date().toISOString(),
    metadata: medusaProduct.metadata || {},
  };
} 