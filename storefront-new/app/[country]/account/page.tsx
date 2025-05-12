"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/auth-context'
import { medusaStoreApi } from '@/lib/medusa-client'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import ProfileForm from '@/components/account/ProfileForm'
import OrderHistory from '@/components/account/OrderHistory'
import { AccountMenu } from '@/components/account/AccountMenu'
import { AccountOverview } from '@/components/account/AccountOverview'
import { Tab } from '@headlessui/react'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

type AccountPageProps = {
  params: {
    country: string
  }
}

// Define the Address interface to match what comes from the API
interface Address {
  id?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  is_default?: boolean;
}

export default function AccountPage({ params }: AccountPageProps) {
  const { country } = params
  const router = useRouter()
  const { customer, isLoading, isAuthenticated, logout, getProfile } = useAuth()
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormData, setAddressFormData] = useState<Address>({
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    postal_code: '',
    country_code: 'US'
  });
  const [activeTab, setActiveTab] = useState('overview')

  // Update form data when editing an address
  useEffect(() => {
    if (editingAddress) {
      setAddressFormData(editingAddress);
    } else {
      // Reset form when adding a new address
      setAddressFormData({
        first_name: customer?.first_name || '',
        last_name: customer?.last_name || '',
        address_1: '',
        city: '',
        postal_code: '',
        country_code: 'US'
      });
    }
  }, [editingAddress, customer]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${country}/login?redirect=/${country}/account`)
    }
  }, [isLoading, isAuthenticated, router, country])

  // In a real app, orders would come from an API
  const recentOrders: any[] = []

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'settings', label: 'Settings' }
  ]

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleLogout = async () => {
    await logout()
    router.push(`/${country}`)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (<>
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* User info */}
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600">
                {customer?.first_name && customer?.last_name ? (
                  <span className="text-xl font-medium">
                    {customer.first_name[0]}{customer.last_name[0]}
                  </span>
                ) : (
                  <Image
                    src="https://placehold.co/400x400/9370DB/FFFFFF?text=?"
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {customer?.first_name} {customer?.last_name}
                </h2>
                <p className="text-sm text-gray-500">{customer?.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2" aria-label="Account navigation">
              {tabs.map((tab) => {
                const icon = tab.id === 'overview' ? '👤' :
                             tab.id === 'orders' ? '📦' :
                             tab.id === 'addresses' ? '🏠' :
                             tab.id === 'settings' ? '⚙️' : ''
                return (
                  <button
                    key={tab.id}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="pt-4 border-t">
              <button
                className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow">
            {/* Overview tab */}
            {activeTab === 'overview' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Overview</h2>

                <div className="space-y-8">
                  {/* Recent orders */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                      <Link
                        href={`/${country}/account/orders`}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        View all
                      </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Order
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {recentOrders.map((order) => (
                                <tr key={order.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.date}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatPrice(order.total)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                      href={`/${country}/account/orders/${order.id}`}
                                      className="text-primary hover:text-primary-dark"
                                    >
                                      View
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg bg-gray-50">
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Account details */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
                      <button
                        className="text-sm text-primary hover:text-primary-dark"
                        onClick={() => setActiveTab('settings')}
                      >
                        Edit
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {customer?.first_name} {customer?.last_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{customer?.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {customer?.phone || 'Not provided'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Member since</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {customer?.created_at
                              ? new Date(customer.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'N/A'
                            }
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders tab */}
            {activeTab === 'orders' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Orders</h2>

                {recentOrders.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentOrders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatPrice(order.total)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.items}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/${country}/account/orders/${order.id}`}
                                  className="text-primary hover:text-primary-dark"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Once you make a purchase, your orders will appear here.</p>
                    <Link
                      href={`/${country}/products`}
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Addresses tab */}
            {activeTab === 'addresses' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Addresses</h2>

                {customer?.shipping_addresses && customer.shipping_addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customer.shipping_addresses.map((address: Address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-medium">
                            {address.first_name} {address.last_name}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingAddress(address);
                                setShowAddressModal(true);
                              }}
                              className="text-sm text-primary hover:text-primary-dark"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                // Here you would add a confirmation dialog and delete logic
                                alert(`Delete address: ${address.id}`);
                              }}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{address.address_1}</p>
                          {address.address_2 && <p>{address.address_2}</p>}
                          <p>
                            {address.city}, {address.province} {address.postal_code}
                          </p>
                          <p>{address.country_code}</p>
                          {address.phone && <p>Phone: {address.phone}</p>}
                        </div>
                      </div>
                    ))}

                    <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
                      <button
                        onClick={() => {
                          setEditingAddress(null);
                          setShowAddressModal(true);
                        }}
                        className="text-primary hover:text-primary-dark"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="block font-medium">Add New Address</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                    <p className="text-gray-500 mb-6">Add a shipping address to make checkout faster.</p>
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressModal(true);
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
                    >
                      Add New Address
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings tab */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        defaultValue={customer?.first_name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        defaultValue={customer?.last_name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      defaultValue={customer?.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      defaultValue={customer?.phone || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-md transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {showAddressModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            try {
              console.log('Submitting address data:', addressFormData);

              // Save the address using Medusa API
              try {
                // Make sure all required fields are filled
                if (!addressFormData.first_name || !addressFormData.last_name ||
                    !addressFormData.address_1 || !addressFormData.city ||
                    !addressFormData.postal_code || !addressFormData.country_code) {
                  alert('Please fill in all required fields');
                  return;
                }

                console.log('Address data to submit:', addressFormData);

                // Check if we have a JWT token
                const jwtToken = localStorage.getItem('medusa_jwt');
                if (!jwtToken) {
                  console.error('No JWT token found - user might not be authenticated');
                  alert('You need to be logged in to save addresses. Please log in and try again.');
                  return;
                }

                if (editingAddress?.id) {
                  // Update existing address
                  console.log('Updating address with ID:', editingAddress.id);
                  const result = await medusaStoreApi.updateCustomerAddress(editingAddress.id, addressFormData);
                  console.log('Update address result:', result);
                } else {
                  // Add new address
                  console.log('Adding new address');
                  const result = await medusaStoreApi.addCustomerAddress(addressFormData);
                  console.log('Add address result:', result);
                }

                // Close the modal
                setShowAddressModal(false);

                // Show success message
                alert('Address saved successfully!');

                // Refresh customer data to show updated addresses
                await getProfile();

                // Refresh the page after a short delay
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } catch (apiError: any) {
                console.error('API Error details:', apiError);

                // Show a more helpful error message
                if (apiError.message.includes('Failed to connect')) {
                  alert('Failed to connect to the server. Please check your internet connection and try again.');
                } else if (apiError.message.includes('Unauthorized')) {
                  alert('Authentication error. Please log out and log back in, then try again.');
                } else {
                  alert(`Failed to save address: ${apiError.message || 'Unknown error'}`);
                }
              }
            } catch (error) {
              console.error('Error saving address:', error);
              alert('Failed to save address. Please try again.');
            }
          }}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full border rounded p-2"
                value={addressFormData.first_name}
                onChange={(e) => setAddressFormData({...addressFormData, first_name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border rounded p-2"
                value={addressFormData.last_name}
                onChange={(e) => setAddressFormData({...addressFormData, last_name: e.target.value})}
              />
            </div>
            <input
              type="text"
              placeholder="Address Line 1"
              className="w-full border rounded p-2"
              value={addressFormData.address_1}
              onChange={(e) => setAddressFormData({...addressFormData, address_1: e.target.value})}
            />
            <input
              type="text"
              placeholder="Address Line 2"
              className="w-full border rounded p-2"
              value={addressFormData.address_2 || ''}
              onChange={(e) => setAddressFormData({...addressFormData, address_2: e.target.value})}
            />
            <input
              type="text"
              placeholder="City"
              className="w-full border rounded p-2"
              value={addressFormData.city}
              onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
            />
            <input
              type="text"
              placeholder="State/Province"
              className="w-full border rounded p-2"
              value={addressFormData.province || ''}
              onChange={(e) => setAddressFormData({...addressFormData, province: e.target.value})}
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="w-full border rounded p-2"
              value={addressFormData.postal_code}
              onChange={(e) => setAddressFormData({...addressFormData, postal_code: e.target.value})}
            />
            <input
              type="text"
              placeholder="Country Code"
              className="w-full border rounded p-2"
              value={addressFormData.country_code}
              onChange={(e) => setAddressFormData({...addressFormData, country_code: e.target.value})}
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full border rounded p-2"
              value={addressFormData.phone || ''}
              onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowAddressModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark">Save</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>)
}