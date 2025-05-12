'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { medusaStoreApi } from '../../../../../lib/medusa-client'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface AddressFormData {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country: string
  phone: string
  is_default: boolean
}

// Country options
const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'JP', label: 'Japan' },
  { value: 'AU', label: 'Australia' },
  { value: 'NZ', label: 'New Zealand' }
]

export default function NewAddressPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<AddressFormData>({
    first_name: '',
    last_name: '',
    company: '',
    address_1: '',
    address_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'US',
    phone: '',
    is_default: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      setLoading(true)

      try {
        // Get user from localStorage
        if (typeof window !== 'undefined') {
          const userJson = localStorage.getItem('medusa_user')

          if (userJson) {
            const userData = JSON.parse(userJson)
            setUser(userData)

            // Pre-fill name fields with user data
            setFormData(prev => ({
              ...prev,
              first_name: userData.first_name || '',
              last_name: userData.last_name || ''
            }))
          } else {
            // Redirect to login if not logged in
            router.push('/us/login')
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        // Redirect to login on error
        router.push('/us/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Required fields
    if (!formData.first_name) newErrors.first_name = 'First name is required'
    if (!formData.last_name) newErrors.last_name = 'Last name is required'
    if (!formData.address_1) newErrors.address_1 = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.postal_code) newErrors.postal_code = 'Postal code is required'
    if (!formData.country) newErrors.country = 'Country is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submit triggered')
    e.preventDefault()

    // Log form data
    console.log('Form data:', formData)
    
    if (!validateForm()) {
      console.log('Form validation failed', errors)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Prepare the address data for the API
      // Make sure country_code is set correctly
      const addressData = {
        ...formData,
        country_code: formData.country // Map country to country_code
      }

      console.log('Submitting address data:', addressData)

      // Call the Medusa API to create the address
      try {
        console.log('Calling medusaStoreApi.addCustomerAddress with:', addressData);
        
        // Call the Medusa API to create the address
        const result = await medusaStoreApi.addCustomerAddress(addressData);
        console.log('API response:', result);
        
        if (result && result.address) {
          console.log('Address created successfully:', result.address);
        } else {
          console.error('API response missing address:', result);
          throw new Error('API response missing address');
        }
      } catch (apiError) {
        console.error('API Error details:', apiError);
        throw apiError;
      }

      // Show success message
      setSuccess('Address added successfully!')

      // Redirect back to addresses page after a short delay
      setTimeout(() => {
        router.push('/us/account/addresses')
      }, 1500)
    } catch (err) {
      console.error('Error creating address:', err)
      setError('Failed to add address. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center mb-6">
        <Link
          href="/us/account/addresses"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Addresses
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">Add New Address</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.first_name ? 'border-red-300' : ''
                  }`}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.last_name ? 'border-red-300' : ''
                  }`}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="sm:col-span-2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div className="sm:col-span-2">
              <label htmlFor="address_1" className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address_1"
                  id="address_1"
                  value={formData.address_1}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.address_1 ? 'border-red-300' : ''
                  }`}
                />
                {errors.address_1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.address_1}</p>
                )}
              </div>
            </div>

            {/* Address Line 2 */}
            <div className="sm:col-span-2">
              <label htmlFor="address_2" className="block text-sm font-medium text-gray-700">
                Apartment, suite, etc.
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address_2"
                  id="address_2"
                  value={formData.address_2}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.city ? 'border-red-300' : ''
                  }`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
            </div>

            {/* State/Province */}
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                State / Province
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="province"
                  id="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                Postal Code *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.postal_code ? 'border-red-300' : ''
                  }`}
                />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
                )}
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <div className="mt-1">
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.country ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
              </div>
            </div>

            {/* Phone */}
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Default Address Checkbox */}
            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  id="is_default"
                  name="is_default"
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/us/account/addresses"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
