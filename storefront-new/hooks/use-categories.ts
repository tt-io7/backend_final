import { useState, useEffect } from 'react'
import { medusaStoreApi } from '../lib/medusa-client'

/**
 * Hook for fetching product categories from Medusa
 * @param {Object} options - Query options for fetching categories
 * @returns {Object} Categories data, loading state, and error
 */
export function useCategories(options: Record<string, any> = {}) {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await medusaStoreApi.getCategories({
          ...options
        })
        setCategories(response.product_categories)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [options])
  
  return { categories, loading, error }
}

/**
 * Hook for fetching a single category by handle
 * @param {string} handle - Category handle
 * @returns {Object} Category data, loading state, and error
 */
export function useCategory(handle: string) {
  const [category, setCategory] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    if (!handle) {
      setLoading(false)
      return
    }
    
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await medusaStoreApi.getCategory(handle)
        setCategory(response.product_category)
      } catch (err) {
        console.error('Error fetching category:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategory()
  }, [handle])
  
  return { category, loading, error }
}

/**
 * Hook for fetching products by category
 * @param {string} categoryId - Category ID
 * @param {Object} options - Additional query options
 * @returns {Object} Products data, loading state, and error
 */
export function useProductsByCategory(categoryId: string, options: Record<string, any> = {}) {
  const [products, setProducts] = useState<any[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    if (!categoryId) {
      setLoading(false)
      return
    }
    
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true)
        const response = await medusaStoreApi.getProducts({
          category_id: [categoryId],
          expand: 'variants,options,variants.prices,collection',
          ...options
        })
        setProducts(response.products)
        setCount(response.count)
      } catch (err) {
        console.error('Error fetching products by category:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProductsByCategory()
  }, [categoryId, options])
  
  return { products, count, loading, error }
}