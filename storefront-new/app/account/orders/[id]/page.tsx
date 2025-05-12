'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '../../../../lib/utils'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface OrderItem {
  id: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  subtotal: number
  total: number
  thumbnail?: string
  variant: {
    id: string
    title: string
  }
}

interface Order {
  id: string
  display_id: string
  status: string
  created_at: string
  updated_at: string
  shipping_address?: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    province: string
    postal_code: string
    country: string
    phone?: string
  }
  billing_address?: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    province: string
    postal_code: string
    country: string
    phone?: string
  }
  shipping_method?: {
    name: string
    price: number
  }
  payment_method?: {
    provider: string
    data: {
      brand: string
      last4: string
    }
  }
  items: OrderItem[]
  subtotal: number
  shipping_total: number
  discount_total: number
  tax_total: number
  total: number
  currency_code: string
}

// Mock order data
const mockOrder: Order = {
  id: 'order_01',
  display_id: '1001',
  status: 'completed',
  created_at: '2025-03-15T10:00:00Z',
  updated_at: '2025-03-15T10:30:00Z',
  shipping_address: {
    first_name: 'John',
    last_name: 'Doe',
    address_1: '123 Main St',
    city: 'San Francisco',
    province: 'CA',
    postal_code: '94105',
    country: 'US',
    phone: '+1 (555) 123-4567'
  },
  billing_address: {
    first_name: 'John',
    last_name: 'Doe',
    address_1: '123 Main St',
    city: 'San Francisco',
    province: 'CA',
    postal_code: '94105',
    country: 'US',
    phone: '+1 (555) 123-4567'
  },
  shipping_method: {
    name: 'Standard Shipping',
    price: 1000
  },
  payment_method: {
    provider: 'stripe',
    data: {
      brand: 'Visa',
      last4: '4242'
    }
  },
  items: [
    {
      id: 'item_01',
      title: 'iPhone 15 Pro',
      description: 'The latest iPhone with advanced features and powerful performance.',
      quantity: 1,
      unit_price: 99900,
      subtotal: 99900,
      total: 99900,
      thumbnail: 'https://via.placeholder.com/300x400',
      variant: {
        id: 'var_01',
        title: 'iPhone 15 Pro - 128GB - Black'
      }
    }
  ],
  subtotal: 99900,
  shipping_total: 1000,
  discount_total: 0,
  tax_total: 8991,
  total: 109891,
  currency_code: 'usd'
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  
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
            
            // In a real implementation, you would fetch the order from the API
            // For now, we'll use mock data
            setOrder(mockOrder)
          } else {
            // Redirect to login if not logged in
            router.push('/login')
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        // Redirect to login on error
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [id, router])
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
  
  if (!user || !order) {
    return null // Will redirect to login
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back to Orders
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.display_id}</h1>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              <p className="mt-1 text-sm text-gray-500">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <p className="text-xl font-medium text-gray-900">
              {formatPrice(order.total, order.currency_code)}
            </p>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900 mb-4">Items</h3>
          <ul role="list" className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <li key={item.id} className="py-4 flex">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h4>{item.title}</h4>
                      <p className="ml-4">{formatPrice(item.total, order.currency_code)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.variant.title}</p>
                  </div>
                  <div className="flex-1 flex items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {item.quantity}</p>
                    <p className="text-gray-500">
                      {formatPrice(item.unit_price, order.currency_code)} each
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Subtotal</p>
              <p className="text-gray-900 font-medium">
                {formatPrice(order.subtotal, order.currency_code)}
              </p>
            </div>
            
            {order.discount_total > 0 && (
              <div className="flex justify-between text-sm">
                <p className="text-green-500">Discount</p>
                <p className="text-green-500 font-medium">
                  -{formatPrice(order.discount_total, order.currency_code)}
                </p>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Shipping</p>
              <p className="text-gray-900 font-medium">
                {formatPrice(order.shipping_total, order.currency_code)}
              </p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Tax</p>
              <p className="text-gray-900 font-medium">
                {formatPrice(order.tax_total, order.currency_code)}
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-base font-medium text-gray-900">
                {formatPrice(order.total, order.currency_code)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center">
            <TruckIcon className="h-6 w-6 text-gray-400 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
          </div>
          
          <div className="p-6">
            {order.shipping_address ? (
              <div>
                <p className="font-medium text-gray-900">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-gray-500">{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && (
                  <p className="text-gray-500">{order.shipping_address.address_2}</p>
                )}
                <p className="text-gray-500">
                  {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                </p>
                <p className="text-gray-500">{order.shipping_address.country}</p>
                {order.shipping_address.phone && (
                  <p className="text-gray-500 mt-2">{order.shipping_address.phone}</p>
                )}
                
                {order.shipping_method && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="font-medium text-gray-900">Shipping Method</p>
                    <p className="text-gray-500">{order.shipping_method.name}</p>
                    <p className="text-gray-500">
                      {formatPrice(order.shipping_method.price, order.currency_code)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No shipping information available</p>
            )}
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center">
            <CreditCardIcon className="h-6 w-6 text-gray-400 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
          </div>
          
          <div className="p-6">
            {order.payment_method ? (
              <div>
                <p className="font-medium text-gray-900">
                  {order.payment_method.data.brand} ending in {order.payment_method.data.last4}
                </p>
                
                {order.billing_address && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="font-medium text-gray-900">Billing Address</p>
                    <p className="text-gray-500">
                      {order.billing_address.first_name} {order.billing_address.last_name}
                    </p>
                    <p className="text-gray-500">{order.billing_address.address_1}</p>
                    {order.billing_address.address_2 && (
                      <p className="text-gray-500">{order.billing_address.address_2}</p>
                    )}
                    <p className="text-gray-500">
                      {order.billing_address.city}, {order.billing_address.province} {order.billing_address.postal_code}
                    </p>
                    <p className="text-gray-500">{order.billing_address.country}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No payment information available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}