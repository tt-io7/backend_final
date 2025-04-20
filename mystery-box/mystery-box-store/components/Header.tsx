'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CSSProperties } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIfMobile()
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  const headerStyle: CSSProperties = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1rem 0'
  }

  const containerStyle: CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const logoStyle: CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#9370DB',
    textDecoration: 'none'
  }

  const menuButtonStyle: CSSProperties = {
    color: '#9370DB',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem'
  }

  const navStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center'
  }

  const navListStyle: CSSProperties = {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '1.5rem'
  }

  const navItemStyle: CSSProperties = {
    color: '#9370DB',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s'
  }

  const mobileNavStyle: CSSProperties = {
    marginTop: '1rem'
  }

  const mobileNavListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '0.5rem'
  }

  const mobileNavItemStyle: CSSProperties = {
    display: 'block',
    padding: '0.5rem 0',
    color: '#9370DB',
    textDecoration: 'none',
    fontWeight: '500'
  }

  const cartIconStyle: CSSProperties = {
    position: 'relative',
    color: '#9370DB'
  }

  const cartCountStyle: CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#FFD700',
    color: 'white',
    fontSize: '0.75rem',
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link href="/" style={logoStyle}>
          Mystery Box Store
        </Link>

        {/* Mobile menu button - only shown on mobile */}
        {isMobile && (
          <button 
            style={menuButtonStyle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        )}

        {/* Desktop Navigation - only shown on desktop */}
        {!isMobile && (
          <nav style={navStyle}>
            <ul style={navListStyle}>
              <li><Link href="/" style={navItemStyle}>Home</Link></li>
              <li><Link href="/how-it-works" style={navItemStyle}>How It Works</Link></li>
              <li><Link href="/create-box" style={navItemStyle}>Create Box</Link></li>
              <li><Link href="/login" style={navItemStyle}>Login</Link></li>
              <li><Link href="/register" style={navItemStyle}>Register</Link></li>
              <li>
                <Link href="/cart" style={cartIconStyle}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span style={cartCountStyle}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Mobile Navigation - only shown when menu is open on mobile */}
      {isMobile && isMenuOpen && (
        <nav style={mobileNavStyle}>
          <ul style={mobileNavListStyle}>
            <li><Link href="/" style={mobileNavItemStyle}>Home</Link></li>
            <li><Link href="/how-it-works" style={mobileNavItemStyle}>How It Works</Link></li>
            <li><Link href="/create-box" style={mobileNavItemStyle}>Create Box</Link></li>
            <li><Link href="/login" style={mobileNavItemStyle}>Login</Link></li>
            <li><Link href="/register" style={mobileNavItemStyle}>Register</Link></li>
            <li>
              <Link href="/cart" style={{...mobileNavItemStyle, display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '0.5rem'}}>Cart</span>
                {cartCount > 0 && (
                  <span style={{
                    backgroundColor: '#FFD700',
                    color: 'white',
                    fontSize: '0.75rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}