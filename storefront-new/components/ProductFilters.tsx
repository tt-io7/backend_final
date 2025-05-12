'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatPrice } from '../lib/utils'
import { ApiErrorMessage } from './ErrorBoundary'

interface Category {
  id: string
  title: string
  handle: string
  parent_category_id?: string | null
  description?: string
}

interface FilterOption {
  id: string
  name: string
  count?: number
}

interface PriceRange {
  min: number
  max: number
}

interface ProductFiltersProps {
  categories: Category[]
  priceRange?: PriceRange
  attributes?: Record<string, FilterOption[]>
  loading?: boolean
  onFilterChange?: (filters: Record<string, any>) => void
}

export default function ProductFilters({
  categories,
  priceRange = { min: 0, max: 100000 },
  attributes = {},
  loading = false,
  onFilterChange
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<Record<string, any>>({
    category: searchParams.get('category') || '',
    minPrice: Number(searchParams.get('minPrice')) || priceRange.min,
    maxPrice: Number(searchParams.get('maxPrice')) || priceRange.max,
    sort: searchParams.get('sort') || 'newest',
    ...Object.keys(attributes).reduce((acc, key) => {
      acc[key] = searchParams.get(key) || '';
      return acc;
    }, {} as Record<string, string>)
  })

  // Group categories by parent
  const categoryGroups = categories.reduce((groups, category) => {
    const parentId = category.parent_category_id || 'root'
    if (!groups[parentId]) {
      groups[parentId] = []
    }
    groups[parentId].push(category)
    return groups
  }, {} as Record<string, Category[]>)

  // Update URL when filters change
  useEffect(() => {
    if (typeof onFilterChange === 'function') {
      onFilterChange(filters)
    }
    
    // Update URL params
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'minPrice' && value === priceRange.min) {
          params.delete('minPrice')
        } else if (key === 'maxPrice' && value === priceRange.max) {
          params.delete('maxPrice')
        } else {
          params.set(key, String(value))
        }
      } else {
        params.delete(key)
      }
    })
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    try {
      // Use router.push to navigate with the new params
      router.push(`/products?${params.toString()}`)
    } catch (err) {
      console.error('Error updating URL:', err)
      setError(err instanceof Error ? err : new Error('An error occurred while updating filters'))
    }
  }, [filters, onFilterChange, priceRange.min, priceRange.max, router, searchParams])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sort: 'newest',
      ...Object.keys(attributes).reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {} as Record<string, string>)
    })
  }

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault()
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      const newFilters = { ...filters }
      
      for (const [key, value] of formData.entries()) {
        newFilters[key] = value
      }
      
      setFilters(newFilters)
      setMobileFiltersOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  // Mobile filter dialog
  const MobileFilterDialog = () => (
    <div className={`fixed inset-0 z-40 ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25" 
        onClick={() => setMobileFiltersOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Dialog */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <button
            type="button"
            className="-mr-2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-500"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Filter form */}
        <form ref={formRef} onSubmit={applyFilters} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center">
                  <input
                    id="mobile-category-all"
                    name="category"
                    type="radio"
                    value=""
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    defaultChecked={filters.category === ''}
                  />
                  <label htmlFor="mobile-category-all" className="ml-3 text-sm text-gray-600">
                    All Categories
                  </label>
                </div>
                
                {/* Root categories */}
                {categoryGroups['root']?.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center">
                      <input
                        id={`mobile-category-${category.handle}`}
                        name="category"
                        type="radio"
                        value={category.handle}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked={filters.category === category.handle}
                      />
                      <label htmlFor={`mobile-category-${category.handle}`} className="ml-3 text-sm text-gray-600">
                        {category.title}
                      </label>
                    </div>
                    
                    {/* Subcategories */}
                    {categoryGroups[category.id]?.map((subCategory) => (
                      <div key={subCategory.id} className="flex items-center ml-6 mt-1">
                        <input
                          id={`mobile-category-${subCategory.handle}`}
                          name="category"
                          type="radio"
                          value={subCategory.handle}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          defaultChecked={filters.category === subCategory.handle}
                        />
                        <label htmlFor={`mobile-category-${subCategory.handle}`} className="ml-3 text-sm text-gray-600">
                          {subCategory.title}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Price Range</h3>
              <div className="mt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{formatPrice(filters.minPrice)}</span>
                  <span className="text-sm text-gray-500">{formatPrice(filters.maxPrice)}</span>
                </div>
                
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label htmlFor="mobile-min-price" className="sr-only">Minimum Price</label>
                    <input
                      type="range"
                      id="mobile-min-price"
                      name="minPrice"
                      min={priceRange.min}
                      max={priceRange.max}
                      step={100}
                      defaultValue={filters.minPrice}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="mobile-max-price" className="sr-only">Maximum Price</label>
                    <input
                      type="range"
                      id="mobile-max-price"
                      name="maxPrice"
                      min={priceRange.min}
                      max={priceRange.max}
                      step={100}
                      defaultValue={filters.maxPrice}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Sort By</h3>
              <div className="mt-2">
                <select
                  id="mobile-sort"
                  name="sort"
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue={filters.sort}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filter Products
        </button>
      </div>

      {/* Mobile filter dialog */}
      <MobileFilterDialog />

      {/* Desktop filters */}
      <div className="hidden lg:block space-y-6">
        {error && <ApiErrorMessage error={error} resetError={() => setError(null)} />}
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <input
                id="category-all"
                name="category"
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={filters.category === ''}
                onChange={() => handleFilterChange('category', '')}
              />
              <label htmlFor="category-all" className="ml-3 text-sm text-gray-600">
                All Categories
              </label>
            </div>
            
            {/* Root categories */}
            {categoryGroups['root']?.map((category) => (
              <div key={category.id}>
                <div className="flex items-center">
                  <input
                    id={`category-${category.handle}`}
                    name="category"
                    type="radio"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={filters.category === category.handle}
                    onChange={() => handleFilterChange('category', category.handle)}
                  />
                  <label htmlFor={`category-${category.handle}`} className="ml-3 text-sm text-gray-600 font-medium">
                    {category.title}
                  </label>
                </div>
                
                {/* Subcategories */}
                {categoryGroups[category.id]?.map((subCategory) => (
                  <div key={subCategory.id} className="flex items-center ml-6 mt-1">
                    <input
                      id={`category-${subCategory.handle}`}
                      name="category"
                      type="radio"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={filters.category === subCategory.handle}
                      onChange={() => handleFilterChange('category', subCategory.handle)}
                    />
                    <label htmlFor={`category-${subCategory.handle}`} className="ml-3 text-sm text-gray-600">
                      {subCategory.title}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{formatPrice(filters.minPrice)}</span>
              <span className="text-sm text-gray-500">{formatPrice(filters.maxPrice)}</span>
            </div>
            
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="min-price" className="sr-only">Minimum Price</label>
                <input
                  type="range"
                  id="min-price"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={100}
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="max-price" className="sr-only">Maximum Price</label>
                <input
                  type="range"
                  id="max-price"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={100}
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Price input fields */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="min-price-input" className="block text-xs text-gray-500 mb-1">Min Price</label>
                <input
                  type="number"
                  id="min-price-input"
                  min={priceRange.min}
                  max={filters.maxPrice}
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                  className="w-full py-1 px-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="max-price-input" className="block text-xs text-gray-500 mb-1">Max Price</label>
                <input
                  type="number"
                  id="max-price-input"
                  min={filters.minPrice}
                  max={priceRange.max}
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                  className="w-full py-1 px-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Render attribute filters */}
        {Object.entries(attributes).map(([key, options]) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <div className="space-y-1">
              {options.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={`${key}-${option.id}`}
                    name={key}
                    type="radio"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={filters[key] === option.id}
                    onChange={() => handleFilterChange(key, option.id)}
                  />
                  <label htmlFor={`${key}-${option.id}`} className="ml-3 text-sm text-gray-600">
                    {option.name}
                    {option.count !== undefined && (
                      <span className="ml-1 text-gray-400">({option.count})</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Sort By</h3>
          <select
            id="sort"
            name="sort"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  )
}