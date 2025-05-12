'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

interface CartItem {
  id: string
  title: string
  description?: string
  thumbnail?: string
  variant: {
    id: string
    title: string
    prices: {
      amount: number
      currency_code: string
    }[]
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

interface CartContext {
  cart: Cart | null
  loading: boolean
  error: Error | null
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContext | undefined>(undefined)

// Local storage key for cart ID
const CART_ID_KEY = 'medusa_cart_id'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Get cart ID from local storage
  const getCartId = useCallback(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(CART_ID_KEY)
  }, [])
  
  // Save cart ID to local storage
  const saveCartId = useCallback((cartId: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(CART_ID_KEY, cartId)
  }, [])
  
  // Initialize cart
  const initializeCart = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const existingCartId = getCartId()
      
      if (existingCartId) {
        // Try to get existing cart
        try {
          const response = await fetch(`/api/carts?id=${existingCartId}`)
          const data = await response.json()
          
          if (response.ok && data.cart) {
            setCart(data.cart)
            return
          }
        } catch (err) {
          console.error('Error fetching existing cart:', err)
          // Continue to create a new cart if fetching fails
        }
      }
      
      // Create a new cart
      const response = await fetch('/api/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create cart')
      }
      
      setCart(data.cart)
      saveCartId(data.cart.id)
    } catch (err) {
      console.error('Error initializing cart:', err)
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
    } finally {
      setLoading(false)
    }
  }, [getCartId, saveCartId])
  
  // Refresh cart
  const refreshCart = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const cartId = getCartId()
      
      if (!cartId) {
        await initializeCart()
        return
      }
      
      const response = await fetch(`/api/carts?id=${cartId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cart')
      }
      
      setCart(data.cart)
    } catch (err) {
      console.error('Error refreshing cart:', err)
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
    } finally {
      setLoading(false)
    }
  }, [getCartId, initializeCart])
  
  // Add item to cart
  const addItem = useCallback(async (variantId: string, quantity: number) => {
    setLoading(true)
    setError(null)
    
    try {
      let cartId = getCartId()
      
      // If no cart exists, create one
      if (!cartId) {
        const response = await fetch('/api/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create cart')
        }
        
        cartId = data.cart.id
        saveCartId(cartId)
      }
      
      // Add item to cart
      const response = await fetch(`/api/cart-items?cartId=${cartId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          quantity
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item to cart')
      }
      
      setCart(data.cart)
    } catch (err) {
      console.error('Error adding item to cart:', err)
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [getCartId, saveCartId])
  
  // Update item quantity
  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const cartId = getCartId()
      
      if (!cartId) {
        throw new Error('No cart found')
      }
      
      const response = await fetch(`/api/cart-items?cartId=${cartId}&itemId=${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update item')
      }
      
      setCart(data.cart)
    } catch (err) {
      console.error('Error updating item:', err)
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [getCartId])
  
  // Remove item from cart
  const removeItem = useCallback(async (itemId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const cartId = getCartId()
      
      if (!cartId) {
        throw new Error('No cart found')
      }
      
      const response = await fetch(`/api/cart-items?cartId=${cartId}&itemId=${itemId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove item')
      }
      
      setCart(data.cart)
    } catch (err) {
      console.error('Error removing item:', err)
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [getCartId])
  
  // Clear cart
  const clearCart = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Remove cart ID from local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_ID_KEY)
      }
      
      // Create a new cart
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      const newCart = data.cart
      setCart(newCart)
      saveCartId(newCart.id)
    } catch (err) {
      console.error('Error clearing cart:', err)
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [saveCartId])
  
  // Initialize cart on mount
  useEffect(() => {
    // We only want to initialize the cart once when the component mounts
    // not on every render
    initializeCart();
    
    // Don't include any dependencies to prevent re-initializing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const value = {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart
  }
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}