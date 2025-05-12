'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, ShoppingBagIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { useAuth } from '../../lib/context/auth-context'

export default function AccountPage() {
  const router = useRouter()
  const { customer, isLoading, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account')
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = async () => {
    try {
      // Use the logout function from auth context
      await logout()

      // Redirect to home page
      router.push('/')
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !customer) {
    return null // Will redirect to login
  }

  const accountSections = [
    {
      name: 'Personal Information',
      href: '/account/profile',
      icon: UserIcon,
      description: 'Update your personal details and password'
    },
    {
      name: 'Order History',
      href: '/account/orders',
      icon: ShoppingBagIcon,
      description: 'View and track your orders'
    },
    {
      name: 'Addresses',
      href: '/account/addresses',
      icon: MapPinIcon,
      description: 'Manage your shipping and billing addresses'
    },
    {
      name: 'Payment Methods',
      href: '/account/payment',
      icon: CreditCardIcon,
      description: 'Manage your saved payment methods'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>

      {/* User info */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <UserIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-medium text-gray-900">
              {customer.first_name} {customer.last_name}
            </h2>
            <p className="text-gray-500">{customer.email}</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowRightIcon className="h-5 w-5 mr-2 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Account sections */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {accountSections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <section.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{section.name}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-900">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all orders
          </Link>
        </div>

        {/* Mock orders - in a real app, these would come from the API */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {/* Empty state */}
            <div className="p-6 text-center">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't placed any orders yet.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}