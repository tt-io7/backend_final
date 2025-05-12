'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '../../hooks/use-wishlist'
import { formatPrice, formatDate } from '../../lib/utils'
import { HeartIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../hooks/use-cart'

export default function WishlistPage() {
  const { wishlist, loading, removeItem, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({})
  const [sortOption, setSortOption] = useState<string>('date-desc')
  
  // Sort wishlist items
  const sortedWishlist = [...wishlist].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name-asc':
        return a.title.localeCompare(b.title)
      case 'name-desc':
        return b.title.localeCompare(a.title)
      case 'date-asc':
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      case 'date-desc':
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
  })
  
  const handleAddToCart = async (item: any) => {
    setAddingToCart(prev => ({ ...prev, [item.variantId]: true }))
    
    try {
      await addToCart(item.variantId, 1)
      // Optionally remove from wishlist after adding to cart
      // removeItem(item.variantId)
    } catch (err) {
      console.error('Error adding item to cart:', err)
    } finally {
      setAddingToCart(prev => ({ ...prev, [item.variantId]: false }))
    }
  }
  
  const handleRemoveAll = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist()
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        
        {wishlist.length > 0 && (
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select
                id="sort"
                name="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleRemoveAll}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 h-64"></div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <HeartIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Save items you love to your wishlist and revisit them anytime.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {sortedWishlist.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-75 text-gray-900 hover:bg-opacity-100 focus:outline-none"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link href={`/products/${item.handle}`}>
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.variantTitle}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Added on {formatDate(item.addedAt)}
                </p>
                
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-base font-medium text-gray-900">
                    {formatPrice(item.price, item.currencyCode)}
                  </p>
                  
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    disabled={addingToCart[item.variantId]}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {addingToCart[item.variantId] ? (
                      'Adding...'
                    ) : (
                      <>
                        <ShoppingBagIcon className="h-4 w-4 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}