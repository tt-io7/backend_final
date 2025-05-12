'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ErrorToast } from '../components/ErrorBoundary'

interface ErrorContextType {
  showError: (message: string) => void
  clearError: () => void
  hasError: boolean
  errorMessage: string | null
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  const showError = useCallback((message: string) => {
    setErrorMessage(message)
    setHasError(true)
    
    // Log the error to the console
    console.error('Error:', message)
  }, [])

  const clearError = useCallback(() => {
    setErrorMessage(null)
    setHasError(false)
  }, [])

  return (
    <ErrorContext.Provider value={{ showError, clearError, hasError, errorMessage }}>
      {children}
      {hasError && errorMessage && (
        <ErrorToast message={errorMessage} onClose={clearError} />
      )}
    </ErrorContext.Provider>
  )
}

export function useError() {
  const context = useContext(ErrorContext)
  
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  
  return context
}

/**
 * A higher-order function that wraps an async function with error handling
 * @param fn The async function to wrap
 * @param errorHandler A function to handle errors (defaults to showing an error toast)
 * @returns A wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: Error) => void
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args)
    } catch (error) {
      if (errorHandler) {
        errorHandler(error as Error)
      } else {
        // Get the error context
        const context = useContext(ErrorContext)
        
        if (context) {
          context.showError((error as Error).message || 'An unexpected error occurred')
        } else {
          console.error('Error occurred but no error context was available:', error)
        }
      }
      
      // Re-throw the error to allow the caller to handle it if needed
      throw error
    }
  }
}