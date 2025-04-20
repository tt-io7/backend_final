'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BudgetSelector from '../../components/BudgetSelector'

export default function CreateBox() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [budget, setBudget] = useState(50)
  const [step, setStep] = useState(1) // 1: Budget, 2: Preferences, 3: Review
  const [isLoading, setIsLoading] = useState(false)
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    categories: [] as string[],
    giftWrapping: false,
    giftMessage: '',
  })
  
  // Available categories
  const categories = [
    { id: 'fashion', name: 'Fashion & Accessories' },
    { id: 'tech', name: 'Tech & Gadgets' },
    { id: 'home', name: 'Home & Living' },
    { id: 'beauty', name: 'Beauty & Wellness' },
    { id: 'hobby', name: 'Hobbies & Interests' },
    { id: 'food', name: 'Gourmet Food & Drinks' },
  ]

  useEffect(() => {
    // Get budget from URL if available
    const urlBudget = searchParams.get('budget')
    if (urlBudget) {
      const parsedBudget = parseInt(urlBudget)
      if (!isNaN(parsedBudget) && parsedBudget > 0) {
        setBudget(parsedBudget)
      }
    }
  }, [searchParams])

  const handleBudgetSelect = (value: number) => {
    setBudget(value)
  }

  const handleCategoryToggle = (categoryId: string) => {
    setPreferences(prev => {
      const updatedCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
      
      return {
        ...prev,
        categories: updatedCategories
      }
    })
  }

  const handleGiftWrappingToggle = () => {
    setPreferences(prev => ({
      ...prev,
      giftWrapping: !prev.giftWrapping
    }))
  }

  const handleGiftMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences(prev => ({
      ...prev,
      giftMessage: e.target.value
    }))
  }

  const handleNextStep = () => {
    setStep(prev => prev + 1)
    window.scrollTo(0, 0)
  }

  const handlePreviousStep = () => {
    setStep(prev => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // In a real implementation, this would call the Medusa.js API to create a mystery box
      console.log('Creating mystery box with:', { budget, preferences })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to cart page
      router.push('/cart')
    } catch (error) {
      console.error('Error creating mystery box:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-purple-800">
          Create Your Mystery Box
        </h1>
        
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex justify-between items-center">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-purple-700' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Budget</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-purple-400' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-purple-700' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Preferences</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-purple-400' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-purple-700' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* Step 1: Budget Selection */}
          {step === 1 && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-purple-700">Step 1: Select Your Budget</h2>
                <p className="text-gray-600 mb-6">
                  Choose how much you want to spend on your mystery box. We'll curate products worth more than your budget!
                </p>
                
                <BudgetSelector onBudgetSelect={handleBudgetSelect} showButton={false} />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Continue to Preferences
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Preferences */}
          {step === 2 && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-purple-700">Step 2: Set Your Preferences</h2>
                <p className="text-gray-600 mb-6">
                  Help us curate the perfect mystery box for you by selecting your preferences.
                </p>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-gray-800">Product Categories</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select up to 3 categories you're interested in. Leave empty for a completely random selection.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={preferences.categories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          disabled={preferences.categories.length >= 3 && !preferences.categories.includes(category.id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-gray-800">Gift Options</h3>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="gift-wrapping"
                      checked={preferences.giftWrapping}
                      onChange={handleGiftWrappingToggle}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="gift-wrapping" className="ml-2 text-gray-700">
                      Add gift wrapping (+€5.00)
                    </label>
                  </div>
                  
                  {preferences.giftWrapping && (
                    <div>
                      <label htmlFor="gift-message" className="block mb-2 text-gray-700">
                        Gift Message (optional)
                      </label>
                      <textarea
                        id="gift-message"
                        value={preferences.giftMessage}
                        onChange={handleGiftMessageChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your gift message here..."
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="bg-white hover:bg-gray-100 text-purple-700 font-bold py-3 px-6 rounded-md border border-purple-200 transition-colors"
                >
                  Back to Budget
                </button>
                <button
                  onClick={handleNextStep}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-purple-700">Step 3: Review Your Order</h2>
                <p className="text-gray-600 mb-6">
                  Review your mystery box details before adding it to your cart.
                </p>
                
                <div className="border-t border-b border-gray-200 py-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Budget:</span>
                    <span className="font-bold text-purple-700">€{budget.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Estimated Value:</span>
                    <span className="font-bold text-green-600">€{(budget * 1.2).toFixed(2)}+</span>
                  </div>
                  
                  {preferences.categories.length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Categories:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {preferences.categories.map(categoryId => {
                          const category = categories.find(c => c.id === categoryId)
                          return category ? (
                            <span key={categoryId} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                              {category.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                  
                  {preferences.giftWrapping && (
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">Gift Wrapping:</span>
                        <span>€5.00</span>
                      </div>
                      
                      {preferences.giftMessage && (
                        <div className="mt-2">
                          <span className="font-medium text-gray-700">Gift Message:</span>
                          <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded-md italic">
                            "{preferences.giftMessage}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>€{(budget + (preferences.giftWrapping ? 5 : 0)).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="bg-white hover:bg-gray-100 text-purple-700 font-bold py-3 px-6 rounded-md border border-purple-200 transition-colors"
                >
                  Back to Preferences
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}