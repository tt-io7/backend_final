'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BudgetSelector from '../../components/BudgetSelector'
import MysteryBoxCard from '../../components/MysteryBoxCard'

export default function CreateBox() {
  const [budget, setBudget] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleBudgetSelect = (selectedBudget: number) => {
    setBudget(selectedBudget)
    window.scrollTo({ top: document.getElementById('preview')?.offsetTop, behavior: 'smooth' })
  }

  const handlePurchase = async () => {
    if (!budget) return
    
    setIsLoading(true)
    
    try {
      // In a real implementation, this would call the Medusa.js API to create an order
      console.log('Creating mystery box with budget:', budget)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to checkout page
      router.push('/checkout')
    } catch (err) {
      console.error('Error creating mystery box:', err)
      alert('There was an error creating your mystery box. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center text-lilac-dark">Create Your Mystery Box</h1>
        
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-lilac-dark">Select Your Budget</h2>
            <p className="text-lg mb-8 text-center">
              Choose how much you want to spend on your mystery box. We'll curate a selection of premium products that match or exceed the value of your budget.
            </p>
            
            <BudgetSelector onBudgetSelect={handleBudgetSelect} />
          </section>
          
          {budget && (
            <section id="preview" className="mb-16 scroll-mt-8">
              <h2 className="text-2xl font-bold mb-6 text-lilac-dark">Your Mystery Box Preview</h2>
              
              <div className="max-w-sm mx-auto">
                <MysteryBoxCard 
                  budget={budget} 
                  onPurchase={handlePurchase} 
                />
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  By purchasing a Mystery Box, you agree to our <a href="/terms" className="text-lilac-dark hover:underline">Terms and Conditions</a>.
                </p>
                <p className="text-sm text-gray-600">
                  The contents of your Mystery Box will remain a surprise until delivery.
                </p>
              </div>
            </section>
          )}
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-lilac-dark">Why Choose Our Mystery Box?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="text-gold text-4xl mb-4">✨</div>
                <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                <p>All products in our Mystery Boxes are carefully selected premium items from our inventory.</p>
              </div>
              
              <div className="card text-center">
                <div className="text-gold text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2">Great Value</h3>
                <p>The retail value of items in your Mystery Box will always meet or exceed your budget.</p>
              </div>
              
              <div className="card text-center">
                <div className="text-gold text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-bold mb-2">Exciting Surprise</h3>
                <p>Experience the joy of unboxing a surprise selection of premium products.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}