import { useState, useEffect } from 'react'
import { medusaStoreApi } from '../lib/medusa-client'

/**
 * Hook for fetching products from Medusa
 * @param {Object} options - Query options for fetching products
 * @returns {Object} Products data, loading state, and error
 */
export function useProducts(options: Record<string, any> = {}) {
  const [products, setProducts] = useState<any[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await medusaStoreApi.getProducts({
          expand: 'variants,options,variants.prices,collection',
          ...options
        })
        
        setProducts(response.products)
        setCount(response.count)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [options])
  
  return { products, count, loading, error }
}

/**
 * Hook for fetching a single product by ID or handle
 * @param {string} handle - Product handle
 * @returns {Object} Product data, loading state, and error
 */
export function useProduct(handle: string) {
  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    if (!handle) {
      setLoading(false)
      return
    }
    
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await medusaStoreApi.getProduct(handle)
        setProduct(response.product)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [handle])
  
  return { product, loading, error }
}