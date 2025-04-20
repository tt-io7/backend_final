'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // In a real implementation, this would call the Medusa.js customer API
      console.log('Registration attempt with:', { firstName, lastName, email, password })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to login page after successful registration
      window.location.href = '/login'
    } catch (err) {
      setError('Registration failed. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-lilac-dark">Create an Account</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="card">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-2 font-medium">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2 font-medium">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                minLength={8}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
                minLength={8}
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
            
            <div className="mt-4 text-center">
              <p>Already have an account? <Link href="/login" className="text-lilac-dark hover:underline">Login here</Link></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}