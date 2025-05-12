'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPinIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { medusaStoreApi } from '../../../../lib/medusa-client'
import { AddressBook } from '@/components/account/AddressBook'
import { useAuth } from '@/lib/context/auth-context'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface Address {
  id?: string
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
  is_default?: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in and fetch addresses
    const checkAuthAndFetchAddresses = async () => {
      setLoading(true)
      setError(null)

      try {
        // Get user from localStorage or session
        // This is a simplified check - in a real app, you'd verify with the backend
        if (typeof window !== 'undefined') {
          // For demo purposes, we'll create a basic user
          // In a real app, you'd get this from your auth system
          setUser({
            id: 'current-user',
            email: 'customer@example.com',
            first_name: 'Test',
            last_name: 'Customer'
          })

          // Fetch addresses from Medusa API
          try {
            const { addresses } = await medusaStoreApi.getCustomerAddresses()
            console.log('Fetched addresses:', addresses)
            setAddresses(addresses || [])
          } catch (fetchError) {
            console.error('Error fetching addresses:', fetchError)
            setAddresses([])
            setError('Failed to load addresses. Please try again.')
          }
        } else {
          // Redirect to login if not in browser
          router.push('/us/login')
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        setError('Authentication error. Please log in again.')
        // Redirect to login on error
        router.push('/us/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchAddresses()
  }, [router])

  const handleSetDefault = async (addressId: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log('Setting address as default:', addressId)

      // Call the Medusa API to set the address as default
      await medusaStoreApi.setDefaultCustomerAddress(addressId)

      // Update the addresses list with the updated address
      setAddresses(addresses.map(addr => {
        // Set all addresses to non-default
        const isDefault = addr.id === addressId
        return { ...addr, is_default: isDefault }
      }))

      // Show success message
      setSuccess('Default address updated successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('Error setting default address:', err)
      setError('Failed to set default address. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId)
    setShowDeleteModal(true)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setAddressToDelete(null)
  }

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return

    setLoading(true)
    setError(null)

    try {
      console.log('Deleting address:', addressToDelete)

      // Call the Medusa API to delete the address
      await medusaStoreApi.deleteCustomerAddress(addressToDelete)

      // Update the addresses list by removing the deleted address
      setAddresses(addresses.filter(address => address.id !== addressToDelete))
      setShowDeleteModal(false)
      setAddressToDelete(null)

      // Show success message
      setSuccess('Address deleted successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('Error deleting address:', err)
      setError('Failed to delete address. Please try again.')
      setShowDeleteModal(false)
      setAddressToDelete(null)
    } finally {
      setLoading(false)
    }
  }

  // No need for a separate error message variable as we're using it directly in the JSX

  // Add a type guard to ensure id is a string
  const handleSetDefaultWithId = (id: string | undefined) => {
    if (id) handleSetDefault(id)
  }

  // Add a type guard to ensure id is a string
  const handleDeleteClickWithId = (id: string | undefined) => {
    if (id) handleDeleteClick(id)
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
    <>
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
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
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">Loading...</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Addresses</h2>
        <Link
          href="/us/account/addresses/new"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add address
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Add new address card */}
        <div
          onClick={() => router.push('/us/account/addresses/new')}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto">
            <PlusIcon className="h-6 w-6" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Add a new address</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add a new shipping or billing address
          </p>
        </div>

        {/* Address cards */}
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white rounded-lg shadow-sm p-6 ${
              address.is_default ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {address.is_default && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
                Default
              </span>
            )}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {address.first_name} {address.last_name}
                </h3>
                {address.company && (
                  <p className="text-sm text-gray-500">{address.company}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">{address.address_1}</p>
                {address.address_2 && (
                  <p className="text-sm text-gray-500">{address.address_2}</p>
                )}
                <p className="text-sm text-gray-500">
                  {address.city}, {address.province} {address.postal_code}
                </p>
                <p className="text-sm text-gray-500">{address.country_code}</p>
                {address.phone && (
                  <p className="mt-1 text-sm text-gray-500">{address.phone}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefaultWithId(address.id)}
                    disabled={loading}
                    className={`text-sm font-medium text-blue-600 hover:text-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Set as default
                  </button>
                )}
                <Link
                  href={`/us/account/addresses/${address.id}/edit`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClickWithId(address.id)}
                  disabled={loading}
                  className={`text-sm font-medium text-red-600 hover:text-red-500 flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete address</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this address? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  disabled={loading}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
