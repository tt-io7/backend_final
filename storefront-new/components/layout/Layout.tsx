'use client'

import { ReactNode } from 'react'
// Remove Header and Footer imports as they're already in the app/layout.tsx
// import Header from '../Header'
// import Footer from '../Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Remove Header component to prevent duplication */}
      <main className="flex-grow">
        {children}
      </main>
      {/* Remove Footer component to prevent duplication */}
    </div>
  )
} 