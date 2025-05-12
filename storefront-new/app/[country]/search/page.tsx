"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid'
import { Product } from '@/types/product'

// Define the interface expected by ProductGrid
interface GridProduct {
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

// Convert Product to GridProduct format
function adaptProductForGrid(product: Product): GridProduct {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    handle: product.handle,
    thumbnail: product.thumbnail,
    variants: product.variants.map(variant => ({
      id: variant.id,
      title: variant.title,
      prices: [{
        amount: variant.price.amount,
        currency_code: variant.price.currency_code
      }]
    }))
  };
}

type SearchPageProps = {
  params: Promise<{
    country: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage(props: SearchPageProps) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { country } = params
  const query = searchParams.q || ''
  
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([])
        return
      }
      
      setIsLoading(true)
      
      try {
        // In a real implementation, this would call the searchProducts API
        // For now, we'll use a mock implementation with a delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock search results with all required fields
        const mockResults: Product[] = [
          {
            id: 'prod_01',
            title: 'Wireless Headphones',
            handle: 'wireless-headphones',
            description: 'Premium sound quality with noise cancellation technology.',
            thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Headphones',
            price: { amount: 19900, currency_code: 'USD' },
            variants: [
              {
                id: 'var_01',
                title: 'Black',
                sku: 'HP-BLK-01',
                price: { amount: 19900, currency_code: 'USD' },
                inventory_quantity: 10,
                options: [
                  {
                    id: 'opt_val_01',
                    value: 'Black',
                    option_id: 'opt_01'
                  }
                ]
              }
            ],
            images: [
              { id: 'img_01', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Headphones', alt: 'Headphones' }
            ],
            options: [
              {
                id: 'opt_01',
                title: 'Color',
                values: [
                  {
                    id: 'opt_val_01',
                    value: 'Black',
                    option_id: 'opt_01'
                  }
                ]
              }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'prod_02',
            title: 'Smartwatch',
            handle: 'smartwatch',
            description: 'Track your fitness and stay connected with notifications.',
            thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Smartwatch',
            price: { amount: 24900, currency_code: 'USD' },
            variants: [
              {
                id: 'var_03',
                title: 'Black',
                sku: 'SW-BLK-01',
                price: { amount: 24900, currency_code: 'USD' },
                inventory_quantity: 8,
                options: [
                  {
                    id: 'opt_val_03',
                    value: 'Black',
                    option_id: 'opt_02'
                  }
                ]
              }
            ],
            images: [
              { id: 'img_03', url: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Smartwatch', alt: 'Smartwatch' }
            ],
            options: [
              {
                id: 'opt_02',
                title: 'Color',
                values: [
                  {
                    id: 'opt_val_03',
                    value: 'Black',
                    option_id: 'opt_02'
                  }
                ]
              }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ].filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) || 
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        
        setProducts(mockResults)
      } catch (error) {
        console.error('Error searching products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    searchProducts()
  }, [query])
  
  // Convert to the format expected by ProductGrid
  const gridProducts = products.map(adaptProductForGrid)
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {query ? `Search results for "${query}"` : 'Search our products'}
        </h1>
        <p className="mt-2 text-gray-500">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>
      
      {/* Search form */}
      <div className="mb-10">
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for products..."
            className="flex-1 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <button 
            type="submit" 
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Search
          </button>
        </form>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Searching products...</p>
        </div>
      )}
      
      {/* Results */}
      {!isLoading && (
        <>
          {products.length > 0 ? (
            <ProductGrid products={gridProducts} />
          ) : query ? (
            <div className="text-center py-16 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try searching with different keywords or browse our categories.</p>
              <Link
                href={`/${country}/products`}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
              >
                View All Products
              </Link>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">Enter a search term to find products.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
} 