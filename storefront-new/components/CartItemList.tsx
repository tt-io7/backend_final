'use client'

import { useState } from 'react'
import Link from 'next/link'
import { XMarkIcon, HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '../lib/utils'
import SafeImage from './SafeImage'
import { useWishlist } from '../hooks/use-wishlist'
import { useError } from '../context/error-context'

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

interface CartItemListProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  loading?: boolean
}

export default function CartItemList({
  items,
  onUpdateQuantity,
  onRemoveItem,
  loading = false
}: CartItemListProps) {
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({})
  const { addItem: addToWishlist } = useWishlist()
  const { showError } = useError()
  
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
    try {
      await onUpdateQuantity(itemId, newQuantity)
    } catch (err) {
      showError('Failed to update quantity. Please try again.')
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
    }
  }
  
  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
    try {
      await onRemoveItem(itemId)
    } catch (err) {
      showError('Failed to remove item. Please try again.')
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
    }
  }
  
  const handleSaveForLater = async (item: CartItem) => {
    try {
      // Generate a unique ID for the wishlist item
      const wishlistItemId = `wl_${item.id}`
      
      // Add to wishlist
      await addToWishlist({
        id: wishlistItemId,
        productId: item.id.split('_')[0], // Assuming item ID format is "product_variant"
        variantId: item.variant.id,
        title: item.title,
        variantTitle: item.variant.title,
        thumbnail: item.thumbnail || '',
        price: item.unit_price,
        currencyCode: item.variant.prices[0]?.currency_code || 'usd',
        handle: item.title.toLowerCase().replace(/\s+/g, '-')
      })
      
      // Remove from cart
      await onRemoveItem(item.id)
      
      // Show success message
      showError('Item moved to wishlist')
    } catch (err) {
      showError('Failed to save item for later. Please try again.')
    }
  }
  
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2].map(i => (
          <div key={i} className="flex py-6 border-b border-gray-200">
            <div className="h-24 w-24 bg-gray-200 rounded-md"></div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
        <p className="mt-2 text-sm text-gray-500">
          Looks like you haven't added anything to your cart yet.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <ul role="list" className="divide-y divide-gray-200">
      {items.map((item) => {
        const isUpdating = updatingItems[item.id] || false
        const itemUrl = `/products/${item.title.toLowerCase().replace(/\s+/g, '-')}`
        
        return (
          <li key={item.id} className={`py-6 ${isUpdating ? 'opacity-50' : ''}`}>
            <div className="flex">
              {/* Product image */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Link href={itemUrl}>
                  <SafeImage
                    src={item.thumbnail || ''}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover object-center"
                  />
                </Link>
              </div>
              
              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                      <Link href={itemUrl} className="hover:text-blue-600">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="ml-4">{formatPrice(item.unit_price)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.variant.title}</p>
                </div>
                
                <div className="flex flex-1 items-end justify-between text-sm pt-4">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
                      disabled={item.quantity <= 1 || isUpdating}
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    
                    <span className="px-2 py-1 text-gray-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    
                    <button
                      type="button"
                      disabled={item.quantity >= 10 || isUpdating}
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Item subtotal */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.subtotal)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.quantity > 1 && `${formatPrice(item.unit_price)} each`}
                    </p>
                  </div>
                </div>
                
                {/* Item actions */}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => handleSaveForLater(item)}
                    disabled={isUpdating}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                  >
                    <HeartIcon className="h-4 w-4 mr-1" />
                    Save for later
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isUpdating}
                    className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
            
            {/* Estimated delivery */}
            <div className="mt-4 text-xs text-gray-500">
              <p>Estimated delivery: 3-5 business days</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}