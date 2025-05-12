'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { medusaStoreApi } from '../lib/medusa-client'

interface Category {
  id: string
  name: string
  handle: string
  description?: string
}

interface Collection {
  id: string
  title: string
  handle: string
}

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string
  description?: string
  price?: {
    calculated_price: string
    original_price: string
    discount_amount: string
    price_type: string
  }
}

// Component for displaying categories and their products
export default function CategoryProducts() {
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useCollections, setUseCollections] = useState(false)

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // First try to get categories
        const { product_categories } = await medusaStoreApi.getCategories()
        
        if (product_categories && product_categories.length > 0) {
          setCategories(product_categories.map(cat => ({
            id: cat.id || '',
            name: cat.name || '',
            handle: cat.handle || '',
            description: cat.description || ''
          })))
          console.log('Fetched categories:', product_categories)
        } else {
          // If no categories, try legacy collections
          setUseCollections(true)
          try {
            const { collections } = await medusaStoreApi.getCollections()
            if (collections && collections.length > 0) {
              setCollections(collections.map(coll => ({
                id: coll.id || '',
                title: coll.title || '',
                handle: coll.handle || ''
              })))
              console.log('Fetched collections:', collections)
            } else {
              console.warn('No collections found')
            }
          } catch (collErr) {
            console.error('Error fetching collections:', collErr)
            setError('Failed to load collections. Make sure your Medusa server is running.')
          }
        }
        
        // Get all products
        const { products } = await medusaStoreApi.getProducts()
        if (products && products.length > 0) {
          setProducts(products.map(prod => ({
            id: prod.id || '',
            title: prod.title || '',
            handle: prod.handle || '',
            thumbnail: prod.thumbnail || '',
            description: prod.description || '',
            price: prod.variants && prod.variants[0]?.prices && prod.variants[0]?.prices[0] ? {
              calculated_price: `$${(prod.variants[0].prices[0].amount / 100).toFixed(2)}`,
              original_price: `$${(prod.variants[0].prices[0].amount / 100).toFixed(2)}`,
              discount_amount: '0',
              price_type: 'default'
            } : undefined
          })))
          console.log('Fetched products:', products)
        } else {
          console.warn('No products found')
        }
        
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load categories and products. Please check that your Medusa server is running and the API key is correctly configured.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategoriesAndProducts()
  }, [])
  
  if (loading) {
    return <div className="text-center py-10">Loading categories and products...</div>
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Connection Error</h3>
              <div className="mt-2 text-red-700">
                <p>{error}</p>
                <p className="mt-2">
                  Please ensure the Medusa server is running and accessible at: 
                  <code className="ml-1 px-1 py-0.5 bg-red-100 font-mono text-sm rounded">{process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories/Collections Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">
          {useCollections ? 'Collections' : 'Categories'}
        </h2>
        
        {useCollections ? (
          collections.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg p-4 transition duration-200"
                >
                  <h3 className="font-medium text-lg">{collection.title}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <p>No collections found.</p>
          )
        ) : (
          categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg p-4 transition duration-200"
                >
                  <h3 className="font-medium text-lg">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p>No categories found.</p>
          )
        )}
      </div>
      
      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group"
              >
                <div className="bg-gray-50 aspect-square rounded-lg overflow-hidden mb-2">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-lg group-hover:text-blue-600">{product.title}</h3>
                {product.price && (
                  <p className="text-gray-700">
                    {product.price.calculated_price}
                    {product.price.original_price !== product.price.calculated_price && (
                      <span className="line-through text-gray-400 ml-2">
                        {product.price.original_price}
                      </span>
                    )}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  )
} 