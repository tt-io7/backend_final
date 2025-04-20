'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function HowItWorks() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center text-lilac-dark">How Mystery Box Works</h1>
        
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-lilac-dark">The Mystery Box Experience</h2>
            <p className="text-lg mb-4">
              Our Mystery Box service offers a unique and exciting shopping experience. Instead of selecting specific products, 
              you set a budget, and we curate a surprise selection of premium items that match or exceed the value of your budget.
            </p>
            <p className="text-lg mb-4">
              Each Mystery Box is carefully curated by our team to ensure you receive high-quality products that provide excellent value.
              The excitement is in the surprise - you won't know what you're getting until your package arrives!
            </p>
          </section>
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-lilac-dark">How to Order Your Mystery Box</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="card text-center">
                <div className="text-gold text-4xl mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Set Your Budget</h3>
                <p>Choose how much you want to spend on your mystery box. We offer predefined options or you can set a custom amount.</p>
              </div>
              
              <div className="card text-center">
                <div className="text-gold text-4xl mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Create an Account</h3>
                <p>Sign up or log in to your account. This helps us track your orders and preferences for a better experience.</p>
              </div>
              
              <div className="card text-center">
                <div className="text-gold text-4xl mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Complete Your Purchase</h3>
                <p>Proceed to checkout, enter your shipping details, and complete your payment securely.</p>
              </div>
            </div>
            
            <div className="text-center">
              <Link href="/create-box" className="btn-primary">Create Your Mystery Box Now</Link>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-lilac-dark">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-bold mb-2 text-lilac-dark">What types of products are included in Mystery Boxes?</h3>
                <p>Our Mystery Boxes contain a variety of premium products from our store inventory. This can include clothing, accessories, home goods, and more. All items are carefully selected to match or exceed the value of your budget.</p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-2 text-lilac-dark">Can I return items from my Mystery Box?</h3>
                <p>Due to the nature of Mystery Boxes, we have a special return policy. If you receive items that are damaged or defective, we'll replace them. However, we cannot accept returns based on personal preference, as the surprise element is part of the experience.</p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-2 text-lilac-dark">How is the value of my Mystery Box determined?</h3>
                <p>We guarantee that the retail value of the items in your Mystery Box will meet or exceed the amount you paid. In many cases, the value will be significantly higher than your budget, offering you excellent value.</p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-2 text-lilac-dark">How long will it take to receive my Mystery Box?</h3>
                <p>Mystery Boxes are typically shipped within 1-3 business days after your order is placed. Delivery times depend on your location and the shipping method selected at checkout.</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6 text-lilac-dark">Ready to Experience the Surprise?</h2>
            <div className="text-center">
              <p className="text-lg mb-6">Join thousands of satisfied customers who have discovered the joy of our Mystery Boxes!</p>
              <Link href="/create-box" className="btn-primary">Create Your Mystery Box</Link>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}