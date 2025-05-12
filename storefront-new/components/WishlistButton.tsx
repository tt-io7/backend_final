'use client'

import { useState, useEffect } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useWishlist } from '../hooks/use-wishlist'

interface WishlistButtonProps {
  productId: string
  variantId: string
  title: string
  variantTitle: string
  thumbnail?: string
  price: number
  currencyCode: string
  handle: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export default function WishlistButton({
  productId,
  variantId,
  title,
  variantTitle,
  thumbnail,
  price,
  currencyCode,
  handle,
  size = 'md',
  className = '',
  showText = false
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const [isAdded, setIsAdded] = useState(isInWishlist(variantId))
  
  // Update local state when wishlist changes
  useEffect(() => {
    setIsAdded(isInWishlist(variantId))
  }, [isInWishlist, variantId])
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAdded) {
      removeItem(variantId)
    } else {
      addItem({
        id: `${productId}_${variantId}`,
        productId,
        variantId,
        title,
        variantTitle,
        thumbnail,
        price,
        currencyCode,
        handle
      })
    }
    
    setIsAdded(!isAdded)
  }
  
  // Determine icon size based on the size prop
  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[size]
  
  // Determine button size based on the size prop
  const buttonSize = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }[size]
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center justify-center rounded-full ${buttonSize} ${
        isAdded
          ? 'text-red-600 hover:text-red-500'
          : 'text-gray-400 hover:text-gray-500'
      } focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label={isAdded ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isAdded ? (
        <HeartIconSolid className={`${iconSize} transition-colors`} />
      ) : (
        <HeartIcon className={`${iconSize} transition-colors`} />
      )}
      
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isAdded ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  )
}