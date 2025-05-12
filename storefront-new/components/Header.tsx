'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline'
import { useWishlist } from '../hooks/use-wishlist'
import { useCartContext } from '../context/cart-context'
import { useAuth } from '../lib/context/auth-context'
import SearchBar from './SearchBar'

export default function Header() {
  const pathname = usePathname()
  const { wishlist } = useWishlist()
  const { openMiniCart, itemCount: cartItemsCount = 0 } = useCartContext() || {}
  const { isAuthenticated, customer, logout } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [wishlistItemsCount, setWishlistItemsCount] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [country, setCountry] = useState('us') // Default country
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  
  // Get country from pathname
  useEffect(() => {
    if (pathname) {
      const match = pathname.match(/^\/([^\/]+)/)
      if (match && match[1] !== '[country]') {
        setCountry(match[1])
      }
    }
  }, [pathname])

  // Update wishlist items count when wishlist changes
  useEffect(() => {
    setWishlistItemsCount(wishlist?.length || 0)
  }, [wishlist])

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }
  
  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu)
  }
  
  const handleLogout = async () => {
    await logout()
    setShowAccountMenu(false)
  }

  const handleCartOpen = () => {
    if (typeof openMiniCart === 'function') {
      openMiniCart()
    } else {
      console.warn('openMiniCart is not a function')
    }
  }

  const navigation = [
    { name: 'Home', href: `/${country}` },
    { name: 'Products', href: `/${country}/products` },
    { name: 'Categories', href: `/${country}/categories` },
    { name: 'About', href: `/${country}/about` },
    { name: 'Contact', href: `/${country}/contact` },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link href={`/${country}`} className="flex items-center">
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                AndMore
              </span>
              <span className="ml-1 text-xs font-medium text-gold-600 mt-1">PREMIUM TECH</span>
            </Link>
          </div>

          {/* Navigation - Center (Desktop only) */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname === item.href
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Icons - For all screen sizes */}
          <div className="flex items-center space-x-6">
            {/* Search Icon */}
            <button
              type="button"
              className="text-gray-700 hover:text-primary transition-colors"
              aria-label="Search"
              onClick={toggleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            {/* Account Icon */}
            <div className="relative">
              <button
                onClick={toggleAccountMenu}
                className="text-gray-700 hover:text-primary transition-colors"
                aria-label="Account"
              >
                <UserIcon className="h-6 w-6" />
              </button>
              
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <span className="font-medium">
                          {customer?.first_name} {customer?.last_name}
                        </span>
                        <p className="text-xs text-gray-500 truncate">{customer?.email}</p>
                      </div>
                      <Link 
                        href={`/${country}/account`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        My Account
                      </Link>
                      <Link 
                        href={`/${country}/account/orders`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href={`/${country}/login`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        href={`/${country}/register`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href={`/${country}/wishlist`}
              className="text-gray-700 hover:text-primary transition-colors relative"
              aria-label="Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"></path>
              </svg>
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>

            {/* Cart/Basket Icon */}
            <button
              type="button"
              onClick={handleCartOpen}
              className="text-gray-700 hover:text-primary transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="mt-4 pb-4 animate-slide-up">
            <SearchBar />
          </div>
        )}
      </div>

    </header>
  )
}