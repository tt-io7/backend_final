'use client'

import { useState } from 'react'
import ProductCard from '../../../components/ProductCard'
import FilterSortSystem from '../../../components/FilterSortSystem'
import Link from 'next/link'
import FadeIn from '../../../components/transitions/FadeIn'
import StaggeredList from '../../../components/transitions/StaggeredList'
import { useAnimationPreference } from '../../../components/transitions/useAnimationPreference'

// Sample phone products
const phoneProducts = [
  // Android phones
  {
    id: 'p1',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'The ultimate smartphone experience with an advanced camera system',
    price: 119999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Galaxy+S23+Ultra',
    brand: 'Samsung',
    category: 'android',
    isNew: true
  },
  {
    id: 'p2',
    title: 'Google Pixel 8 Pro',
    description: "Google's flagship phone with advanced AI capabilities",
    price: 99900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Pixel+8+Pro',
    brand: 'Google',
    category: 'android',
    isNew: true
  },
  {
    id: 'p5',
    title: 'Samsung Galaxy A54',
    description: 'Mid-range smartphone with premium features',
    price: 39999,
    originalPrice: 44999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Galaxy+A54',
    brand: 'Samsung',
    category: 'android',
    isOnSale: true
  },
  {
    id: 'p7',
    title: 'OnePlus 12',
    description: 'Flagship performance with Hasselblad camera system',
    price: 89900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=OnePlus+12',
    brand: 'OnePlus',
    category: 'android',
    isNew: true
  },
  {
    id: 'p8',
    title: 'Xiaomi 14 Pro',
    description: 'Premium smartphone with Leica optics',
    price: 79900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Xiaomi+14+Pro',
    brand: 'Xiaomi',
    category: 'android',
    isNew: false
  },
  // iOS phones
  {
    id: 'p3',
    title: 'iPhone 15 Pro Max',
    description: "Apple's most powerful iPhone with A17 Pro chip",
    price: 129900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=iPhone+15+Pro+Max',
    brand: 'Apple',
    category: 'ios',
    isNew: true
  },
  {
    id: 'p4',
    title: 'iPhone 15',
    description: 'The latest iPhone with amazing camera and all-day battery life',
    price: 89900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=iPhone+15',
    brand: 'Apple',
    category: 'ios',
    isNew: true
  },
  {
    id: 'p6',
    title: 'iPhone 14',
    description: 'Powerful performance with a great camera system',
    price: 69900,
    originalPrice: 79900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=iPhone+14',
    brand: 'Apple',
    category: 'ios',
    isOnSale: true
  },
  {
    id: 'p9',
    title: 'iPhone SE (2022)',
    description: 'Affordable iPhone with A15 Bionic chip',
    price: 49900,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=iPhone+SE',
    brand: 'Apple',
    category: 'ios',
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
  'android': 'Android Phones',
  'ios': 'iOS Phones (iPhone)'
};

// Features (for additional filtering)
const features = [
  { id: '5g', label: '5G Compatible' },
  { id: 'wireless-charging', label: 'Wireless Charging' },
  { id: 'water-resistant', label: 'Water Resistant' }
];

export default function PhonesPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    category: [],
    brand: [],
    features: []
  });
  const [activeSort, setActiveSort] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(phoneProducts);
  const { duration, delay } = useAnimationPreference();
  
  // Get unique brands
  const brands = [...new Set(phoneProducts.map(product => product.brand))];
  
  // Create filter groups
  const filterGroups = [
    {
      id: 'category',
      title: 'Category',
      options: Object.entries(categoryNames).map(([id, label]) => ({
        id,
        label,
        count: phoneProducts.filter(p => p.category === id).length
      }))
    },
    {
      id: 'brand',
      title: 'Brand',
      options: brands.map(brand => ({
        id: brand,
        label: brand,
        count: phoneProducts.filter(p => p.brand === brand).length
      }))
    },
    {
      id: 'features',
      title: 'Features',
      options: features.map(feature => ({
        id: feature.id,
        label: feature.label,
        // In a real app, you would count products with each feature
        count: Math.floor(Math.random() * phoneProducts.length) + 1
      }))
    }
  ];
  
  // Handle filter changes
  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    
    // Apply filters
    let result = [...phoneProducts];
    
    // Filter by category
    if (filters.category && filters.category.length > 0) {
      result = result.filter(product => filters.category.includes(product.category));
    }
    
    // Filter by brand
    if (filters.brand && filters.brand.length > 0) {
      result = result.filter(product => filters.brand.includes(product.brand));
    }
    
    // In a real app, you would filter by features here
    // For now, we'll just simulate it by not filtering
    
    // Apply current sort
    applySorting(result, activeSort);
  };
  
  // Handle sort changes
  const handleSortChange = (sortId: string) => {
    setActiveSort(sortId);
    applySorting(filteredProducts, sortId);
  };
  
  // Apply sorting
  const applySorting = (products: typeof phoneProducts, sortId: string) => {
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
              <h1 className="text-3xl font-bold text-[var(--primary)]">Phones</h1>
              <nav className="flex">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li className="font-medium text-[var(--primary)]">Phones</li>
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
                    onClick={() => handleFilterChange({ category: [], brand: [], features: [] })}
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