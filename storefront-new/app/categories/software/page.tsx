'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductCard from '../../../components/ProductCard'
import FilterSortSystem from '../../../components/FilterSortSystem'
import FadeIn from '../../../components/transitions/FadeIn'
import StaggeredList from '../../../components/transitions/StaggeredList'
import { useAnimationPreference } from '../../../components/transitions/useAnimationPreference'

// Sample software products
const softwareProducts = [
  // Operating Systems
  {
    id: 's1',
    title: 'Windows 11 Pro',
    description: 'Full license key for Microsoft Windows 11 Professional',
    price: 19999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Windows+11',
    brand: 'Microsoft',
    category: 'os',
    isNew: true
  },
  {
    id: 's2',
    title: 'macOS Ventura Upgrade',
    description: 'Digital upgrade code for compatible Mac computers',
    price: 2999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=macOS+Ventura',
    brand: 'Apple',
    category: 'os',
    isNew: false
  },
  // Office & Productivity
  {
    id: 's3',
    title: 'Microsoft 365 Personal',
    description: '1-year subscription for premium Office apps',
    price: 6999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Microsoft+365',
    brand: 'Microsoft',
    category: 'productivity',
    isNew: false
  },
  {
    id: 's4',
    title: 'Microsoft 365 Family',
    description: '1-year subscription for up to 6 people',
    price: 9999,
    originalPrice: 12999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Microsoft+365+Family',
    brand: 'Microsoft',
    category: 'productivity',
    isOnSale: true
  },
  {
    id: 's5',
    title: 'Adobe Creative Cloud',
    description: 'Complete creative suite with Photoshop, Illustrator, and more',
    price: 59999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Adobe+CC',
    brand: 'Adobe',
    category: 'productivity',
    isNew: true
  },
  // Security & Antivirus
  {
    id: 's6',
    title: 'Norton 360 Deluxe',
    description: 'Comprehensive protection for up to 5 devices',
    price: 3999,
    originalPrice: 4999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Norton+360',
    brand: 'Norton',
    category: 'security',
    isOnSale: true
  },
  {
    id: 's7',
    title: 'Bitdefender Total Security',
    description: 'Advanced threat protection for Windows, macOS, iOS and Android',
    price: 4499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Bitdefender',
    brand: 'Bitdefender',
    category: 'security',
    isNew: false
  },
  {
    id: 's8',
    title: 'McAfee Total Protection',
    description: 'Antivirus, identity and privacy protection for all your devices',
    price: 3499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=McAfee',
    brand: 'McAfee',
    category: 'security',
    isNew: false
  },
  // Gaming & Entertainment
  {
    id: 's9',
    title: 'Xbox Game Pass Ultimate',
    description: '3-month subscription with access to 100+ games',
    price: 3999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Xbox+Game+Pass',
    brand: 'Microsoft',
    category: 'gaming',
    isNew: true
  },
  {
    id: 's10',
    title: 'PlayStation Plus Premium',
    description: '12-month subscription with game catalog and cloud streaming',
    price: 12999,
    originalPrice: 14999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=PS+Plus',
    brand: 'Sony',
    category: 'gaming',
    isOnSale: true
  },
  {
    id: 's11',
    title: 'Steam Gift Card',
    description: '$50 digital code for Steam games and software',
    price: 5000,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Steam+Card',
    brand: 'Valve',
    category: 'gaming',
    isNew: false
  },
  {
    id: 's12',
    title: 'Netflix Gift Card',
    description: '3-month standard subscription digital code',
    price: 3999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Netflix+Card',
    brand: 'Netflix',
    category: 'entertainment',
    isNew: false
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
  'os': 'Operating Systems',
  'productivity': 'Office & Productivity',
  'security': 'Security & Antivirus',
  'gaming': 'Gaming',
  'entertainment': 'Entertainment'
};

export default function SoftwarePage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    category: [],
    brand: []
  });
  const [activeSort, setActiveSort] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(softwareProducts);
  const { duration, delay } = useAnimationPreference();
  
  // Get unique brands
  const brands = [...new Set(softwareProducts.map(product => product.brand))];
  
  // Create filter groups
  const filterGroups = [
    {
      id: 'category',
      title: 'Category',
      options: Object.entries(categoryNames).map(([id, label]) => ({
        id,
        label,
        count: softwareProducts.filter(p => p.category === id).length
      }))
    },
    {
      id: 'brand',
      title: 'Brand',
      options: brands.map(brand => ({
        id: brand,
        label: brand,
        count: softwareProducts.filter(p => p.brand === brand).length
      }))
    }
  ];
  
  // Handle filter changes
  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    
    // Apply filters
    let result = [...softwareProducts];
    
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
  const applySorting = (products: typeof softwareProducts, sortId: string) => {
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
              <h1 className="text-3xl font-bold text-[var(--primary)]">Software</h1>
              <nav className="flex">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li className="font-medium text-[var(--primary)]">Software</li>
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