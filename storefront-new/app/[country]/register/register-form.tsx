"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/auth-context'

type RegisterFormProps = {
  country: string
}

export default function RegisterForm({ country }: RegisterFormProps) {
  const router = useRouter()

  // Initialize with a local loading state to avoid using the context's isLoading initially
  const [localLoading, setLocalLoading] = useState(false)
  const { register, isAuthenticated, customer, error: authError } = useAuth()

  // Only use isLoading from auth context during actual registration attempts
  const isLoading = localLoading

  // Track registration success to trigger redirect
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  // Redirect after successful registration
  useEffect(() => {
    if ((isAuthenticated && customer) || registerSuccess) {
      console.log('Registration successful, redirecting to account page')
      // Use a timeout to ensure state updates have completed
      setTimeout(() => {
        window.location.href = `/${country}/account`
      }, 100)
    }
  }, [isAuthenticated, customer, registerSuccess, country])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${country}/account`)
    }
  }, [isAuthenticated, router, country])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous error
    setFormError(null)

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long')
      return
    }

    try {
      setLocalLoading(true)
      setFormError(null)

      // Attempt registration
      await register(firstName, lastName, email, password)

      // Mark registration as successful to trigger redirect
      console.log('Registration successful, will redirect to account page')
      setRegisterSuccess(true)
    } catch (err) {
      // Error is handled by the auth context
      console.error('Registration failed:', err)
      setFormError(err instanceof Error ? err.message : 'Registration failed')
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              required
            />
          </div>
        </div>

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

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="••••••••"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </>
  )
}
