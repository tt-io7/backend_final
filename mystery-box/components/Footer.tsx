'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-lilac-light">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4 text-lilac-dark">Mystery Box</h3>
            <p className="text-sm">Bringing joy through surprise since 2023</p>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-lilac-dark">Quick Links</h4>
            <ul className="text-sm">
              <li className="mb-1"><Link href="/about" className="hover:text-lilac-dark">About Us</Link></li>
              <li className="mb-1"><Link href="/faq" className="hover:text-lilac-dark">FAQ</Link></li>
              <li className="mb-1"><Link href="/contact" className="hover:text-lilac-dark">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-lilac-light text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Mystery Box. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}