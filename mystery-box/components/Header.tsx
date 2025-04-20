'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <header className="bg-white shadow-soft">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-primary-dark hover:text-primary transition-colors"
            aria-label="Mystery Box Home"
          >
            Mystery Box
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-primary-dark hover:text-primary transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-primary-600 hover:text-primary-800 transition-colors font-medium">Home</Link>
            <Link href="/how-it-works" className="text-primary-600 hover:text-primary-800 transition-colors font-medium">How It Works</Link>
            <Link href="/login" className="text-primary-600 hover:text-primary-800 transition-colors font-medium">Login</Link>
            <Link href="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">Register</Link>
            <a className="text-gray-700 hover:text-primary transition-colors" aria-label="Account" href="/account">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </a>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <nav
          id="mobile-menu"
          className={`md:hidden mt-4 transition-all duration-200 ease-in-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <ul className="flex flex-col space-y-3">
            <li><Link href="/" className="block py-2 px-3 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-colors font-medium">Home</Link></li>
            <li><Link href="/how-it-works" className="block py-2 px-3 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-colors font-medium">How It Works</Link></li>
            <li><Link href="/login" className="block py-2 px-3 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-colors font-medium">Login</Link></li>
            <li><Link href="/register" className="block w-full text-center py-2 px-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium">Register</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
