'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MysteryBoxCardProps {
  budget: number
  onPurchase: () => void
}

export default function MysteryBoxCard({ budget, onPurchase }: MysteryBoxCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <div 
      className="card hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg border-4 border-gold">
        <div className="absolute inset-0 bg-lilac-light opacity-50"></div>
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <span className="text-6xl font-bold text-gold-dark mb-2">?</span>
          <span className="text-xl font-bold text-lilac-dark">Mystery Box</span>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 text-center">Your Custom Mystery Box</h3>
      <p className="text-gray-600 mb-4 text-center">
        A surprise selection of premium products within your budget
      </p>
      <div className="text-center mb-4">
        <span className="text-2xl font-bold text-lilac-dark">{formatPrice(budget)}</span>
      </div>
      <div className="flex justify-center">
        <button 
          className="btn-primary w-full"
          onClick={onPurchase}
        >
          Purchase Mystery Box
        </button>
      </div>
    </div>
  )
}