'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { sdk, FetchError, Customer } from '../medusa-client'

// Define the Auth Context shape
interface AuthContextType {
  customer: Customer | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  refetchCustomer: () => Promise<void>
  error: string | null
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch customer profile
  const refetchCustomer = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      try {
        const { customer } = await sdk.customers.retrieve()
        setCustomer(customer as Customer)
      } catch (err) {
        console.error('Error fetching customer profile:', err)
        setCustomer(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Check authentication on mount
  useEffect(() => {
    refetchCustomer()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get session
      const { customer } = await sdk.auth.getSession({
        email,
        password
      })
      
      if (customer) {
        setCustomer(customer as Customer)
      } else {
        await refetchCustomer()
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Invalid email or password')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await sdk.auth.deleteSession()
      
      setCustomer(null)
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Create the customer
      try {
        const { customer } = await sdk.customers.create({
          first_name: firstName,
          last_name: lastName,
          email,
          password
        })
        
        // Automatically log in after registration
        await login(email, password)
      } catch (error: any) {
        console.error('Registration error:', error)
        
        // Handle existing customer error
        if (error.message?.includes('already exists')) {
          setError('An account with this email already exists')
        } else {
          setError(error.message || 'Error creating account')
        }
        
        throw error
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        logout,
        register,
        refetchCustomer,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
