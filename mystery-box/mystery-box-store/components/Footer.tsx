'use client'

import { useState, useEffect, CSSProperties } from 'react'
import Link from 'next/link'

export default function Footer() {
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

  const footerStyle: CSSProperties = {
    backgroundColor: 'white',
    borderTop: '1px solid #f0e6ff',
    padding: '2rem 0'
  }

  const containerStyle: CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  }

  const flexContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between'
  }

  const columnStyle: CSSProperties = {
    marginBottom: isMobile ? '2rem' : '0'
  }

  const headingStyle: CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#9370DB'
  }

  const paragraphStyle: CSSProperties = {
    fontSize: '0.875rem',
    color: '#666'
  }

  const listHeadingStyle: CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#9370DB'
  }

  const listStyle: CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  }

  const listItemStyle: CSSProperties = {
    marginBottom: '0.25rem'
  }

  const linkStyle: CSSProperties = {
    color: '#666',
    textDecoration: 'none',
    fontSize: '0.875rem'
  }

  const linkHoverStyle: CSSProperties = {
    color: '#9370DB'
  }

  const copyrightStyle: CSSProperties = {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #f0e6ff',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#666'
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={flexContainerStyle}>
          <div style={columnStyle}>
            <h3 style={headingStyle}>Mystery Box Store</h3>
            <p style={paragraphStyle}>Surprise yourself with curated products within your budget</p>
          </div>
          
          <div style={columnStyle}>
            <h4 style={listHeadingStyle}>Shop</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <Link href="/create-box" style={linkStyle}>Create a Box</Link>
              </li>
              <li style={listItemStyle}>
                <Link href="/how-it-works" style={linkStyle}>How It Works</Link>
              </li>
            </ul>
          </div>
          
          <div style={columnStyle}>
            <h4 style={listHeadingStyle}>Account</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <Link href="/login" style={linkStyle}>Login</Link>
              </li>
              <li style={listItemStyle}>
                <Link href="/register" style={linkStyle}>Register</Link>
              </li>
              <li style={listItemStyle}>
                <Link href="/orders" style={linkStyle}>Order History</Link>
              </li>
            </ul>
          </div>
          
          <div style={columnStyle}>
            <h4 style={listHeadingStyle}>Info</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <Link href="/about" style={linkStyle}>About Us</Link>
              </li>
              <li style={listItemStyle}>
                <Link href="/contact" style={linkStyle}>Contact</Link>
              </li>
              <li style={listItemStyle}>
                <Link href="/faq" style={linkStyle}>FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={copyrightStyle}>
          <p>&copy; {new Date().getFullYear()} Mystery Box Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}