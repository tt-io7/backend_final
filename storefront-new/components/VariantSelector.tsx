'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '../lib/utils'

interface OptionValue {
  id: string
  value: string
}

interface Option {
  id: string
  title: string
  values: OptionValue[]
}

interface Variant {
  id: string
  title: string
  options?: Record<string, string>
  prices: {
    amount: number
    currency_code: string
  }[]
  inventory_quantity?: number
  allow_backorder?: boolean
}

interface VariantSelectorProps {
  options: Option[]
  variants: Variant[]
  selectedVariant: Variant | null
  onVariantChange: (variant: Variant) => void
}

export default function VariantSelector({
  options,
  variants,
  selectedVariant,
  onVariantChange
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [optionInventory, setOptionInventory] = useState<Record<string, Record<string, number>>>({})
  const [optionAvailability, setOptionAvailability] = useState<Record<string, Record<string, boolean>>>({})

  // Initialize selected options from the selected variant or default to first values
  useEffect(() => {
    const initialOptions: Record<string, string> = {}
    
    if (selectedVariant && selectedVariant.options) {
      // If we have a selected variant, use its options
      Object.assign(initialOptions, selectedVariant.options)
    } else {
      // Otherwise, default to the first value of each option
      options.forEach(option => {
        if (option.values && option.values.length > 0) {
          initialOptions[option.id] = option.values[0].id
        }
      })
    }
    
    setSelectedOptions(initialOptions)
  }, [selectedVariant, options])

  // Calculate inventory and availability for each option value
  useEffect(() => {
    const inventory: Record<string, Record<string, number>> = {}
    const availability: Record<string, Record<string, boolean>> = {}
    
    // Initialize the records
    options.forEach(option => {
      inventory[option.id] = {}
      availability[option.id] = {}
      
      option.values.forEach(value => {
        inventory[option.id][value.id] = 0
        availability[option.id][value.id] = false
      })
    })
    
    // Calculate inventory and availability for each option value
    variants.forEach(variant => {
      const isInStock = (variant.inventory_quantity === undefined || variant.inventory_quantity > 0 || variant.allow_backorder)
      
      if (variant.options) {
        Object.entries(variant.options).forEach(([optionId, valueId]) => {
          // Increment inventory count
          if (variant.inventory_quantity !== undefined) {
            inventory[optionId][valueId] = (inventory[optionId][valueId] || 0) + variant.inventory_quantity
          }
          
          // Mark as available if at least one variant with this option is in stock
          if (isInStock) {
            availability[optionId][valueId] = true
          }
        })
      }
    })
    
    setOptionInventory(inventory)
    setOptionAvailability(availability)
  }, [options, variants])

  // Find the variant that matches the selected options
  const findMatchingVariant = (selectedOpts: Record<string, string>): Variant | null => {
    return variants.find(variant => {
      if (!variant.options) return false
      
      // Check if all selected options match this variant
      return Object.entries(selectedOpts).every(
        ([optionId, valueId]) => variant.options?.[optionId] === valueId
      )
    }) || null
  }

  // Handle option selection
  const handleOptionChange = (optionId: string, valueId: string) => {
    const newOptions = { ...selectedOptions, [optionId]: valueId }
    setSelectedOptions(newOptions)
    
    const matchingVariant = findMatchingVariant(newOptions)
    if (matchingVariant) {
      onVariantChange(matchingVariant)
    }
  }

  // Check if an option value is available based on current selections
  const isOptionValueAvailable = (optionId: string, valueId: string): boolean => {
    // Create a copy of current selections
    const testOptions = { ...selectedOptions }
    // Set the option we're testing
    testOptions[optionId] = valueId
    
    // Check if any variant matches these selections
    return variants.some(variant => {
      if (!variant.options) return false
      
      const isMatch = Object.entries(testOptions).every(
        ([testOptId, testValId]) => variant.options?.[testOptId] === testValId
      )
      
      const isInStock = (variant.inventory_quantity === undefined || 
                         variant.inventory_quantity > 0 || 
                         variant.allow_backorder)
      
      return isMatch && isInStock
    })
  }

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">{option.title}</h3>
            {selectedOptions[option.id] && (
              <span className="text-sm text-gray-500">
                {option.values.find(v => v.id === selectedOptions[option.id])?.value}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.id] === value.id
              const isAvailable = isOptionValueAvailable(option.id, value.id)
              
              return (
                <button
                  key={value.id}
                  type="button"
                  className={`
                    flex items-center justify-center px-3 py-2 text-sm rounded-md
                    ${isSelected 
                      ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-1' 
                      : isAvailable
                        ? 'bg-white text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  onClick={() => isAvailable && handleOptionChange(option.id, value.id)}
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                  aria-label={`${option.title}: ${value.value}${!isAvailable ? ' (unavailable)' : ''}`}
                >
                  {value.value}
                </button>
              )
            })}
          </div>
          
          {/* Show inventory level for selected option if available */}
          {selectedOptions[option.id] && 
           optionInventory[option.id] && 
           optionInventory[option.id][selectedOptions[option.id]] !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              {optionInventory[option.id][selectedOptions[option.id]] > 10 
                ? 'In stock' 
                : optionInventory[option.id][selectedOptions[option.id]] > 0
                  ? `Only ${optionInventory[option.id][selectedOptions[option.id]]} left in stock`
                  : 'Out of stock'}
            </div>
          )}
        </div>
      ))}
      
      {/* Selected variant summary */}
      {selectedVariant && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Selected:</span>
            <span className="text-sm text-gray-500">{selectedVariant.title}</span>
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Price:</span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(
                selectedVariant.prices[0]?.amount || 0,
                selectedVariant.prices[0]?.currency_code || 'usd'
              )}
            </span>
          </div>
          
          {selectedVariant.inventory_quantity !== undefined && (
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Availability:</span>
              <span className={`text-sm ${selectedVariant.inventory_quantity > 0 || selectedVariant.allow_backorder ? 'text-green-600' : 'text-red-600'}`}>
                {selectedVariant.inventory_quantity > 0 
                  ? `In stock (${selectedVariant.inventory_quantity} available)` 
                  : selectedVariant.allow_backorder 
                    ? 'Available for backorder' 
                    : 'Out of stock'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}