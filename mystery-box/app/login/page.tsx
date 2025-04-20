'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // In a real implementation, this would call the Medusa.js authentication API
      console.log('Login attempt with:', { email, password })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to home page after successful login
      window.location.href = '/'
    } catch (err) {
      setError('Invalid email or password')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-lilac-dark">Login to Your Account</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="card">
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
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="mt-4 text-center">
              <p>Don't have an account? <Link href="/register" className="text-lilac-dark hover:underline">Register here</Link></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}