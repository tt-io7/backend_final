'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '../lib/utils'
import ProductCard from './ProductCard'

interface Product {
  id: string
  title: string
  description: string
  handle: string
  thumbnail?: string
  variants: {
    id: string
    title: string
    prices: {
      amount: number
      currency_code: string
    }[]
  }[]
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

export default function ProductGrid({ products = [], loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-100 animate-pulse rounded-lg overflow-hidden">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        product ? <ProductCard key={product.id} product={product} /> : null
      ))}
    </div>
  )
}