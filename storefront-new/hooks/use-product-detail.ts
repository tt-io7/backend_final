'use client'

import { useState, useEffect } from 'react'
import { Product, ProductVariant, ProductOptionValue } from '../types/product'
import { useAddToCart } from './use-add-to-cart'

/**
 * Hook for managing product details and variant selection
 */
export function useProductDetail(product: Product) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0])
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const { addToCart, isAddingToCart } = useAddToCart()

  // Initialize selected options based on the default variant
  useEffect(() => {
    const defaultOptions: Record<string, string> = {}
    
    if (product.variants[0]) {
      product.variants[0].options.forEach(option => {
        const productOption = product.options.find(o => o.id === option.option_id)
        if (productOption) {
          defaultOptions[productOption.id] = option.value
        }
      })
    }
    
    setSelectedOptions(defaultOptions)
  }, [product])

  // Find the matching variant when options change
  useEffect(() => {
    // Only try to find a matching variant if we have selected options
    if (Object.keys(selectedOptions).length === 0) return

    // Find the variant that matches all selected options
    const matchingVariant = product.variants.find(variant => {
      // A variant matches if it has an option value for each selected option
      return Object.entries(selectedOptions).every(([optionId, optionValue]) => {
        return variant.options.some(option => 
          option.option_id === optionId && option.value === optionValue
        )
      })
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    }
  }, [selectedOptions, product.variants])

  /**
   * Update a selected option
   */
  const updateOption = (optionId: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: value
    }))
  }

  /**
   * Update the quantity
   */
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > selectedVariant.inventory_quantity && selectedVariant.inventory_quantity > 0) {
      newQuantity = selectedVariant.inventory_quantity
    }
    setQuantity(newQuantity)
  }

  /**
   * Add the current variant to cart
   */
  const handleAddToCart = async () => {
    return await addToCart(selectedVariant.id, quantity)
  }

  /**
   * Check if an option value is available for the current selection
   */
  const isOptionValueAvailable = (optionId: string, value: string): boolean => {
    // Create a new options object with this potential selection
    const potentialOptions = {
      ...selectedOptions,
      [optionId]: value
    }

    // Check if any variant matches these options
    return product.variants.some(variant => {
      return Object.entries(potentialOptions).every(([potOptionId, potOptionValue]) => {
        return variant.options.some(option => 
          option.option_id === potOptionId && option.value === potOptionValue
        )
      })
    })
  }

  return {
    selectedVariant,
    selectedOptions,
    quantity,
    updateOption,
    updateQuantity,
    handleAddToCart,
    isAddingToCart: () => isAddingToCart(selectedVariant.id),
    isOptionValueAvailable
  }
} 