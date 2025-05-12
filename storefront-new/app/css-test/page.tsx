'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CSSTestPage() {
  const [activeTab, setActiveTab] = useState('colors')
  
  return (
    <div className="container py-12">
      <h1 className="heading-lg mb-8" style={{ color: '#9370DB' }}>AndMore Tech - Style Guide</h1>
      
      <div className="mb-8">
        <p className="text-lg text-gray-700 mb-6">
          This page showcases the updated styling with lilac, white, and gold color scheme, improved typography, and layout fixes for Chrome.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'colors' ? 'bg-primary-direct text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('colors')}
          >
            Color Scheme
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'typography' ? 'bg-primary-direct text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('typography')}
          >
            Typography
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'components' ? 'bg-primary-direct text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('components')}
          >
            Components
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'layout' ? 'bg-primary-direct text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('layout')}
          >
            Layout
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTab === 'animations' ? 'bg-primary-direct text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('animations')}
          >
            Animations
          </button>
        </div>
      </div>
      
      {activeTab === 'colors' && (
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="heading-md mb-6" style={{ color: '#9370DB' }}>Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Primary Colors (Lilac)</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-24 h-12 rounded-l-md" style={{ backgroundColor: '#4C1D95' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#5B21B6' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#6D28D9' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#7B68EE' }}></div>
                  <div className="w-24 h-12 rounded-r-md" style={{ backgroundColor: '#9370DB' }}></div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 h-12 rounded-l-md" style={{ backgroundColor: '#A78BFA' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#C4B5FD' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#DDD6FE' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#EDE9FE' }}></div>
                  <div className="w-24 h-12 rounded-r-md" style={{ backgroundColor: '#F5F3FF' }}></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#9370DB' }}>Primary</div>
                  <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#B19CD9' }}>Primary Light</div>
                  <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#7B68EE' }}>Primary Dark</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Secondary Colors (Gold)</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-24 h-12 rounded-l-md" style={{ backgroundColor: '#451A03' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#78350F' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#92400E' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#996515' }}></div>
                  <div className="w-24 h-12 rounded-r-md" style={{ backgroundColor: '#D4AF37' }}></div>
                </div>
                <div className="flex items-center">
                  <div className="w-24 h-12 rounded-l-md" style={{ backgroundColor: '#FBBF24' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#FCD34D' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#FDE68A' }}></div>
                  <div className="w-24 h-12" style={{ backgroundColor: '#FEF3C7' }}></div>
                  <div className="w-24 h-12 rounded-r-md" style={{ backgroundColor: '#FFFBEB' }}></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#D4AF37' }}>Secondary</div>
                  <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#FFD700' }}>Secondary Light</div>
                  <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#996515' }}>Secondary Dark</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Gradients</h3>
              <div className="space-y-3">
                <div className="h-16 rounded-md bg-gradient-lilac"></div>
                <div className="h-16 rounded-md bg-gradient-gold"></div>
                <div className="h-16 rounded-md" style={{ background: 'linear-gradient(to right, #9370DB, #D4AF37)' }}></div>
              </div>
            </div>
            
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Status Colors</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#10B981' }}>Success</div>
                <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#F59E0B' }}>Warning</div>
                <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#EF4444' }}>Error</div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {activeTab === 'typography' && (
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="heading-md mb-6" style={{ color: '#9370DB' }}>Typography</h2>
          
          <div className="mb-8">
            <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Headings</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: '#9370DB', fontFamily: "'Playfair Display', serif" }}>Heading XL</h1>
                <p className="text-sm text-gray-500">Font: Playfair Display, 4xl-6xl</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: '#9370DB', fontFamily: "'Playfair Display', serif" }}>Heading LG</h1>
                <p className="text-sm text-gray-500">Font: Playfair Display, 3xl-5xl</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#9370DB', fontFamily: "'Playfair Display', serif" }}>Heading MD</h2>
                <p className="text-sm text-gray-500">Font: Playfair Display, 2xl-3xl</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-xl md:text-2xl font-bold" style={{ color: '#9370DB', fontFamily: "'Playfair Display', serif" }}>Heading SM</h3>
                <p className="text-sm text-gray-500">Font: Playfair Display, xl-2xl</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Body Text</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-lg">Large Text: The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-gray-500">Font: Inter, text-lg</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-base">Medium Text: The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-gray-500">Font: Inter, text-base</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm">Small Text: The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-gray-500">Font: Inter, text-sm</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-xs">Extra Small Text: The quick brown fox jumps over the lazy dog.</p>
                <p className="text-sm text-gray-500">Font: Inter, text-xs</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Text Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p style={{ color: '#9370DB' }}>Primary Text</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p style={{ color: '#D4AF37' }}>Secondary Text</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p style={{ color: '#111827' }}>Dark Text</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p style={{ color: '#6B7280' }}>Muted Text</p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {activeTab === 'components' && (
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="heading-md mb-6" style={{ color: '#9370DB' }}>Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Buttons</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 rounded-md font-medium text-white" style={{ backgroundColor: '#9370DB' }}>
                    Primary Button
                  </button>
                  <button className="px-4 py-2 rounded-md font-medium text-white" style={{ backgroundColor: '#D4AF37' }}>
                    Secondary Button
                  </button>
                  <button className="px-4 py-2 rounded-md font-medium" style={{ color: '#9370DB', border: '1px solid #9370DB' }}>
                    Outline Button
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Form Elements</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Text Input" 
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  style={{ outline: 'none' }}
                />
                <select className="w-full border border-gray-300 rounded-md px-4 py-2">
                  <option>Select Option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="checkbox" />
                  <label htmlFor="checkbox">Checkbox</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Cards</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-6">
                <h4 className="text-lg font-semibold mb-2">Card Title</h4>
                <p className="text-gray-600 mb-4">This is a basic card component with some content.</p>
                <button className="px-4 py-2 rounded-md font-medium text-white" style={{ backgroundColor: '#9370DB' }}>
                  Action
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Card with Hover</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                <h4 className="text-lg font-semibold mb-2">Hover Card</h4>
                <p className="text-gray-600 mb-4">This card has hover effects. Try hovering over it!</p>
                <button className="px-4 py-2 rounded-md font-medium text-white" style={{ backgroundColor: '#D4AF37' }}>
                  Action
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {activeTab === 'layout' && (
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="heading-md mb-6" style={{ color: '#9370DB' }}>Layout</h2>
          
          <div className="mb-8">
            <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Flexbox Layout</h3>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm">
                <div className="p-3 rounded-md text-white" style={{ backgroundColor: '#9370DB' }}>Left</div>
                <div className="p-3 rounded-md text-white" style={{ backgroundColor: '#B19CD9' }}>Center</div>
                <div className="p-3 rounded-md text-white" style={{ backgroundColor: '#7B68EE' }}>Right</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex flex-col space-y-4 bg-white p-4 rounded-md shadow-sm">
                <div className="p-3 rounded-md text-white" style={{ backgroundColor: '#D4AF37' }}>Top</div>
                <div className="p-3 rounded-md text-white" style={{ backgroundColor: '#FFD700' }}>Middle</div>
                <div className="p-3 rounded-md text-white" style={{ backgroundColor: '#996515' }}>Bottom</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Grid Layout</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded-md shadow-sm">
                <div className="p-4 rounded-md" style={{ backgroundColor: '#EDE9FE' }}>Item 1</div>
                <div className="p-4 rounded-md" style={{ backgroundColor: '#DDD6FE' }}>Item 2</div>
                <div className="p-4 rounded-md" style={{ backgroundColor: '#C4B5FD' }}>Item 3</div>
                <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#9370DB' }}>Item 4</div>
                <div className="p-4 rounded-md" style={{ backgroundColor: '#FFFBEB' }}>Item 5</div>
                <div className="p-4 rounded-md" style={{ backgroundColor: '#FEF3C7' }}>Item 6</div>
                <div className="p-4 rounded-md" style={{ backgroundColor: '#FDE68A' }}>Item 7</div>
                <div className="p-4 rounded-md text-white" style={{ backgroundColor: '#D4AF37' }}>Item 8</div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {activeTab === 'animations' && (
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="heading-md mb-6" style={{ color: '#9370DB' }}>Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Fade In</h3>
              <div className="bg-gray-50 p-4 rounded-md h-32 flex items-center justify-center">
                <div className="p-4 rounded-md text-white animate-fade-in" style={{ backgroundColor: '#9370DB' }}>
                  Fade In Animation
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Slide Up</h3>
              <div className="bg-gray-50 p-4 rounded-md h-32 flex items-center justify-center">
                <div className="p-4 rounded-md text-white animate-slide-up" style={{ backgroundColor: '#D4AF37' }}>
                  Slide Up Animation
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Slide Down</h3>
              <div className="bg-gray-50 p-4 rounded-md h-32 flex items-center justify-center">
                <div className="p-4 rounded-md text-white animate-slide-down" style={{ backgroundColor: '#B19CD9' }}>
                  Slide Down Animation
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="heading-sm mb-4" style={{ color: '#9370DB' }}>Shrink</h3>
              <div className="bg-gray-50 p-4 rounded-md h-32 flex items-center justify-center">
                <div className="p-4 rounded-md text-white w-full animate-shrink" style={{ backgroundColor: '#FFD700' }}>
                  Shrink Animation
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <div className="mt-8">
        <Link href="/" className="font-medium" style={{ color: '#9370DB' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}