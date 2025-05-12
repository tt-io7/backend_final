"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types/product'
import AddToCartButton from './AddToCartButton'

interface ProductDetailsProps {
  product: Product
  countryCode: string
}

export default function ProductDetails({ product, countryCode }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.url || product.thumbnail)
  
  const formatPrice = (amount: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount / 100)
  }
  
  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId)
    if (variant) {
      setSelectedVariant(variant)
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product images */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={selectedImage || product.thumbnail || 'https://placehold.co/800x800/9370DB/FFFFFF?text=Product'}
            alt={product.title}
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Image thumbnails */}
        {product.images && product.images.length > 0 && (
          <div className="flex overflow-x-auto gap-2 py-2">
            {product.images.map((image) => (
              <button
                key={image.id}
                className={`relative w-20 h-20 rounded border-2 overflow-hidden 
                  ${selectedImage === image.url ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setSelectedImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || product.title}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Product info */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
        
        {/* Price */}
        <div className="mt-4 flex items-center">
          <p className="text-2xl font-medium text-gray-900">
            {formatPrice(selectedVariant.price.amount, selectedVariant.price.currency_code)}
          </p>
          
          {selectedVariant.compare_at_price && (
            <p className="ml-2 text-lg text-gray-500 line-through">
              {formatPrice(
                selectedVariant.compare_at_price.amount, 
                selectedVariant.compare_at_price.currency_code
              )}
            </p>
          )}
        </div>
        
        {/* Description */}
        <div className="mt-4 prose prose-sm max-w-none text-gray-500">
          <p>{product.description}</p>
        </div>
        
        {/* Options */}
        <div className="mt-6 space-y-4">
          {product.options.map(option => (
            <div key={option.id}>
              <h3 className="text-sm font-medium text-gray-900">{option.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {option.values.map(value => {
                  // Find a variant with this option value
                  const variantWithValue = product.variants.find(variant => 
                    variant.options.some(opt => opt.id === value.id)
                  )
                  
                  const isSelected = selectedVariant.options.some(
                    opt => opt.id === value.id
                  )
                  
                  return (
                    <button
                      key={value.id}
                      className={`px-3 py-1 rounded-md text-sm
                        ${isSelected 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }
                      `}
                      onClick={() => variantWithValue && handleVariantChange(variantWithValue.id)}
                    >
                      {value.value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Add to cart */}
        <div className="mt-8">
          <AddToCartButton 
            variantId={selectedVariant.id} 
            countryCode={countryCode}
          />
        </div>
        
        {/* Extra info */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span className="ml-2 text-sm text-gray-600">Shipping calculated at checkout</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span className="ml-2 text-sm text-gray-600">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 