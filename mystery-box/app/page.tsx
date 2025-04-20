'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <div className="relative">
        {/* Background with subtle animation */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-lilac-light to-white"></div>
        
        <div className="container mx-auto px-4 py-12">
          <main>
            <section className="flex flex-col md:flex-row items-center mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-5xl font-bold mb-6 text-lilac-dark">Discover the Joy of Surprise</h2>
                <p className="text-xl mb-8">Set your budget, and we'll curate a mystery box of premium products just for you. The excitement is in the surprise!</p>
                <div className="flex space-x-4">
                  <Link href="/create-box" className="btn-primary">Create Your Box</Link>
                  <Link href="/how-it-works" className="btn-secondary">Learn More</Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-80 h-80 rounded-lg shadow-xl overflow-hidden border-4 border-gold">
                  <div className="absolute inset-0 bg-lilac-light opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gold-dark">?</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-center text-lilac-dark">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card">
                  <div className="text-2xl font-bold mb-4 text-gold">1. Set Your Budget</div>
                  <p>Choose how much you want to spend on your mystery box.</p>
                </div>
                <div className="card">
                  <div className="text-2xl font-bold mb-4 text-gold">2. Create Account</div>
                  <p>Sign up to track your orders and manage your preferences.</p>
                </div>
                <div className="card">
                  <div className="text-2xl font-bold mb-4 text-gold">3. Receive Your Surprise</div>
                  <p>We'll ship your mystery box filled with carefully selected items.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-8 text-center text-lilac-dark">Customer Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                  <p className="mb-4">"I was amazed by the quality of products in my mystery box! Can't wait to order another one."</p>
                  <div className="font-bold text-lilac-dark">- Sarah J.</div>
                </div>
                <div className="card">
                  <p className="mb-4">"The surprise element makes this so much fun. It's like a gift to myself every month!"</p>
                  <div className="font-bold text-lilac-dark">- Michael T.</div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}