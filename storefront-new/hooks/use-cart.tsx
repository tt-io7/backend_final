'use client'

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { medusaStoreApi } from '../lib/medusa-client'

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

// Extend the medusaStoreApi type to include the missing methods
declare module '../lib/medusa-client' {
  interface MedusaStoreApi {
    updateItemQuantity: (cartId: string, itemId: string, quantity: number) => Promise<{ cart: Cart }>
    removeItem: (cartId: string, itemId: string) => Promise<{ cart: Cart }>
  }
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
          const { cart: existingCart } = await medusaStoreApi.getCart(existingCartId)
          setCart(existingCart)
          return
        } catch (err) {
          console.warn('Could not retrieve existing cart, creating a new one')
          // If cart doesn't exist, create a new one
          if (typeof window !== 'undefined') {
            localStorage.removeItem(CART_ID_KEY)
          }
        }
      }
      
      // Create a new cart
      const { cart: newCart } = await medusaStoreApi.createCart()
      setCart(newCart)
      saveCartId(newCart.id)
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
      
      const { cart: refreshedCart } = await medusaStoreApi.getCart(cartId)
      setCart(refreshedCart)
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
        const { cart: newCart } = await medusaStoreApi.createCart()
        cartId = newCart.id
        saveCartId(newCart.id)
      }
      
      // Add item to cart - we know cartId is not null at this point
      const { cart: updatedCart } = await medusaStoreApi.addItemToCart(cartId!, {
        variant_id: variantId,
        quantity
      })
      
      setCart(updatedCart)
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
      if (!cartId) throw new Error('No cart found')
      
      // Call the Medusa API to update the item quantity
      const { cart: updatedCart } = await medusaStoreApi.updateItemQuantity(cartId, itemId, quantity)
      
      setCart(updatedCart)
    } catch (err) {
      console.error('Error updating item quantity:', err)
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
      if (!cartId) throw new Error('No cart found')
      
      // Call the Medusa API to remove the item from the cart
      const { cart: updatedCart } = await medusaStoreApi.removeItem(cartId, itemId)
      
      setCart(updatedCart)
    } catch (err) {
      console.error('Error removing item from cart:', err)
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
      const { cart: newCart } = await medusaStoreApi.createCart()
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
    initializeCart()
  }, [initializeCart])
  
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
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}