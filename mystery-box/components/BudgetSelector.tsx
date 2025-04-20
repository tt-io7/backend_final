'use client'

import { useState } from 'react'

interface BudgetSelectorProps {
  onBudgetSelect: (budget: number) => void
}

export default function BudgetSelector({ onBudgetSelect }: BudgetSelectorProps) {
  const [budget, setBudget] = useState(50)
  const [customBudget, setCustomBudget] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const predefinedBudgets = [25, 50, 75, 100]

  const handlePredefinedBudget = (value: number) => {
    setBudget(value)
    setIsCustom(false)
  }

  const handleCustomBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomBudget(value)
    
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setBudget(numValue)
    }
  }

  const handleSubmit = () => {
    if (budget > 0) {
      onBudgetSelect(budget)
    }
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold mb-6 text-lilac-dark text-center">Select Your Budget</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {predefinedBudgets.map((value) => (
            <button
              key={value}
              className={`py-3 px-4 rounded-lg border-2 transition-colors ${
                budget === value && !isCustom
                  ? 'border-lilac-dark bg-lilac-light text-lilac-dark'
                  : 'border-gray-200 hover:border-lilac'
              }`}
              onClick={() => handlePredefinedBudget(value)}
            >
              €{value}
            </button>
          ))}
        </div>
        
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="custom-budget"
              checked={isCustom}
              onChange={() => setIsCustom(!isCustom)}
              className="mr-2"
            />
            <label htmlFor="custom-budget">Custom amount</label>
          </div>
          
          {isCustom && (
            <div className="flex items-center">
              <span className="mr-2">€</span>
              <input
                type="number"
                value={customBudget}
                onChange={handleCustomBudget}
                placeholder="Enter amount"
                min="1"
                className="input-field"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <button 
          className="btn-primary w-full"
          onClick={handleSubmit}
        >
          Create My Mystery Box
        </button>
      </div>
    </div>
  )
}