'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function HowItWorks() {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-purple-800">
            How Mystery Box Works
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto mb-12 text-gray-700">
            Discover the excitement of receiving curated surprise products worth more than what you pay.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-20 relative">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-purple-100"></div>
              
              {/* Step 1 */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                    <h3 className="text-2xl font-bold mb-4 text-purple-700">1. Choose Your Budget</h3>
                    <p className="text-gray-600 mb-4">
                      Start by selecting how much you want to spend on your mystery box. We offer options starting from €25 up to €200, or you can set a custom budget.
                    </p>
                    <p className="text-gray-600">
                      Your budget determines the value and number of items you'll receive in your mystery box.
                    </p>
                  </div>
                  <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-8 md:mb-0">
                    1
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="bg-white rounded-lg shadow-md p-6 border border-purple-100">
                        <h4 className="font-bold mb-2 text-purple-700">Budget Options</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li>€25 - Starter Box</li>
                          <li>€50 - Standard Box</li>
                          <li>€75 - Premium Box</li>
                          <li>€100 - Deluxe Box</li>
                          <li>€150 - Ultimate Box</li>
                          <li>€200 - Luxury Box</li>
                          <li>Custom - Set your own budget</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-2 md:order-1">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="bg-white rounded-lg shadow-md p-6 border border-purple-100">
                        <h4 className="font-bold mb-2 text-purple-700">Our Curation Process</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li>Products are selected based on quality and value</li>
                          <li>Each box contains a mix of different product categories</li>
                          <li>We ensure the total value exceeds your budget by at least 20%</li>
                          <li>Products are brand new and authentic</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-8 md:mb-0">
                    2
                  </div>
                  <div className="md:w-1/2 md:pl-12 order-1 md:order-2 md:text-left">
                    <h3 className="text-2xl font-bold mb-4 text-purple-700">2. We Curate Your Box</h3>
                    <p className="text-gray-600 mb-4">
                      Our team of experts carefully selects premium products based on your budget. We ensure that the total value of items exceeds what you paid.
                    </p>
                    <p className="text-gray-600">
                      Each box is thoughtfully curated to provide a delightful surprise experience with a variety of high-quality items.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                    <h3 className="text-2xl font-bold mb-4 text-purple-700">3. Secure Payment</h3>
                    <p className="text-gray-600 mb-4">
                      Complete your purchase with our secure payment system. We accept all major credit cards and PayPal for your convenience.
                    </p>
                    <p className="text-gray-600">
                      Your payment information is encrypted and protected. We never store your full credit card details.
                    </p>
                  </div>
                  <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-8 md:mb-0">
                    3
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="bg-white rounded-lg shadow-md p-6 border border-purple-100">
                        <h4 className="font-bold mb-2 text-purple-700">Payment Methods</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li>Credit/Debit Cards</li>
                          <li>PayPal</li>
                          <li>Apple Pay</li>
                          <li>Google Pay</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-2 md:order-1">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="bg-white rounded-lg shadow-md p-6 border border-purple-100">
                        <h4 className="font-bold mb-2 text-purple-700">Shipping Information</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li>Free shipping on orders over €75</li>
                          <li>Standard shipping: 3-5 business days</li>
                          <li>Express shipping available</li>
                          <li>International shipping to select countries</li>
                          <li>Tracking number provided via email</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-8 md:mb-0">
                    4
                  </div>
                  <div className="md:w-1/2 md:pl-12 order-1 md:order-2 md:text-left">
                    <h3 className="text-2xl font-bold mb-4 text-purple-700">4. Receive Your Surprise</h3>
                    <p className="text-gray-600 mb-4">
                      Your mystery box is carefully packaged and shipped to your doorstep. Track your delivery with the provided tracking number.
                    </p>
                    <p className="text-gray-600">
                      When your package arrives, experience the excitement of unboxing your surprise selection of premium products!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h3 className="font-bold text-lg text-purple-700 mb-2">What's inside a mystery box?</h3>
              <p className="text-gray-600">
                Each mystery box contains a carefully curated selection of premium products. The specific items are a surprise, but we ensure that the total value exceeds your budget by at least 20%.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h3 className="font-bold text-lg text-purple-700 mb-2">Can I return items from my mystery box?</h3>
              <p className="text-gray-600">
                Due to the nature of mystery boxes, we don't accept returns for preference reasons. However, if you receive damaged or defective items, please contact our customer service within 7 days of delivery.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h3 className="font-bold text-lg text-purple-700 mb-2">How often can I order a mystery box?</h3>
              <p className="text-gray-600">
                You can order as many mystery boxes as you'd like! Many customers enjoy ordering monthly boxes as a treat for themselves or as gifts for friends and family.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg text-purple-700 mb-2">Do you ship internationally?</h3>
              <p className="text-gray-600">
                Yes, we ship to select countries internationally. Shipping costs and delivery times vary by location. Please check our shipping policy for more details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Mystery?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create your mystery box today and discover the joy of unboxing a curated surprise.
          </p>
          <Link 
            href="/create-box" 
            className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-md text-lg transition-colors inline-block"
          >
            Create Your Box Now
          </Link>
        </div>
      </section>
    </div>
  )
}