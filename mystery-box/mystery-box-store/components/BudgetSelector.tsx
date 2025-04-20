'use client'

import { useState, CSSProperties } from 'react'
import Link from 'next/link'

interface BudgetSelectorProps {
  onBudgetSelect?: (budget: number) => void;
  showButton?: boolean;
}

export default function BudgetSelector({ onBudgetSelect, showButton = true }: BudgetSelectorProps) {
  const [budget, setBudget] = useState(50)
  const [isCustom, setIsCustom] = useState(false)
  const [customBudget, setCustomBudget] = useState('')

  const predefinedBudgets = [25, 50, 75, 100, 150, 200]

  const handleBudgetChange = (value: number) => {
    setBudget(value)
    setIsCustom(false)
    if (onBudgetSelect) {
      onBudgetSelect(value)
    }
  }

  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomBudget(value)
    
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setBudget(numValue)
      if (onBudgetSelect) {
        onBudgetSelect(numValue)
      }
    }
  }

  const handleCustomToggle = () => {
    setIsCustom(true)
    setCustomBudget(budget.toString())
  }

  // Styles
  const containerStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    border: '1px solid #f0e6ff'
  }

  const titleStyle: CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#9370DB'
  }

  const budgetButtonsContainerStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem'
  }

  const getBudgetButtonStyle = (value: number): CSSProperties => {
    const isSelected = budget === value && !isCustom
    
    return {
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      backgroundColor: isSelected ? '#9370DB' : '#f5f3ff',
      color: isSelected ? 'white' : '#9370DB',
      border: 'none',
      cursor: 'pointer',
      fontWeight: isSelected ? 'bold' : 'normal'
    }
  }

  const customButtonStyle: CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    backgroundColor: isCustom ? '#9370DB' : '#f5f3ff',
    color: isCustom ? 'white' : '#9370DB',
    border: 'none',
    cursor: 'pointer',
    fontWeight: isCustom ? 'bold' : 'normal'
  }

  const customInputContainerStyle: CSSProperties = {
    marginBottom: '1rem'
  }

  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#4b5563'
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.25rem',
    outline: 'none'
  }

  const summaryContainerStyle: CSSProperties = {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f5f3ff',
    borderRadius: '0.25rem'
  }

  const summaryTitleStyle: CSSProperties = {
    fontWeight: 'bold',
    color: '#9370DB',
    marginBottom: '0.5rem'
  }

  const summaryItemStyle: CSSProperties = {
    color: '#4b5563',
    marginBottom: '0.5rem',
    fontSize: '0.875rem'
  }

  const summaryValueStyle: CSSProperties = {
    fontWeight: 'bold'
  }

  const buttonStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    backgroundColor: '#9370DB',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none'
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Select Your Budget</h2>
      
      <div style={budgetButtonsContainerStyle}>
        {predefinedBudgets.map((value) => (
          <button
            key={value}
            onClick={() => handleBudgetChange(value)}
            style={getBudgetButtonStyle(value)}
          >
            €{value}
          </button>
        ))}
        <button
          onClick={handleCustomToggle}
          style={customButtonStyle}
        >
          Custom
        </button>
      </div>

      {isCustom && (
        <div style={customInputContainerStyle}>
          <label htmlFor="customBudget" style={labelStyle}>
            Enter your budget (€)
          </label>
          <input
            type="number"
            id="customBudget"
            value={customBudget}
            onChange={handleCustomBudgetChange}
            min="10"
            step="5"
            style={inputStyle}
            placeholder="Enter amount"
            autoFocus
          />
        </div>
      )}

      <div style={summaryContainerStyle}>
        <h3 style={summaryTitleStyle}>Your Mystery Box</h3>
        <p style={summaryItemStyle}>
          Budget: <span style={summaryValueStyle}>€{budget.toFixed(2)}</span>
        </p>
        <p style={{...summaryItemStyle, fontSize: '0.75rem'}}>
          You'll receive a surprise selection of products worth more than your budget!
        </p>
      </div>

      {showButton && (
        <Link 
          href={`/create-box?budget=${budget}`}
          style={buttonStyle}
        >
          Create My Mystery Box
        </Link>
      )}
    </div>
  )
}