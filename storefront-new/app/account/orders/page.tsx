'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBagIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '../../../lib/utils'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface Order {
  id: string
  display_id: string
  status: string
  created_at: string
  total: number
  currency_code: string
  items: {
    id: string
    title: string
    quantity: number
    unit_price: number
    thumbnail?: string
  }[]
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'order_01',
    display_id: '1001',
    status: 'completed',
    created_at: '2025-03-15T10:00:00Z',
    total: 99900,
    currency_code: 'usd',
    items: [
      {
        id: 'item_01',
        title: 'iPhone 15 Pro - 128GB - Black',
        quantity: 1,
        unit_price: 99900,
        thumbnail: 'https://via.placeholder.com/300x400'
      }
    ]
  },
  {
    id: 'order_02',
    display_id: '1002',
    status: 'processing',
    created_at: '2025-03-20T14:30:00Z',
    total: 249900,
    currency_code: 'usd',
    items: [
      {
        id: 'item_02',
        title: 'MacBook Pro 16" - M3 Pro - 512GB',
        quantity: 1,
        unit_price: 249900,
        thumbnail: 'https://via.placeholder.com/300x400'
      }
    ]
  }
]

export default function OrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
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
            
            // In a real implementation, you would fetch the user's orders from the API
            // For now, we'll use mock data
            setOrders(mockOrders)
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
  }, [router])
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
  
  if (!user) {
    return null // Will redirect to login
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <Link
          href="/account"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to Account
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="p-6 hover:bg-gray-50">
                <Link href={`/account/orders/${order.id}`} className="block">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900">
                          Order #{order.display_id}
                        </p>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-lg font-medium text-gray-900">
                        {formatPrice(order.total, order.currency_code)}
                      </p>
                      <ChevronRightIcon className="ml-2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
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
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Qty: {item.quantity} × {formatPrice(item.unit_price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}