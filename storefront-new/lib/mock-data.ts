import { generateId } from './utils'

// Define types for our mock data
interface MockProductVariant {
  id: string
  title: string
  prices: {
    // Make id optional to match existing data
    id?: string
    amount: number
    currency_code: string
  }[]
}

interface Product {
  id: string
  title: string
  handle: string
  description: string
  thumbnail: string
  created_at: string
  collection?: {
    id: string
    title: string
    handle: string
  }
  variants: MockProductVariant[]
  options: {
    id: string
    title: string
    values: string[]
  }[]
}

interface Category {
  id: string
  title: string
  handle: string
  parent_category_id: string | null
  description: string
  created_at: string
  updated_at: string
}

interface CartItem {
  id: string
  title: string
  description?: string
  thumbnail?: string
  variant: {
    id: string
    title: string
  }
  quantity: number
  unit_price: number
  subtotal: number
  total: number
}

interface Cart {
  id: string
  items: CartItem[]
  region: {
    id: string
    name: string
    currency_code: string
    tax_rate: number
  }
  shipping_methods: any[]
  payment_sessions: any[]
  total: number
  subtotal: number
  discount_total: number
  shipping_total: number
  tax_total: number
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: 'prod_01',
    title: 'iPhone 15 Pro',
    handle: 'iphone-15-pro',
    description: 'The latest iPhone with advanced features and powerful performance.',
    thumbnail: 'https://placehold.co/300x400/9370DB/FFFFFF?text=iPhone+15+Pro',
    created_at: '2025-01-15T00:00:00Z',
    collection: {
      id: 'col_01',
      title: 'Phones',
      handle: 'phones'
    },
    variants: [
      {
        id: 'var_01',
        title: 'iPhone 15 Pro - 128GB - Black',
        prices: [
          {
            amount: 99900,
            currency_code: 'usd'
          }
        ]
      },
      {
        id: 'var_02',
        title: 'iPhone 15 Pro - 256GB - Black',
        prices: [
          {
            amount: 109900,
            currency_code: 'usd'
          }
        ]
      },
      {
        id: 'var_03',
        title: 'iPhone 15 Pro - 512GB - Black',
        prices: [
          {
            amount: 129900,
            currency_code: 'usd'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_01',
        title: 'Storage',
        values: ['128GB', '256GB', '512GB']
      },
      {
        id: 'opt_02',
        title: 'Color',
        values: ['Black', 'Silver', 'Gold']
      }
    ]
  },
  {
    id: 'prod_02',
    title: 'Samsung Galaxy S24 Ultra',
    handle: 'samsung-galaxy-s24-ultra',
    description: 'The ultimate Android smartphone with cutting-edge technology.',
    thumbnail: 'https://placehold.co/300x400/9370DB/FFFFFF?text=Galaxy+S24',
    created_at: '2025-01-20T00:00:00Z',
    collection: {
      id: 'col_01',
      title: 'Phones',
      handle: 'phones'
    },
    variants: [
      {
        id: 'var_04',
        title: 'Samsung Galaxy S24 Ultra - 256GB - Black',
        prices: [
          {
            amount: 119900,
            currency_code: 'usd'
          }
        ]
      },
      {
        id: 'var_05',
        title: 'Samsung Galaxy S24 Ultra - 512GB - Black',
        prices: [
          {
            amount: 129900,
            currency_code: 'usd'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_03',
        title: 'Storage',
        values: ['256GB', '512GB']
      },
      {
        id: 'opt_04',
        title: 'Color',
        values: ['Black', 'White', 'Green']
      }
    ]
  },
  // Add products from the home page
  {
    id: 'p1',
    title: 'Samsung Galaxy S23 Ultra',
    handle: 'samsung-galaxy-s23-ultra',
    description: 'The ultimate smartphone experience with an advanced camera system',
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Samsung+Galaxy',
    created_at: '2025-01-10T00:00:00Z',
    collection: {
      id: 'col_01',
      title: 'Phones',
      handle: 'phones'
    },
    variants: [
      {
        id: 'var_s23_1',
        title: 'Samsung Galaxy S23 Ultra - 256GB - Black',
        prices: [
          {
            amount: 119999,
            currency_code: 'usd'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_s23_1',
        title: 'Storage',
        values: ['256GB', '512GB']
      }
    ]
  },
  {
    id: 'p2',
    title: 'iPhone 15 Pro Max',
    handle: 'iphone-15-pro-max',
    description: "Apple's most powerful iPhone with A17 Pro chip",
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=iPhone+15',
    created_at: '2025-01-05T00:00:00Z',
    collection: {
      id: 'col_01',
      title: 'Phones',
      handle: 'phones'
    },
    variants: [
      {
        id: 'var_iphone_1',
        title: 'iPhone 15 Pro Max - 256GB - Black',
        prices: [
          {
            amount: 129900,
            currency_code: 'usd'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_iphone_1',
        title: 'Storage',
        values: ['256GB', '512GB', '1TB']
      }
    ]
  },
  {
    id: 'p3',
    title: 'Sony WH-1000XM5',
    handle: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancelling wireless headphones',
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Sony+Headphones',
    created_at: '2025-02-05T00:00:00Z',
    collection: {
      id: 'col_03',
      title: 'Accessories',
      handle: 'accessories'
    },
    variants: [
      {
        id: 'var_sony_1',
        title: 'Sony WH-1000XM5 - Black',
        prices: [
          {
            amount: 39999,
            currency_code: 'usd'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_sony_1',
        title: 'Color',
        values: ['Black', 'Silver']
      }
    ]
  },
  {
    id: 'p4',
    title: 'Google Pixel 8 Pro',
    handle: 'google-pixel-8-pro',
    description: "Google's flagship phone with advanced AI capabilities",
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Google+Pixel',
    created_at: '2025-01-25T00:00:00Z',
    collection: {
      id: 'col_01',
      title: 'Phones',
      handle: 'phones'
    },
    variants: [
      {
        id: 'var_pixel_1',
        title: 'Google Pixel 8 Pro - 256GB - Black',
        prices: [
          {
            amount: 99900,
            currency_code: 'usd'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_pixel_1',
        title: 'Storage',
        values: ['128GB', '256GB', '512GB']
      },
      {
        id: 'opt_pixel_2',
        title: 'Color',
        values: ['Black', 'Silver', 'Green']
      }
    ]
  },
  {
    id: 'n1',
    title: 'Anker 20,000mAh Power Bank',
    handle: 'anker-power-bank',
    description: 'Fast charging portable battery with USB-C Power Delivery',
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Power+Bank',
    created_at: '2025-02-25T00:00:00Z',
    collection: {
      id: 'col_03',
      title: 'Accessories',
      handle: 'accessories'
    },
    variants: [
      {
        id: 'var_anker_1',
        title: 'Anker 20,000mAh Power Bank - Black',
        prices: [
          {
            amount: 4999,
            currency_code: 'usd'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_anker_1',
        title: 'Color',
        values: ['Black', 'White']
      }
    ]
  },
  {
    id: 'n2',
    title: 'Microsoft 365 Personal',
    handle: 'microsoft-365-personal',
    description: '1-year subscription for premium Office apps',
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Microsoft+365',
    created_at: '2025-02-28T00:00:00Z',
    collection: {
      id: 'col_04',
      title: 'Software',
      handle: 'software'
    },
    variants: [
      {
        id: 'var_ms365_1',
        title: 'Microsoft 365 Personal - 1 Year',
        prices: [
          {
            amount: 6999,
            currency_code: 'usd'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_ms365_1',
        title: 'Duration',
        values: ['1 Year']
      }
    ]
  }
]

// Mock categories data
const mockCategories: Category[] = [
  {
    id: 'col_01',
    title: 'Phones',
    handle: 'phones',
    parent_category_id: null,
    description: 'Latest smartphones from top brands',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'col_02',
    title: 'Laptops',
    handle: 'laptops',
    parent_category_id: null,
    description: 'Powerful laptops for work and play',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'col_03',
    title: 'Accessories',
    handle: 'accessories',
    parent_category_id: null,
    description: 'Essential accessories for your devices',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'col_04',
    title: 'Software',
    handle: 'software',
    parent_category_id: null,
    description: 'Software and digital products',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'col_05',
    title: 'Merch',
    handle: 'merch',
    parent_category_id: null,
    description: 'AndMore branded merchandise',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

// Mock cart data
let mockCart: Cart = {
  id: 'cart_' + generateId(),
  items: [],
  region: {
    id: 'reg_01',
    name: 'United States',
    currency_code: 'usd',
    tax_rate: 0.08
  },
  shipping_methods: [],
  payment_sessions: [],
  total: 0,
  subtotal: 0,
  discount_total: 0,
  shipping_total: 0,
  tax_total: 0
}

// Mock API implementation
export const mockMedusaApi = {
  getProducts: async (_options = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return mock products
    return {
      products: mockProducts,
      count: mockProducts.length
    }
  },

  getProduct: async (handle: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find product by handle
    const product = mockProducts.find(p => p.handle === handle)

    if (!product) {
      throw new Error(`Product with handle ${handle} not found`)
    }

    return {
      product
    }
  },

  getCategories: async (_options = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return mock categories
    return {
      product_categories: mockCategories,
      count: mockCategories.length
    }
  },

  getCategory: async (handle: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Find category by handle
    const category = mockCategories.find(c => c.handle === handle)

    if (!category) {
      throw new Error(`Category with handle ${handle} not found`)
    }

    return {
      product_category: category
    }
  },

  createCart: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Reset mock cart
    mockCart = {
      id: 'cart_' + generateId(),
      items: [],
      region: {
        id: 'reg_01',
        name: 'United States',
        currency_code: 'usd',
        tax_rate: 0.08
      },
      shipping_methods: [],
      payment_sessions: [],
      total: 0,
      subtotal: 0,
      discount_total: 0,
      shipping_total: 0,
      tax_total: 0
    }

    return {
      cart: mockCart
    }
  },

  getCart: async (cartId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if cart ID matches
    if (cartId !== mockCart.id) {
      throw new Error(`Cart with ID ${cartId} not found`)
    }

    return {
      cart: mockCart
    }
  },

  addItemToCart: async (cartId: string, data: { variant_id: string; quantity: number }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if cart ID matches
    if (cartId !== mockCart.id) {
      throw new Error(`Cart with ID ${cartId} not found`)
    }

    // Find variant
    let variant: MockProductVariant | null = null
    let product: Product | null = null

    for (const p of mockProducts) {
      const v = p.variants.find(v => v.id === data.variant_id)
      if (v) {
        variant = v
        product = p
        break
      }
    }

    if (!variant || !product) {
      throw new Error(`Variant with ID ${data.variant_id} not found`)
    }

    // Check if item already exists in cart
    const existingItemIndex = mockCart.items.findIndex(item => item.variant.id === data.variant_id)

    if (existingItemIndex !== -1) {
      // Update quantity
      mockCart.items[existingItemIndex].quantity += data.quantity
      mockCart.items[existingItemIndex].subtotal = mockCart.items[existingItemIndex].unit_price * mockCart.items[existingItemIndex].quantity
      mockCart.items[existingItemIndex].total = mockCart.items[existingItemIndex].subtotal
    } else {
      // Add new item
      const price = variant.prices[0].amount

      mockCart.items.push({
        id: 'item_' + generateId(),
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail,
        variant: {
          id: variant.id,
          title: variant.title
        },
        quantity: data.quantity,
        unit_price: price,
        subtotal: price * data.quantity,
        total: price * data.quantity
      })
    }

    // Update cart totals
    updateCartTotals()

    return {
      cart: mockCart
    }
  },

  updateItemQuantity: async (cartId: string, itemId: string, quantity: number) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if cart ID matches
    if (cartId !== mockCart.id) {
      throw new Error(`Cart with ID ${cartId} not found`)
    }

    // Find item
    const itemIndex = mockCart.items.findIndex(item => item.id === itemId)

    if (itemIndex === -1) {
      throw new Error(`Item with ID ${itemId} not found in cart`)
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      mockCart.items.splice(itemIndex, 1)
    } else {
      // Update quantity
      mockCart.items[itemIndex].quantity = quantity
      mockCart.items[itemIndex].subtotal = mockCart.items[itemIndex].unit_price * quantity
      mockCart.items[itemIndex].total = mockCart.items[itemIndex].subtotal
    }

    // Update cart totals
    updateCartTotals()

    return {
      cart: mockCart
    }
  },

  removeItem: async (cartId: string, itemId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if cart ID matches
    if (cartId !== mockCart.id) {
      throw new Error(`Cart with ID ${cartId} not found`)
    }

    // Find item
    const itemIndex = mockCart.items.findIndex(item => item.id === itemId)

    if (itemIndex === -1) {
      throw new Error(`Item with ID ${itemId} not found in cart`)
    }

    // Remove item
    mockCart.items.splice(itemIndex, 1)

    // Update cart totals
    updateCartTotals()

    return {
      cart: mockCart
    }
  },

  loginCustomer: async (email: string, _password: string) => {
    // This is a mock implementation that always succeeds
    // In a real app, you would validate credentials
    return {
      customer: {
        id: 'mock-customer-id',
        email: email,
        first_name: 'Mock',
        last_name: 'User',
        has_account: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  },

  applyDiscount: async (cartId: string, code: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if cart ID matches
    if (cartId !== mockCart.id) {
      throw new Error(`Cart with ID ${cartId} not found`)
    }

    // Mock discount codes
    const discounts: Record<string, number> = {
      'WELCOME10': 0.1,
      'SAVE20': 0.2,
      'FREESHIP': 0
    }

    // Check if discount code is valid
    if (!Object.keys(discounts).includes(code)) {
      throw new Error(`Discount code ${code} is invalid`)
    }

    // Apply discount
    const discountRate = discounts[code]

    if (code === 'FREESHIP') {
      // Free shipping
      mockCart.shipping_total = 0
    } else {
      // Percentage discount
      mockCart.discount_total = Math.round(mockCart.subtotal * discountRate)
    }

    // Update cart totals
    updateCartTotals()

    return {
      cart: mockCart
    }
  }
}

// Helper function to update cart totals
function updateCartTotals() {
  // Calculate subtotal
  mockCart.subtotal = mockCart.items.reduce((total, item) => total + item.subtotal, 0)

  // Calculate tax
  mockCart.tax_total = Math.round(mockCart.subtotal * mockCart.region.tax_rate)

  // Set shipping total (mock value)
  if (mockCart.shipping_total === 0 && mockCart.items.length > 0) {
    mockCart.shipping_total = 1000 // $10.00
  } else if (mockCart.items.length === 0) {
    mockCart.shipping_total = 0
  }

  // Calculate total
  mockCart.total = mockCart.subtotal - mockCart.discount_total + mockCart.shipping_total + mockCart.tax_total
}
