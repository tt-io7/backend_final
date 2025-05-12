"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  variantId: string
  countryCode: string
  quantity?: number
}

export default function AddToCartButton({ 
  variantId, 
  countryCode, 
  quantity = 1 
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const addToCart = async () => {
    setIsLoading(true)
    
    try {
      // In a real app, this would call an API to add to cart
      // For now we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to cart page after adding
      router.push(`/${countryCode}/cart`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <button
      onClick={addToCart}
      disabled={isLoading}
      className="w-full py-3 px-8 flex items-center justify-center rounded-md bg-primary hover:bg-primary-dark text-white transition-colors disabled:opacity-70"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding to cart...
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  )
} 