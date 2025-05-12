'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { medusaStoreApi } from '../../../lib/medusa-client'
import { formatPrice } from '../../../lib/utils'
import { useCart } from '../../../hooks/use-cart'
import { useError } from '../../../context/error-context'
import WishlistButton from '../../../components/WishlistButton'
import SafeImage from '../../../components/SafeImage'
import VariantSelector from '../../../components/VariantSelector'
import { ApiErrorMessage } from '../../../components/ErrorBoundary'
import Image from 'next/image'
import { Metadata } from 'next'
import { fetchProductByHandle } from '../../../lib/api'
import { formatMoney } from '../../../lib/utils'
import { notFound } from 'next/navigation'

interface OptionValue {
  id: string
  value: string
}

interface Option {
  id: string
  title: string
  values: OptionValue[]
}

interface Variant {
  id: string
  title: string
  options?: Record<string, string>
  prices: {
    amount: number
    currency_code: string
  }[]
  inventory_quantity?: number
  allow_backorder?: boolean
}

interface Product {
  id: string
  title: string
  description: string
  handle: string
  thumbnail?: string
  images?: { url: string }[]
  variants: Variant[]
  options?: Option[]
  collection?: {
    id: string
    title: string
    handle: string
  }
}

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProductByHandle(params.handle)
  
  if (!product) {
    return {
      title: 'Product Not Found | AndMore',
    }
  }
  
  return {
    title: `${product.title} | AndMore`,
    description: product.description,
    openGraph: {
      images: [{ url: product.thumbnail }],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await fetchProductByHandle(params.handle)
  
  if (!product) {
    notFound()
  }

  // Default to the first variant
  const defaultVariant = product.variants[0]
  const isOnSale = defaultVariant.compare_at_price && 
    defaultVariant.compare_at_price.amount > defaultVariant.price.amount

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product images */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-center object-cover"
                width={600}
                height={600}
                priority
              />
            </div>
            
            {/* Image gallery */}
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.images.map((image) => (
                  <div 
                    key={image.id} 
                    className="aspect-square rounded-md overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.title}
                      className="w-full h-full object-center object-cover"
                      width={150}
                      height={150}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 lg:mt-0 lg:max-w-lg lg:self-start">
            <div className="mt-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product.title}
              </h1>
            </div>

            {/* Product price */}
            <div className="mt-4">
              <div className="flex items-center">
                <p className={`text-2xl font-bold ${isOnSale ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatMoney(defaultVariant.price)}
                </p>
                
                {isOnSale && defaultVariant.compare_at_price && (
                  <p className="ml-3 text-lg font-medium text-gray-500 line-through">
                    {formatMoney(defaultVariant.compare_at_price)}
                  </p>
                )}
              </div>
            </div>

            {/* Product description */}
            <div className="mt-6">
              <h2 className="sr-only">Description</h2>
              <p className="text-base text-gray-700 space-y-6">
                {product.description}
              </p>
            </div>

            {/* Product options */}
            <div className="mt-8">
              {product.options.map((option) => (
                <div key={option.id} className="mb-6">
                  <h2 className="text-sm font-medium text-gray-900">{option.name}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <div className="mt-8">
              <button
                type="button"
                className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add to Cart
              </button>
            </div>

            {/* Additional product info */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Delivery</h3>
              <p className="mt-2 text-sm text-gray-500">
                Free shipping on orders over $100. Usually ships within 2-3 business days.
              </p>
            </div>
            
            {/* Return policy */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Returns</h3>
              <p className="mt-2 text-sm text-gray-500">
                30-day return policy. Please contact us if you have any issues with your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}