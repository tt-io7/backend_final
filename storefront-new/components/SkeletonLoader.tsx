'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  borderRadius?: string
  animate?: boolean
}

export function Skeleton({
  className = '',
  width,
  height,
  borderRadius = '0.375rem',
  animate = true,
}: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 ${animate ? 'animate-pulse' : ''} ${className}`}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : '1rem',
        borderRadius,
      }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Product image */}
      <Skeleton height={240} className="w-full" />
      
      {/* Product content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton width="70%" height={20} />
        
        {/* Price */}
        <Skeleton width={80} height={24} />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton width="90%" height={16} />
          <Skeleton width="80%" height={16} />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product images */}
      <div className="space-y-4">
        <Skeleton height={400} className="w-full" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} height={80} className="w-full" />
          ))}
        </div>
      </div>
      
      {/* Product info */}
      <div className="space-y-6">
        {/* Title */}
        <Skeleton width="80%" height={32} />
        
        {/* Price */}
        <Skeleton width={120} height={28} />
        
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} width={20} height={20} borderRadius="9999px" />
            ))}
          </div>
          <Skeleton width={80} height={16} />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="90%" height={16} />
        </div>
        
        {/* Variant selector */}
        <div className="space-y-2">
          <Skeleton width={100} height={20} />
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} width={60} height={36} />
            ))}
          </div>
        </div>
        
        {/* Add to cart button */}
        <Skeleton width="100%" height={48} />
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      <Skeleton width={80} height={80} className="flex-shrink-0" />
      <div className="ml-4 flex-1 space-y-2">
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={16} />
        <div className="flex justify-between items-center">
          <Skeleton width={100} height={32} />
          <Skeleton width={80} height={20} />
        </div>
      </div>
    </div>
  )
}

export function CartSummarySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <Skeleton width="50%" height={24} />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton width="30%" height={16} />
          <Skeleton width="20%" height={16} />
        </div>
        <div className="flex justify-between">
          <Skeleton width="30%" height={16} />
          <Skeleton width="20%" height={16} />
        </div>
        <div className="flex justify-between">
          <Skeleton width="30%" height={16} />
          <Skeleton width="20%" height={16} />
        </div>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <Skeleton width="30%" height={20} />
          <Skeleton width="25%" height={20} />
        </div>
      </div>
      <Skeleton width="100%" height={48} />
    </div>
  )
}

export function OrderHistorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex justify-between">
            <Skeleton width="30%" height={20} />
            <Skeleton width="20%" height={20} />
          </div>
          <Skeleton width="40%" height={16} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Skeleton width={60} height={60} className="flex-shrink-0" />
              <div className="ml-4 flex-1 space-y-2">
                <Skeleton width="80%" height={16} />
                <Skeleton width="40%" height={14} />
              </div>
            </div>
            <div className="flex items-center">
              <Skeleton width={60} height={60} className="flex-shrink-0" />
              <div className="ml-4 flex-1 space-y-2">
                <Skeleton width="80%" height={16} />
                <Skeleton width="40%" height={14} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AddressSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <Skeleton width="40%" height={20} />
      <div className="space-y-2">
        <Skeleton width="60%" height={16} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="70%" height={16} />
        <Skeleton width="50%" height={16} />
      </div>
      <div className="flex justify-between pt-4">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  )
}

// Add default export that includes all skeleton components
const SkeletonLoader = {
  Skeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductDetailSkeleton,
  CartItemSkeleton,
  CartSummarySkeleton,
  OrderHistorySkeleton,
  AddressSkeleton
}

export default SkeletonLoader