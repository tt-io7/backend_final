'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export default function ErrorBoundary({ 
  children, 
  fallback 
}: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Create an error handler for unhandled errors
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault()
      setError(event.error || new Error(event.message))
      setHasError(true)
      
      // Log the error to the console
      console.error('Error caught by ErrorBoundary:', event.error || event.message)
    }

    // Create a promise rejection handler
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      setError(new Error(`Unhandled Promise Rejection: ${event.reason}`))
      setHasError(true)
      
      // Log the rejection to the console
      console.error('Promise rejection caught by ErrorBoundary:', event.reason)
    }

    // Add event listeners
    window.addEventListener('error', errorHandler)
    window.addEventListener('unhandledrejection', rejectionHandler)

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('error', errorHandler)
      window.removeEventListener('unhandledrejection', rejectionHandler)
    }
  }, [])

  // If there's an error, show the fallback UI or the default error UI
  if (hasError) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-900">Something went wrong</h2>
          <p className="mb-4 text-gray-600 text-center">
            We're sorry, but an error occurred while processing your request.
          </p>
          {error && (
            <div className="mb-4 p-3 bg-gray-100 rounded-md overflow-auto max-h-32">
              <p className="text-sm text-gray-700 font-mono">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reload Page
            </button>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // If there's no error, render the children
  return <>{children}</>
}

/**
 * A component that displays an error message for API errors
 */
export function ApiErrorMessage({ 
  error, 
  resetError 
}: { 
  error: Error | string,
  resetError?: () => void
}) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {errorMessage}
          </p>
          {resetError && (
            <button
              onClick={resetError}
              className="mt-2 text-sm text-red-700 underline hover:text-red-800"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * A component that displays a toast notification for errors
 */
export function ErrorToast({ 
  message, 
  onClose 
}: { 
  message: string, 
  onClose: () => void 
}) {
  useEffect(() => {
    // Auto-close the toast after 5 seconds
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-white rounded-lg shadow-lg border-l-4 border-red-500 overflow-hidden">
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">Error</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-red-100 h-1 w-full animate-shrink"></div>
    </div>
  )
}