import Link from 'next/link'
import Image from 'next/image'

type CartPageProps = {
  params: {
    country: string
  }
}

export default function CartPage({ params }: CartPageProps) {
  const { country } = params
  
  // Mock cart items for demonstration
  const cartItems = [
    {
      id: 'item_1',
      title: 'Wireless Headphones',
      variant: 'Black',
      price: 199,
      quantity: 1,
      image: 'https://placehold.co/200x200/9370DB/FFFFFF?text=Headphones'
    },
    {
      id: 'item_2',
      title: 'Smartwatch',
      variant: 'Silver',
      price: 249,
      quantity: 1,
      image: 'https://placehold.co/200x200/9370DB/FFFFFF?text=Smartwatch'
    }
  ]
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 10
  const total = subtotal + shipping
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            href={`/${country}/products`}
            className="btn btn-primary px-8 py-3"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex p-6">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{item.variant}</p>
                        </div>
                        <p className="text-right font-medium text-gray-900">{formatPrice(item.price)}</p>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between">
                        <div className="flex items-center border rounded-md">
                          <button className="px-3 py-1 text-gray-600 hover:text-gray-900">−</button>
                          <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                          <button className="px-3 py-1 text-gray-600 hover:text-gray-900">+</button>
                        </div>
                        
                        <button className="font-medium text-primary hover:text-primary-dark">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg bg-gray-50 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-900">{formatPrice(subtotal)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium text-gray-900">{formatPrice(shipping)}</p>
                </div>
                
                <div className="border-t pt-4 flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">{formatPrice(total)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href={`/${country}/checkout`}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary py-3 px-8 text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Checkout
                </Link>
              </div>
              
              <div className="mt-4">
                <Link
                  href={`/${country}/products`}
                  className="text-sm text-primary hover:text-primary-dark flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 