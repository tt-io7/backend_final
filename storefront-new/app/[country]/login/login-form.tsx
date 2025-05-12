"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/context/auth-context'

type LoginFormProps = {
  country: string
}

export default function LoginForm({ country }: LoginFormProps) {
  const router = useRouter()

  // Initialize with a local loading state to avoid using the context's isLoading initially
  const [localLoading, setLocalLoading] = useState(false)
  const { login, isAuthenticated, customer, error: authError } = useAuth()

  // Only use isLoading from auth context during actual login attempts
  const isLoading = localLoading

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState(`/${country}/account`)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Get the redirect URL from the query parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      if (redirect) {
        setRedirectUrl(redirect)
      }
    }
  }, [])

  // Redirect if already authenticated or after successful login
  useEffect(() => {
    if ((isAuthenticated && customer) || loginSuccess) {
      console.log('Authenticated, redirecting to:', redirectUrl)
      // Use a timeout to ensure state updates have completed
      setTimeout(() => {
        window.location.href = redirectUrl
      }, 100)
    }
  }, [isAuthenticated, customer, loginSuccess, redirectUrl, country])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      setFormError('Please enter both email and password')
      return
    }

    try {
      setLocalLoading(true)
      setFormError(null)

      // Attempt login
      await login(email, password)

      // Mark login as successful to trigger redirect
      console.log('Login successful, will redirect to:', redirectUrl)
      setLoginSuccess(true)
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login failed:', err)
      setFormError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <>
      {(authError || formError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {authError || formError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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

        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href={`/${country}/forgot-password`}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </>
  )
}
