'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { medusaStoreApi } from '../../../lib/medusa-client'
import ProductGrid from '../../../components/ProductGrid'
import ProductFilters from '../../../components/ProductFilters'
import Pagination from '../../../components/Pagination'

const PRODUCTS_PER_PAGE = 12

interface Category {
  id: string
  title: string
  name: string
  handle: string
  parent_category_id?: string | null
  description?: string | null
  category_children?: Category[]
}

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  // Safely extract the handle from params
  const handle = typeof params?.handle === 'string' ? params.handle : ''
  
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState({
    category: true,
    products: true,
    categories: true
  })
  const [error, setError] = useState<Error | null>(null)
  
  // Get current page from URL or default to 1
  const currentPage = searchParams ? Number(searchParams.get('page')) || 1 : 1
  
  // Get filters from URL with fallbacks
  const sortOption = searchParams ? searchParams.get('sort') || 'newest' : 'newest'
  const minPrice = searchParams ? Number(searchParams.get('minPrice')) || 0 : 0
  const maxPrice = searchParams ? Number(searchParams.get('maxPrice')) || 1000000 : 1000000
  
  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(prev => ({ ...prev, category: true }))
      try {
        const response = await medusaStoreApi.getCategory(handle as string)
        if (response.category) {
          // Map the API response to our interface
          setCategory({
            id: response.category.id,
            title: response.category.name, // Use name as title for compatibility
            name: response.category.name,
            handle: response.category.handle,
            description: response.category.description,
            parent_category_id: response.category.parent_category_id,
            category_children: response.category.category_children
          })
        }
      } catch (err) {
        console.error('Error fetching category:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setLoading(prev => ({ ...prev, category: false }))
      }
    }
    
    if (handle) {
      fetchCategory()
    }
  }, [handle])
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(prev => ({ ...prev, products: true }))
      try {
        // Prepare query options
        const options: Record<string, any> = {
          limit: PRODUCTS_PER_PAGE,
          offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
          expand: 'variants,options,variants.prices,collection',
          category_handle: [handle]
        }
        
        // Add price filter
        if (minPrice > 0 || maxPrice < 1000000) {
          options.price_list = [`${minPrice},${maxPrice}`]
        }
        
        // Add sorting
        switch (sortOption) {
          case 'price-asc':
            options.order = 'variants.prices.amount:asc'
            break
          case 'price-desc':
            options.order = 'variants.prices.amount:desc'
            break
          case 'name-asc':
            options.order = 'title:asc'
            break
          case 'name-desc':
            options.order = 'title:desc'
            break
          default:
            options.order = 'created_at:desc'
        }
        
        const response = await medusaStoreApi.getProducts(options)
        setProducts(response.products)
        setTotalProducts(response.count)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setLoading(prev => ({ ...prev, products: false }))
      }
    }
    
    const fetchCategories = async () => {
      setLoading(prev => ({ ...prev, categories: true }))
      try {
        const response = await medusaStoreApi.getCategories()
        if (response.product_categories) {
          // Map API response to our interface
          setCategories(response.product_categories.map(cat => ({
            id: cat.id,
            title: cat.name, // Use name as title for compatibility
            name: cat.name,
            handle: cat.handle,
            description: cat.description,
            parent_category_id: cat.parent_category_id,
            category_children: cat.category_children
          })))
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(prev => ({ ...prev, categories: false }))
      }
    }
    
    if (handle) {
      fetchProducts()
      fetchCategories()
    }
  }, [handle, currentPage, sortOption, minPrice, maxPrice])
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <p>{error.message}</p>
                {error.message.includes('connect to Medusa server') && (
                  <p className="mt-2">
                    Please ensure the Medusa server is running and accessible at: 
                    <code className="ml-1 px-1 py-0.5 bg-red-100 font-mono text-sm rounded">{process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}</code>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <Link href="/products" className="text-blue-600 hover:text-blue-800">
          ← Back to products
        </Link>
      </div>
    )
  }
  
  const isLoading = loading.category || loading.products
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <Link href="/products" className="ml-2 text-gray-500 hover:text-gray-700">Products</Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-gray-900 font-medium">
              {isLoading ? 'Loading...' : category?.title || 'Category'}
            </span>
          </li>
        </ol>
      </nav>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {isLoading ? 'Loading...' : category?.title || 'Category'}
        </h1>
        {category?.description && (
          <p className="mt-4 text-lg text-gray-500">
            {category.description}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            priceRange={{ min: 0, max: 100000 }}
            loading={loading.categories}
          />
        </div>
        
        {/* Product grid */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              Showing {isLoading ? '...' : `${Math.min((currentPage - 1) * PRODUCTS_PER_PAGE + 1, totalProducts)} - ${Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)}`} of {isLoading ? '...' : totalProducts} products
            </p>
          </div>
          
          <ProductGrid products={products} loading={loading.products} />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  )
}