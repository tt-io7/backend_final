'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useCart as useHooksCart } from '../hooks/use-cart'
import { useStore } from './store-context'

/**
 * This component serves as a bridge between the two cart implementations:
 * 1. The hooks/use-cart.tsx implementation
 * 2. The context/store-context.tsx implementation
 * 
 * It synchronizes actions between them to ensure compatibility with
 * components that might be using either implementation.
 */
export function CartBridge({ children }: { children: ReactNode }) {
  const hooksCart = useHooksCart()
  const { state, dispatch } = useStore()
  
  // Sync cart state from hooks implementation to store context
  useEffect(() => {
    if (hooksCart.cart) {
      dispatch({ type: 'SET_CART', payload: hooksCart.cart })
    }
  }, [hooksCart.cart, dispatch])
  
  // Sync loading state
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: hooksCart.loading })
  }, [hooksCart.loading, dispatch])
  
  return <>{children}</>
}