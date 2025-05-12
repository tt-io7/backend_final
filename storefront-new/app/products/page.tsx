'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { medusaStoreApi } from '../../lib/medusa-client'
import ProductGrid from '../../components/ProductGrid'
import ProductFilters from '../../components/ProductFilters'
import Pagination from '../../components/Pagination'
import { ApiErrorMessage } from '../../components/ErrorBoundary'
import { useError } from '../../context/error-context'

const PRODUCTS_PER_PAGE = 12

interface ProductsQueryOptions {
  limit: number
  offset: number
  expand: string
  category_handle?: string[]
  price_list?: string[]
  order?: string
  [key: string]: any // Allow for additional properties
}

export default function ProductsPage() {
  const searchParamsObj = useSearchParams()
  const router = useRouter()
  const { showError } = useError()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  
  // Get current page from URL or default to 1
  const currentPage = searchParamsObj ? Number(searchParamsObj.get('page')) || 1 : 1
  
  // Get filters from URL
  const categoryFilter = searchParamsObj ? searchParamsObj.get('category') || '' : ''
  const sortOption = searchParamsObj ? searchParamsObj.get('sort') || 'newest' : 'newest'
  const minPrice = searchParamsObj ? Number(searchParamsObj.get('minPrice')) || 0 : 0
  const maxPrice = searchParamsObj ? Number(searchParamsObj.get('maxPrice')) || 1000000 : 1000000
  
  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Prepare query options
        const options: ProductsQueryOptions = {
          limit: PRODUCTS_PER_PAGE,
          offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
          expand: 'variants,options,variants.prices,collection',
        }
        
        // Add category filter if selected
        if (categoryFilter) {
          options.category_handle = [categoryFilter]
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
        
        // Update active filters
        const newActiveFilters = []
        if (categoryFilter) newActiveFilters.push('Category')
        if (minPrice > 0 || maxPrice < 1000000) newActiveFilters.push('Price')
        if (sortOption !== 'newest') newActiveFilters.push('Sort')
        setActiveFilters(newActiveFilters)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
        showError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    const fetchCategories = async () => {
      try {
        const response = await medusaStoreApi.getCategories()
        setCategories(response.product_categories)
      } catch (err) {
        console.error('Error fetching categories:', err)
        // Don't show an error toast for categories, just log it
      }
    }
    
    fetchProducts()
    fetchCategories()
  }, [currentPage, categoryFilter, sortOption, minPrice, maxPrice, showError])
  
  const handlePageChange = (page: number) => {
    if (!searchParamsObj) return;
    
    const params = new URLSearchParams(searchParamsObj.toString())
    params.set('page', page.toString())
    router.push(`/products?${params.toString()}`)
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">All Products</h1>
        <p className="mt-4 text-lg text-gray-500">
          Browse our collection of high-quality products
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            priceRange={{ min: 0, max: 100000 }}
            loading={loading}
          />
        </div>
        
        {/* Product grid */}
        <div className="lg:col-span-3">
          {error && (
            <ApiErrorMessage 
              error={error} 
              resetError={() => setError(null)} 
            />
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">
                Showing {loading ? '...' : `${Math.min((currentPage - 1) * PRODUCTS_PER_PAGE + 1, totalProducts)} - ${Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)}`} of {loading ? '...' : totalProducts} products
              </p>
              
              {activeFilters.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <span key={filter} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {filter}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-3 sm:mt-0">
              <select
                id="mobile-sort"
                name="sort"
                className="block w-full sm:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={sortOption}
                onChange={(e) => {
                  if (!searchParamsObj) return;
                  
                  const params = new URLSearchParams(searchParamsObj.toString())
                  params.set('sort', e.target.value)
                  params.delete('page') // Reset to page 1
                  router.push(`/products?${params.toString()}`)
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
          
          <ProductGrid products={products} loading={loading} />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}