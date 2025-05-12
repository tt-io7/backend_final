'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductCard from '../../../components/ProductCard'
import { ProductGrid } from '../../../components/product'
import FilterSortSystem from '../../../components/FilterSortSystem'
import FadeIn from '../../../components/transitions/FadeIn'
import StaggeredList from '../../../components/transitions/StaggeredList'
import { useAnimationPreference } from '../../../components/transitions/useAnimationPreference'

// Sample accessory products
const accessoryProducts = [
  // Protection category
  {
    id: 'a1',
    title: 'OtterBox Defender Series Case',
    description: 'Rugged protection for your smartphone with multi-layer defense',
    price: 4999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=OtterBox+Case',
    brand: 'OtterBox',
    category: 'protection',
    isNew: false
  },
  {
    id: 'a2',
    title: 'Spigen Ultra Hybrid Screen Protector',
    description: 'Crystal clear tempered glass with 9H hardness for maximum protection',
    price: 1999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Screen+Protector',
    brand: 'Spigen',
    category: 'protection',
    isNew: true
  },
  // Power & Charging category
  {
    id: 'a3',
    title: 'Samsung 45W USB-C Fast Charger',
    description: 'Super fast charging for compatible Samsung devices',
    price: 3999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Samsung+Charger',
    brand: 'Samsung',
    category: 'power',
    isNew: false
  },
  {
    id: 'a4',
    title: 'Anker 20,000mAh Power Bank',
    description: 'Fast charging portable battery with USB-C Power Delivery',
    price: 4999,
    originalPrice: 5999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Anker+Power+Bank',
    brand: 'Anker',
    category: 'power',
    isOnSale: true
  },
  {
    id: 'a5',
    title: 'Belkin 3-in-1 Wireless Charger',
    description: 'Charge your iPhone, Apple Watch, and AirPods simultaneously',
    price: 7999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Wireless+Charger',
    brand: 'Belkin',
    category: 'power',
    isNew: true
  },
  // Audio category
  {
    id: 'a6',
    title: 'Apple AirPods Pro (2nd Generation)',
    description: 'Active noise cancellation earbuds with spatial audio',
    price: 19900,
    originalPrice: 24900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=AirPods+Pro',
    brand: 'Apple',
    category: 'audio',
    isOnSale: true
  },
  {
    id: 'a7',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancelling wireless headphones',
    price: 39999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Sony+Headphones',
    brand: 'Sony',
    category: 'audio',
    isNew: true
  },
  {
    id: 'a8',
    title: 'JBL Flip 6 Portable Speaker',
    description: 'Powerful portable Bluetooth speaker with bold sound',
    price: 12999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=JBL+Speaker',
    brand: 'JBL',
    category: 'audio',
    isNew: false
  },
  // Storage category
  {
    id: 'a9',
    title: 'SanDisk 128GB Extreme microSD Card',
    description: 'High-speed storage for phones, tablets, and cameras',
    price: 2499,
    originalPrice: 2999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=SanDisk+microSD',
    brand: 'SanDisk',
    category: 'storage',
    isOnSale: true
  },
  {
    id: 'a10',
    title: 'Samsung T7 1TB Portable SSD',
    description: 'Ultra-fast external solid state drive with USB 3.2',
    price: 14999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Samsung+SSD',
    brand: 'Samsung',
    category: 'storage',
    isNew: false
  },
  // Mounts & Stands category
  {
    id: 'a11',
    title: 'PopSockets PopGrip',
    description: 'Secure grip for your phone with expandable stand',
    price: 1499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=PopSocket',
    brand: 'PopSockets',
    category: 'mounts',
    isNew: false
  },
  {
    id: 'a12',
    title: 'Twelve South BookArc Stand',
    description: 'Elegant vertical stand for MacBooks',
    price: 5999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Laptop+Stand',
    brand: 'Twelve South',
    category: 'mounts',
    isNew: true
  }
];

// Sort options
const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest First' }
];

// Category display names
const categoryNames = {
  'protection': 'Protection (Cases, Screen Protectors)',
  'power': 'Power & Charging',
  'audio': 'Audio (Headphones, Earbuds, Speakers)',
  'storage': 'Storage (Memory Cards, USB Drives)',
  'mounts': 'Mounts & Stands'
};

export default function AccessoriesPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    category: [],
    brand: []
  });
  const [activeSort, setActiveSort] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(accessoryProducts);
  const { duration, delay } = useAnimationPreference();
  
  // Get unique brands
  const brands = [...new Set(accessoryProducts.map(product => product.brand))];
  
  // Create filter groups
  const filterGroups = [
    {
      id: 'category',
      title: 'Category',
      options: Object.entries(categoryNames).map(([id, label]) => ({
        id,
        label,
        count: accessoryProducts.filter(p => p.category === id).length
      }))
    },
    {
      id: 'brand',
      title: 'Brand',
      options: brands.map(brand => ({
        id: brand,
        label: brand,
        count: accessoryProducts.filter(p => p.brand === brand).length
      }))
    }
  ];
  
  // Handle filter changes
  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    
    // Apply filters
    let result = [...accessoryProducts];
    
    // Filter by category
    if (filters.category && filters.category.length > 0) {
      result = result.filter(product => filters.category.includes(product.category));
    }
    
    // Filter by brand
    if (filters.brand && filters.brand.length > 0) {
      result = result.filter(product => filters.brand.includes(product.brand));
    }
    
    // Apply current sort
    applySorting(result, activeSort);
  };
  
  // Handle sort changes
  const handleSortChange = (sortId: string) => {
    setActiveSort(sortId);
    applySorting(filteredProducts, sortId);
  };
  
  // Apply sorting
  const applySorting = (products: typeof accessoryProducts, sortId: string) => {
    let sorted = [...products];
    
    switch (sortId) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Sort by isNew flag
        sorted = sorted.filter(p => p.isNew).concat(sorted.filter(p => !p.isNew));
        break;
      // Default is 'featured', no sorting needed
    }
    
    setFilteredProducts(sorted);
  };
  
  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn duration={duration} delay={delay}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--primary)]">Accessories</h1>
              <nav className="flex">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li className="font-medium text-[var(--primary)]">Accessories</li>
                </ol>
              </nav>
            </div>
          </FadeIn>
          
          {/* Filter and Sort System */}
          <FilterSortSystem
            filterGroups={filterGroups}
            sortOptions={sortOptions}
            initialFilters={activeFilters}
            initialSort={activeSort}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            productCount={filteredProducts.length}
          />
          
          {/* Products */}
          <div className="mt-6">
            {filteredProducts.length > 0 ? (
              <StaggeredList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    thumbnail={product.thumbnail}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    brand={product.brand}
                    isNew={product.isNew}
                    isOnSale={product.isOnSale}
                    currencyCode="EUR"
                    onAddToCart={() => console.log(`Added ${product.title} to cart`)}
                    onAddToCompare={() => console.log(`Added ${product.title} to compare`)}
                  />
                ))}
              </StaggeredList>
            ) : (
              <FadeIn duration={duration} delay={delay}>
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-500">No products match your selected filters.</p>
                  <button 
                    onClick={() => handleFilterChange({ category: [], brand: [] })}
                    className="mt-4 text-sm underline text-[var(--primary)]"
                  >
                    Reset Filters
                  </button>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </>
  )
}