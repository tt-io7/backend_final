'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '../lib/utils'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface CartSummaryProps {
  subtotal: number
  shipping: number
  tax: number
  total: number
  discount?: number
  discountCode?: string
  onApplyDiscount?: (code: string) => Promise<void>
  onProceedToCheckout?: () => void
  loading?: boolean
}

export default function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  discount = 0,
  discountCode = '',
  onApplyDiscount,
  onProceedToCheckout,
  loading = false
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('')
  const [applyingDiscount, setApplyingDiscount] = useState(false)
  const [discountError, setDiscountError] = useState('')
  const [discountSuccess, setDiscountSuccess] = useState(false)
  
  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!promoCode.trim() || !onApplyDiscount) return
    
    setApplyingDiscount(true)
    setDiscountError('')
    setDiscountSuccess(false)
    
    try {
      await onApplyDiscount(promoCode)
      setPromoCode('')
      setDiscountSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setDiscountSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error applying discount:', err)
      setDiscountError('Invalid discount code')
    } finally {
      setApplyingDiscount(false)
    }
  }
  
  const handleProceedToCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout()
    }
  }
  
  // Calculate estimated delivery date (5 business days from now)
  const getEstimatedDeliveryDate = () => {
    const date = new Date()
    let businessDays = 5
    while (businessDays > 0) {
      date.setDate(date.getDate() + 1)
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        businessDays--
      }
    }
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }
  
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</p>
          </div>
          
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-green-600 flex items-center">
                Discount
                {discountCode && <span className="ml-1">({discountCode})</span>}
              </p>
              <p className="font-medium text-green-600">-{formatPrice(discount)}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">Shipping</p>
            <p className="font-medium text-gray-900">
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">Tax</p>
            <p className="font-medium text-gray-900">{formatPrice(tax)}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <p className="text-base font-medium text-gray-900">Order total</p>
            <p className="text-base font-medium text-gray-900">{formatPrice(total)}</p>
          </div>
        </div>
        
        {/* Estimated delivery */}
        <div className="mt-6 bg-blue-50 p-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Estimated Delivery</h3>
              <p className="mt-1 text-sm text-blue-700">
                {getEstimatedDeliveryDate()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Discount code input */}
        {onApplyDiscount && (
          <div className="mt-6">
            <form onSubmit={handleApplyDiscount}>
              <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700 mb-1">
                Discount code
              </label>
              <div className="flex">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    id="discount-code"
                    name="discount-code"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={applyingDiscount}
                    className={`block w-full rounded-l-md shadow-sm sm:text-sm ${
                      discountError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : discountSuccess 
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {discountSuccess && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                  {discountError && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <XMarkIcon className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!promoCode.trim() || applyingDiscount}
                  className={`rounded-r-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    !promoCode.trim() || applyingDiscount
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {applyingDiscount ? 'Applying...' : 'Apply'}
                </button>
              </div>
              
              {discountError && (
                <p className="mt-2 text-sm text-red-600">{discountError}</p>
              )}
              {discountSuccess && (
                <p className="mt-2 text-sm text-green-600">Discount applied successfully!</p>
              )}
              
              {/* Discount suggestions */}
              <div className="mt-3">
                <p className="text-xs text-gray-500">Try these codes: WELCOME10, SAVE20, FREESHIP</p>
              </div>
            </form>
          </div>
        )}
        
        {/* Checkout button */}
        <div className="mt-6">
          {onProceedToCheckout ? (
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>
          ) : (
            <Link
              href="/checkout"
              className="block w-full rounded-md border border-transparent bg-blue-600 px-4 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </Link>
          )}
          
          <div className="mt-4 text-center">
            <Link
              href="/products"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      
      {/* Secure checkout banner */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-center">
          <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-500">Secure checkout</span>
        </div>
      </div>
    </div>
  )
}