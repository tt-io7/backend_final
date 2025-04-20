'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Checkout() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  // Mock mystery box data - in a real implementation, this would come from the session/cart
  const mysteryBox = {
    budget: 50,
    shippingCost: 5,
    totalCost: 55
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, country: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real implementation, this would call the Medusa.js API to create an order
      console.log('Creating order with data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate a mock order ID
      const mockOrderId = 'order_' + Math.random().toString(36).substring(2, 10)
      setOrderId(mockOrderId)
      setOrderComplete(true)
    } catch (err) {
      console.error('Error creating order:', err)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (orderComplete) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="text-5xl mb-6 text-gold">🎉</div>
            <h1 className="text-3xl font-bold mb-4 text-lilac-dark">Order Complete!</h1>
            <p className="mb-6">Thank you for your purchase. Your mystery box is on its way!</p>
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4 text-lilac-dark">Order Details</h2>
              <p className="mb-2"><strong>Order ID:</strong> {orderId}</p>
              <p className="mb-2"><strong>Amount:</strong> €{mysteryBox.totalCost.toFixed(2)}</p>
              <p><strong>Email:</strong> {formData.email}</p>
            </div>
            <p className="mb-6">We've sent a confirmation email with all the details of your order.</p>
            <Link href="/" className="btn-primary">Return to Home</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-lilac-dark">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="card">
              <h2 className="text-xl font-bold mb-6 text-lilac-dark">Shipping Information</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block mb-2 font-medium">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 font-medium">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block mb-2 font-medium">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block mb-2 font-medium">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block mb-2 font-medium">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="country" className="block mb-2 font-medium">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a country</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="BE">Belgium</option>
                </select>
              </div>
              
              <h2 className="text-xl font-bold mb-6 text-lilac-dark border-t border-lilac-light pt-6">Payment Information</h2>
              
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block mb-2 font-medium">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="cardExpiry" className="block mb-2 font-medium">Expiry Date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cardCvc" className="block mb-2 font-medium">CVC</label>
                  <input
                    type="text"
                    id="cardCvc"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>
          
          <div>
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold mb-6 text-lilac-dark">Order Summary</h2>
              
              <div className="flex justify-between mb-2">
                <span>Mystery Box (€{mysteryBox.budget.toFixed(2)})</span>
                <span>€{mysteryBox.budget.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span>€{mysteryBox.shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-lilac-light pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{mysteryBox.totalCost.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-lilac-light p-4 rounded-lg mb-4">
                <p className="text-sm">
                  Your Mystery Box will contain a surprise selection of premium products with a retail value that meets or exceeds your budget.
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  By completing this purchase, you agree to our <Link href="/terms" className="text-lilac-dark hover:underline">Terms and Conditions</Link>.
                </p>
                <p>
                  All payments are processed securely through Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}