'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // In a real implementation, this would call the Medusa.js customer API
      console.log('Registration attempt with:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to login page after successful registration
      router.push('/login')
    } catch (err) {
      setError('Registration failed. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-800">
            Create an Account
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 border border-purple-100">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block mb-2 font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-800">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-600 hover:text-purple-800">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-600 hover:text-purple-800 font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}