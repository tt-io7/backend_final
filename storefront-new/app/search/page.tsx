'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { medusaStoreApi } from '../../lib/medusa-client'
import ProductGrid from '../../components/ProductGrid'
import ProductFilters from '../../components/ProductFilters'
import Pagination from '../../components/Pagination'
import SearchBar from '../../components/SearchBar'

const PRODUCTS_PER_PAGE = 12

export default function SearchPage() {
  const searchParamsObj = useSearchParams()
  const query = searchParamsObj ? searchParamsObj.get('q') || '' : ''
  
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Get current page from URL or default to 1
  const currentPage = searchParamsObj ? Number(searchParamsObj.get('page')) || 1 : 1
  
  // Get filters from URL
  const categoryFilter = searchParamsObj ? searchParamsObj.get('category') || '' : ''
  const sortOption = searchParamsObj ? searchParamsObj.get('sort') || 'relevance' : 'relevance'
  const minPrice = searchParamsObj ? Number(searchParamsObj.get('minPrice')) || 0 : 0
  const maxPrice = searchParamsObj ? Number(searchParamsObj.get('maxPrice')) || 1000000 : 1000000
  
  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  
  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([])
        setTotalProducts(0)
        setLoading(false)
        return
      }
      
      setLoading(true)
      
      try {
        // Prepare query options
        const options: Record<string, any> = {
          limit: PRODUCTS_PER_PAGE,
          offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
          expand: 'variants,options,variants.prices,collection',
          q: query
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
          case 'newest':
            options.order = 'created_at:desc'
            break
          default:
            // For relevance, we don't specify an order
            // The search algorithm should handle relevance sorting
            break
        }
        
        // In a real implementation, you would call the Medusa API with a search endpoint
        // For now, we'll just filter the mock products
        const { products: allProducts } = await medusaStoreApi.getProducts()
        
        // Filter products by title or description containing the query
        const filteredProducts = allProducts.filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        
        // Apply category filter if needed
        const categoryFiltered = categoryFilter
          ? filteredProducts.filter(product => 
              product.collection?.handle === categoryFilter
            )
          : filteredProducts
        
        // Apply price filter
        const priceFiltered = categoryFiltered.filter(product => {
          const lowestPrice = product.variants.reduce((lowest: number, variant: any) => {
            const variantPrice = variant.prices[0]?.amount || 0
            return variantPrice < lowest || lowest === 0 ? variantPrice : lowest
          }, 0)
          
          return lowestPrice >= minPrice && lowestPrice <= maxPrice
        })
        
        // Apply sorting
        let sortedProducts = [...priceFiltered]
        
        switch (sortOption) {
          case 'price-asc':
            sortedProducts.sort((a, b) => {
              const aPrice = a.variants[0]?.prices[0]?.amount || 0
              const bPrice = b.variants[0]?.prices[0]?.amount || 0
              return aPrice - bPrice
            })
            break
          case 'price-desc':
            sortedProducts.sort((a, b) => {
              const aPrice = a.variants[0]?.prices[0]?.amount || 0
              const bPrice = b.variants[0]?.prices[0]?.amount || 0
              return bPrice - aPrice
            })
            break
          case 'name-asc':
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title))
            break
          case 'name-desc':
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title))
            break
          case 'newest':
            // Assuming created_at is a date string
            sortedProducts.sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            break
          default:
            // For relevance, we'll sort by how closely the title matches the query
            sortedProducts.sort((a, b) => {
              const aTitle = a.title.toLowerCase()
              const bTitle = b.title.toLowerCase()
              const queryLower = query.toLowerCase()
              
              // If title starts with query, it's more relevant
              const aStartsWith = aTitle.startsWith(queryLower) ? 0 : 1
              const bStartsWith = bTitle.startsWith(queryLower) ? 0 : 1
              
              if (aStartsWith !== bStartsWith) {
                return aStartsWith - bStartsWith
              }
              
              // Otherwise sort by title length (shorter titles are more relevant)
              return aTitle.length - bTitle.length
            })
            break
        }
        
        // Apply pagination
        const paginatedProducts = sortedProducts.slice(
          (currentPage - 1) * PRODUCTS_PER_PAGE,
          currentPage * PRODUCTS_PER_PAGE
        )
        
        setProducts(paginatedProducts)
        setTotalProducts(sortedProducts.length)
      } catch (err) {
        console.error('Error searching products:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
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
      }
    }
    
    searchProducts()
    fetchCategories()
  }, [query, currentPage, categoryFilter, sortOption, minPrice, maxPrice])
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          {query ? `Search results for "${query}"` : 'Search Products'}
        </h1>
        
        <div className="max-w-3xl">
          <SearchBar />
        </div>
      </div>
      
      {query ? (
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
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      There was an error loading the search results. Please try again later.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-gray-500">
                    {loading
                      ? 'Searching...'
                      : totalProducts === 0
                        ? 'No results found'
                        : `Showing ${Math.min((currentPage - 1) * PRODUCTS_PER_PAGE + 1, totalProducts)} - ${Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)} of ${totalProducts} results`
                    }
                  </p>
                </div>
                
                {totalProducts === 0 && !loading ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter to find what you&apos;re looking for.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/products"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View all products
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <ProductGrid products={products} loading={loading} />
                    
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                          if (!searchParamsObj) return;
                          const params = new URLSearchParams(searchParamsObj.toString());
                          params.set('page', page.toString());
                          window.location.href = `/search?${params.toString()}`;
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Enter a search term</h3>
          <p className="mt-1 text-sm text-gray-500">
            Type in the search box above to find products.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse all products
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}