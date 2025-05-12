'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductCard from '../../components/ProductCard'
import { ProductGrid } from '../../components/product'
import FadeIn from '../../components/transitions/FadeIn'
import StaggeredList from '../../components/transitions/StaggeredList'
import { useAnimationPreference } from '../../components/transitions/useAnimationPreference'

// Sample deals data
const dealsProducts = [
  {
    id: 'd1',
    title: 'Samsung Galaxy A54',
    description: 'Mid-range smartphone with premium features',
    price: 39999,
    originalPrice: 44999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Galaxy+A54',
    brand: 'Samsung',
    category: 'phones',
    isOnSale: true
  },
  {
    id: 'd2',
    title: 'Apple AirPods Pro (2nd Gen)',
    description: 'Active noise cancellation earbuds with spatial audio',
    price: 19900,
    originalPrice: 24900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=AirPods+Pro',
    brand: 'Apple',
    category: 'accessories',
    isOnSale: true
  },
  {
    id: 'd3',
    title: 'iPhone 14',
    description: 'Powerful performance with a great camera system',
    price: 69900,
    originalPrice: 79900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=iPhone+14',
    brand: 'Apple',
    category: 'phones',
    isOnSale: true
  },
  {
    id: 'd4',
    title: 'Microsoft 365 Family',
    description: '1-year subscription for up to 6 people',
    price: 9999,
    originalPrice: 12999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Microsoft+365',
    brand: 'Microsoft',
    category: 'software',
    isOnSale: true
  },
  {
    id: 'd5',
    title: 'AndMore Coffee Mug',
    description: 'Premium ceramic mug with AndMore logo',
    price: 999,
    originalPrice: 1499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Coffee+Mug',
    brand: 'AndMore',
    category: 'merch',
    isOnSale: true
  },
  {
    id: 'd6',
    title: 'Anker 65W GaN Charger',
    description: 'Fast charging for multiple devices simultaneously',
    price: 3999,
    originalPrice: 4999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Anker+Charger',
    brand: 'Anker',
    category: 'accessories',
    isOnSale: true
  },
  {
    id: 'd7',
    title: 'Sony WH-1000XM4 Headphones',
    description: 'Previous generation noise-cancelling headphones',
    price: 29999,
    originalPrice: 34999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Sony+Headphones',
    brand: 'Sony',
    category: 'accessories',
    isOnSale: true
  },
  {
    id: 'd8',
    title: 'Samsung T7 1TB Portable SSD',
    description: 'Ultra-fast external solid state drive with USB 3.2',
    price: 12999,
    originalPrice: 14999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Samsung+SSD',
    brand: 'Samsung',
    category: 'accessories',
    isOnSale: true
  },
  {
    id: 'd9',
    title: 'Tech Enthusiast Hoodie',
    description: 'Comfortable hoodie with tech-inspired design',
    price: 4999,
    originalPrice: 5999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Hoodie',
    brand: 'AndMore',
    category: 'merch',
    isOnSale: true
  }
];

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? dealsProducts.filter(product => product.category === selectedCategory)
    : dealsProducts;
  
  // Get unique categories
  const categories = [...new Set(dealsProducts.map(product => product.category))];
  
  // Category display names
  const categoryNames = {
    'phones': 'Phones',
    'accessories': 'Accessories',
    'software': 'Software',
    'merch': 'Merchandise'
  };
  
  // Calculate discount percentage
  const getDiscountPercentage = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };
  
  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Banner */}
          <div className="relative bg-gradient-to-r from-[var(--primary)] to-purple-600 rounded-lg overflow-hidden mb-12">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="https://placehold.co/1200x400/1E3A8A/FFFFFF?text=Special+Deals"
                alt="Deals background"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative py-16 px-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Special Deals</h1>
              <p className="text-xl mb-6 max-w-2xl">Discover amazing discounts on our premium tech products. Limited time offers you don't want to miss!</p>
              <div className="inline-block bg-white text-[var(--primary)] font-bold py-3 px-6 rounded-full text-lg animate-pulse">
                Up to 50% Off
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === null 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Deals
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {categoryNames[category as keyof typeof categoryNames] || category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="relative">
                <div className="absolute top-4 right-4 z-10 bg-[var(--secondary)] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {getDiscountPercentage(product.price, product.originalPrice)}% OFF
                </div>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  thumbnail={product.thumbnail}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  brand={product.brand}
                  isOnSale={product.isOnSale}
                  currencyCode="EUR"
                  onAddToCart={() => console.log(`Added ${product.title} to cart`)}
                />
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-gray-500">No deals available in this category at the moment.</p>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="mt-4 text-sm underline text-[var(--primary)]"
              >
                View all deals
              </button>
            </div>
          )}
          
          {/* Newsletter */}
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Get Notified About New Deals</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Subscribe to our newsletter and be the first to know about exclusive deals and promotions.</p>
            <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-[var(--primary)] text-white font-medium rounded-md hover:bg-[var(--primary-dark)] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}