"use client"

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/lib/auth'

type ForgotPasswordPageProps = {
  params: {
    country: string
  }
}

export default function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { country } = params
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      await requestPasswordReset(email)
      setSuccessMessage('Password reset instructions have been sent to your email')
      setEmail('')
    } catch (err: any) {
      console.error('Password reset request error:', err)
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
        <p className="mt-2 text-gray-600">
          Enter your email and we'll send you instructions to reset your password
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link
              href={`/${country}/login`}
              className="text-primary hover:text-primary-dark font-medium"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 