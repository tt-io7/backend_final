import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'

type SuccessPageProps = {
  params: {
    country: string
  }
  searchParams: {
    order_id?: string
  }
}

export default function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { country } = params
  const orderId = searchParams.order_id
  
  // In a real implementation, we would check if the orderId is valid
  // and fetch the order details from the API
  if (!orderId) {
    redirect(`/${country}`)
  }
  
  // Mock order for demonstration
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    email: 'customer@example.com',
    total: 378.95,
    shipping: {
      address: {
        line1: '123 Main St',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'United States'
      },
      method: 'Standard Shipping',
      cost: 9.99
    },
    items: [
      {
        id: 'item_1',
        name: 'Wireless Headphones',
        variant: 'Black',
        price: 199.99,
        quantity: 1,
        image: 'https://placehold.co/200x200/9370DB/FFFFFF?text=Headphones'
      },
      {
        id: 'item_2',
        name: 'Smartwatch',
        variant: 'Silver',
        price: 249.99,
        quantity: 1,
        image: 'https://placehold.co/200x200/9370DB/FFFFFF?text=Smartwatch'
      }
    ]
  }
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="bg-green-100 rounded-full p-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
        <p className="text-lg text-gray-600">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        <p className="text-gray-600 mt-1">
          A confirmation email has been sent to <span className="font-medium">{order.email}</span>
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="bg-primary-dark/10 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <span className="text-gray-600">Order #{order.id}</span>
          </div>
          <p className="text-gray-600 text-sm mt-1">Placed on {order.date}</p>
        </div>
        
        <div className="p-6 divide-y divide-gray-200">
          {/* Order items */}
          <div className="pb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.variant}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.quantity} x {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shipping address */}
          <div className="py-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Shipping Information</h3>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600">{order.shipping.address.line1}</p>
                {order.shipping.address.line2 && (
                  <p className="text-gray-600">{order.shipping.address.line2}</p>
                )}
                <p className="text-gray-600">
                  {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.postal_code}
                </p>
                <p className="text-gray-600">{order.shipping.address.country}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">{order.shipping.method}</p>
                <p className="text-gray-600">{formatPrice(order.shipping.cost)}</p>
              </div>
            </div>
          </div>
          
          {/* Payment summary */}
          <div className="pt-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900 font-medium">
                  {formatPrice(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900 font-medium">{formatPrice(order.shipping.cost)}</p>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <p className="text-gray-900 font-medium">Total</p>
                <p className="text-gray-900 font-bold">{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Link
          href={`/${country}/account/orders/${order.id}`}
          className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-center"
        >
          View Order Details
        </Link>
        
        <Link
          href={`/${country}`}
          className="w-full md:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
} 