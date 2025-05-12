'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EyeIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import type { ProductCardProps } from '../../types/product'
import { formatMoney } from '../../lib/utils'
import { useAddToCart } from '../../hooks/use-add-to-cart'
import { useCart } from '../../context/cart-context'

export default function ProductCard({
  product,
  onQuickView,
  onAddToWishlist
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart, isAddingToCart } = useAddToCart()
  const { openMiniCart } = useCart()
  
  const defaultVariant = product.variants[0]
  const isOnSale = defaultVariant.compare_at_price && 
    defaultVariant.compare_at_price.amount > defaultVariant.price.amount
  const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days

  const handleAddToCart = async () => {
    const success = await addToCart(defaultVariant.id)
    if (success) {
      openMiniCart()
    }
  }

  return (
    <motion.div 
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product badges */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
            NEW
          </span>
        )}
        {isOnSale && (
          <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.handle}`}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={500}
            height={500}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            priority={false}
            quality={85}
          />
        </Link>

        {/* Quick action buttons */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Quick view"
            >
              <EyeIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
          {onAddToWishlist && (
            <button
              onClick={() => onAddToWishlist(product)}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Add to wishlist"
            >
              <HeartIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart(defaultVariant.id) || defaultVariant.inventory_quantity <= 0}
            className={`bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors ${
              defaultVariant.inventory_quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCartIcon className={`w-5 h-5 ${isAddingToCart(defaultVariant.id) ? 'animate-pulse text-blue-600' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        <Link 
          href={`/products/${product.handle}`}
          className="block group-hover:text-blue-600 transition-colors"
        >
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnSale && defaultVariant.compare_at_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatMoney(defaultVariant.compare_at_price)}
              </span>
            )}
            <span className={`text-sm font-medium ${isOnSale ? 'text-red-600' : 'text-gray-900'}`}>
              {formatMoney(defaultVariant.price)}
            </span>
          </div>

          {defaultVariant.inventory_quantity <= 0 && (
            <span className="text-xs text-gray-500">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
} 