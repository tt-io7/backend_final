'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { medusaStoreApi } from '../lib/medusa-client'

// Define state types
interface StoreState {
  cart: any | null
  loading: boolean
  error: Error | null
}

// Define action types
type StoreAction = 
  | { type: 'SET_CART'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }

// Define context type
interface StoreContextType {
  state: StoreState
  dispatch: React.Dispatch<StoreAction>
}

// Create context
const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Initial state
const initialState: StoreState = {
  cart: null,
  loading: false,
  error: null
}

// Reducer function
function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

// Provider component
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  useEffect(() => {
    // Initialize cart from localStorage
    const fetchInitialCart = async () => {
      const cartId = localStorage.getItem('cart_id')
      if (cartId) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          const response = await medusaStoreApi.getCart(cartId)
          dispatch({ type: 'SET_CART', payload: response.cart })
        } catch (error) {
          console.error('Error fetching cart:', error)
          localStorage.removeItem('cart_id')
          dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error : new Error('Failed to fetch cart') })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }
    
    fetchInitialCart()
  }, [])
  
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

// Custom hook to use the store context
export const useStore = () => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

// Helper functions for common operations
export const useCart = () => {
  const { state, dispatch } = useStore()
  const { cart, loading, error } = state
  
  const addItem = async (variantId: string, quantity: number = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      let cartId = localStorage.getItem('cart_id')
      
      // Create cart if it doesn't exist
      if (!cartId) {
        const response = await medusaStoreApi.createCart()
        cartId = response.cart.id
        if (cartId) {
          localStorage.setItem('cart_id', cartId)
          dispatch({ type: 'SET_CART', payload: response.cart })
        } else {
          throw new Error('Failed to create cart')
        }
      }
      
      // Add item to cart
      if (cartId) {
        const response = await medusaStoreApi.addItemToCart(cartId, {
          variant_id: variantId,
          quantity
        })
        
        dispatch({ type: 'SET_CART', payload: response.cart })
        return response.cart
      } else {
        throw new Error('Cart ID is missing')
      }
    } catch (error) {
      console.error('Error adding item to cart:', error)
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error : new Error('Failed to add item to cart') })
      return null
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }
  
  return {
    cart,
    loading,
    error,
    addItem
  }
}