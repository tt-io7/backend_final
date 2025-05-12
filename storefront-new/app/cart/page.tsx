'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon } from '@heroicons/react/24/outline'
import { formatMoney } from '../../lib/utils'

export default function CartPage() {
  // This would come from a cart context in a real implementation
  const [cartItems, setCartItems] = useState([
    {
      id: 'cart_1',
      title: 'Premium Wireless Headphones',
      variant: 'Black',
      price: { amount: 15900, currency_code: 'USD' },
      quantity: 1,
      image: '/images/products/headphones-1.jpg',
    },
    {
      id: 'cart_2',
      title: 'Smart Watch Series 5',
      variant: 'Black',
      price: { amount: 24900, currency_code: 'USD' },
      quantity: 2,
      image: '/images/products/smartwatch-1.jpg',
    },
  ])

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price.amount * item.quantity,
    0
  )
  const shipping = subtotal > 10000 ? 0 : 999
  const tax = Math.round(subtotal * 0.07)
  const total = subtotal + shipping + tax

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    setCartItems(
      cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const applyCoupon = () => {
    setIsApplyingCoupon(true)
    setCouponError('')

    // Simulate API call
    setTimeout(() => {
      setCouponError('Invalid coupon code')
      setIsApplyingCoupon(false)
    }, 1000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-0">
          <h1 className="text-3xl font-extrabold text-center tracking-tight text-gray-900">Your Cart</h1>
          <div className="mt-12 text-center">
            <div className="text-sm text-gray-500">Your cart is empty</div>
            <div className="mt-6">
              <Link
                href="/collections/all"
                className="inline-block bg-blue-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Your Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="py-6 flex">
                  <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link href={`/products/${item.title.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-600">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="ml-4">
                          {formatMoney({
                            amount: item.price.amount * item.quantity,
                            currency_code: item.price.currency_code,
                          })}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{item.variant}</p>
                    </div>

                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.id}`} className="sr-only">
                          Quantity
                        </label>
                        <select
                          id={`quantity-${item.id}`}
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-red-600 hover:text-red-500 flex items-center"
                          onClick={() => removeItem(item.id)}
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 lg:mt-0 lg:col-span-5">
            <div className="bg-gray-50 rounded-lg px-6 py-8">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-900 font-medium">
                    {formatMoney({
                      amount: subtotal,
                      currency_code: 'USD',
                    })}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="text-gray-900 font-medium">
                    {shipping === 0
                      ? 'Free'
                      : formatMoney({
                          amount: shipping,
                          currency_code: 'USD',
                        })}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Tax</p>
                  <p className="text-gray-900 font-medium">
                    {formatMoney({
                      amount: tax,
                      currency_code: 'USD',
                    })}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">Total</p>
                    <p className="text-xl font-medium text-gray-900">
                      {formatMoney({
                        amount: total,
                        currency_code: 'USD',
                      })}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Including taxes and shipping
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="relative mb-6">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="coupon"
                      name="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className={`block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        couponError ? 'border-red-300' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={!couponCode || isApplyingCoupon}
                      className="relative inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {couponError}
                    </p>
                  )}
                </div>
                
                <button
                  type="button"
                  className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Proceed to Checkout
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/collections/all"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}