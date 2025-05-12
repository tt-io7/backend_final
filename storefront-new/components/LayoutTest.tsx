'use client'

import React, { useState, useEffect } from 'react'

export default function LayoutTest() {
  const [activeTest, setActiveTest] = useState('flex')
  const [browserInfo, setBrowserInfo] = useState('SSR')
  const [viewportInfo, setViewportInfo] = useState('SSR')
  
  // Use useEffect to update browser and viewport info only on the client side
  useEffect(() => {
    setBrowserInfo(window.navigator.userAgent)
    setViewportInfo(`${window.innerWidth}x${window.innerHeight}`)
    
    const handleResize = () => {
      setViewportInfo(`${window.innerWidth}x${window.innerHeight}`)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#9370DB' }}>Layout Test Component</h2>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2" style={{ display: 'flex' }}>
          <button 
            className={`px-4 py-2 rounded-md ${activeTest === 'flex' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            style={activeTest === 'flex' ? { backgroundColor: '#9370DB', color: 'white' } : {}}
            onClick={() => setActiveTest('flex')}
          >
            Flexbox Test
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTest === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            style={activeTest === 'grid' ? { backgroundColor: '#9370DB', color: 'white' } : {}}
            onClick={() => setActiveTest('grid')}
          >
            Grid Test
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${activeTest === 'responsive' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            style={activeTest === 'responsive' ? { backgroundColor: '#9370DB', color: 'white' } : {}}
            onClick={() => setActiveTest('responsive')}
          >
            Responsive Test
          </button>
        </div>
      </div>
      
      {activeTest === 'flex' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#9370DB' }}>Flexbox Layout</h3>
          
          <div className="p-4 bg-gray-100 rounded-md mb-4">
            <p className="mb-2 font-medium">Horizontal Flex (flex flex-row):</p>
            <div className="flex flex-row space-x-4 bg-white p-4 rounded-md" style={{ display: 'flex', flexDirection: 'row' }}>
              <div className="p-4 bg-primary text-white rounded-md" style={{ backgroundColor: '#9370DB', color: 'white' }}>Item 1</div>
              <div className="p-4 bg-primary-light text-white rounded-md" style={{ backgroundColor: '#B19CD9', color: 'white' }}>Item 2</div>
              <div className="p-4 bg-primary-dark text-white rounded-md" style={{ backgroundColor: '#7B68EE', color: 'white' }}>Item 3</div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="mb-2 font-medium">Vertical Flex (flex flex-col):</p>
            <div className="flex flex-col space-y-4 bg-white p-4 rounded-md" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="p-4 bg-secondary text-white rounded-md" style={{ backgroundColor: '#D4AF37', color: 'white' }}>Item 1</div>
              <div className="p-4 bg-secondary-light text-white rounded-md" style={{ backgroundColor: '#FFD700', color: 'white' }}>Item 2</div>
              <div className="p-4 bg-secondary-dark text-white rounded-md" style={{ backgroundColor: '#996515', color: 'white' }}>Item 3</div>
            </div>
          </div>
        </div>
      )}
      
      {activeTest === 'grid' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#9370DB' }}>Grid Layout</h3>
          
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="mb-2 font-medium">Basic Grid (grid grid-cols-3):</p>
            <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-md" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="p-4 bg-primary text-white rounded-md" style={{ backgroundColor: '#9370DB', color: 'white' }}>Item 1</div>
              <div className="p-4 bg-primary-light text-white rounded-md" style={{ backgroundColor: '#B19CD9', color: 'white' }}>Item 2</div>
              <div className="p-4 bg-primary-dark text-white rounded-md" style={{ backgroundColor: '#7B68EE', color: 'white' }}>Item 3</div>
              <div className="p-4 bg-secondary text-white rounded-md" style={{ backgroundColor: '#D4AF37', color: 'white' }}>Item 4</div>
              <div className="p-4 bg-secondary-light text-white rounded-md" style={{ backgroundColor: '#FFD700', color: 'white' }}>Item 5</div>
              <div className="p-4 bg-secondary-dark text-white rounded-md" style={{ backgroundColor: '#996515', color: 'white' }}>Item 6</div>
            </div>
          </div>
        </div>
      )}
      
      {activeTest === 'responsive' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: '#9370DB' }}>Responsive Layout</h3>
          
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="mb-2 font-medium">Responsive Grid (grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-md" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="p-4 bg-primary text-white rounded-md" style={{ backgroundColor: '#9370DB', color: 'white' }}>Item 1</div>
              <div className="p-4 bg-primary-light text-white rounded-md" style={{ backgroundColor: '#B19CD9', color: 'white' }}>Item 2</div>
              <div className="p-4 bg-primary-dark text-white rounded-md" style={{ backgroundColor: '#7B68EE', color: 'white' }}>Item 3</div>
              <div className="p-4 bg-secondary text-white rounded-md" style={{ backgroundColor: '#D4AF37', color: 'white' }}>Item 4</div>
              <div className="p-4 bg-secondary-light text-white rounded-md" style={{ backgroundColor: '#FFD700', color: 'white' }}>Item 5</div>
              <div className="p-4 bg-secondary-dark text-white rounded-md" style={{ backgroundColor: '#996515', color: 'white' }}>Item 6</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <p className="font-medium mb-2">Debug Information:</p>
        <pre className="text-xs bg-gray-800 text-white p-4 rounded-md overflow-auto">
          {`Active Test: ${activeTest}
Browser: ${browserInfo}
Viewport: ${viewportInfo}`}
        </pre>
      </div>
    </div>
  )
}