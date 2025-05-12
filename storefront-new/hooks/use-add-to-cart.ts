'use client'

import { useState } from 'react'
import { useCart } from '../context/cart-context'

/**
 * Hook for adding items to cart with loading state
 */
export function useAddToCart() {
  const { addItem } = useCart()
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({})

  const addToCart = async (variantId: string, quantity: number = 1) => {
    setIsAddingToCart(prev => ({ ...prev, [variantId]: true }))
    
    try {
      await addItem(variantId, quantity)
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      return false
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [variantId]: false }))
    }
  }

  const isVariantAddingToCart = (variantId: string): boolean => {
    return isAddingToCart[variantId] || false
  }

  return {
    addToCart,
    isAddingToCart: isVariantAddingToCart
  }
} 