'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductCard from '../../../components/ProductCard'
import FilterSortSystem from '../../../components/FilterSortSystem'
import FadeIn from '../../../components/transitions/FadeIn'
import StaggeredList from '../../../components/transitions/StaggeredList'
import { useAnimationPreference } from '../../../components/transitions/useAnimationPreference'

// Sample merch products
const merchProducts = [
  // Drinkware
  {
    id: 'm1',
    title: 'AndMore Branded Coffee Mug',
    description: 'Premium ceramic mug with AndMore Tech logo',
    price: 1499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Coffee+Mug',
    brand: 'AndMore',
    category: 'drinkware',
    isNew: true
  },
  {
    id: 'm2',
    title: 'Stainless Steel Tumbler',
    description: 'Double-walled insulated tumbler with AndMore Tech logo',
    price: 2499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Tumbler',
    brand: 'AndMore',
    category: 'drinkware',
    isNew: false
  },
  {
    id: 'm3',
    title: 'Glass Water Bottle',
    description: 'Eco-friendly glass bottle with silicone sleeve',
    price: 1999,
    originalPrice: 2499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Water+Bottle',
    brand: 'AndMore',
    category: 'drinkware',
    isOnSale: true
  },
  // Writing Instruments
  {
    id: 'm4',
    title: 'Premium Metal Pen Set',
    description: 'Elegant writing instruments with the AndMore logo',
    price: 1999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Pen+Set',
    brand: 'AndMore',
    category: 'writing',
    isNew: false
  },
  {
    id: 'm5',
    title: 'Stylus Pen Combo',
    description: 'Dual-function pen with touchscreen stylus tip',
    price: 1299,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Stylus+Pen',
    brand: 'AndMore',
    category: 'writing',
    isNew: true
  },
  // Apparel
  {
    id: 'm6',
    title: 'AndMore Logo T-Shirt',
    description: 'Soft cotton t-shirt with AndMore Tech logo',
    price: 2499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=T-Shirt',
    brand: 'AndMore',
    category: 'apparel',
    isNew: false
  },
  {
    id: 'm7',
    title: 'Tech Enthusiast Hoodie',
    description: 'Comfortable hoodie with tech-inspired design',
    price: 4999,
    originalPrice: 5999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Hoodie',
    brand: 'AndMore',
    category: 'apparel',
    isOnSale: true
  },
  {
    id: 'm8',
    title: 'Embroidered Cap',
    description: 'Adjustable cap with embroidered AndMore logo',
    price: 1999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Cap',
    brand: 'AndMore',
    category: 'apparel',
    isNew: false
  },
  // Office Supplies
  {
    id: 'm9',
    title: 'Tech-themed Notebook',
    description: 'Premium notebook with circuit board design cover',
    price: 1499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Notebook',
    brand: 'AndMore',
    category: 'office',
    isNew: true
  },
  {
    id: 'm10',
    title: 'Wireless Charging Mouse Pad',
    description: 'Mouse pad with built-in Qi wireless charging',
    price: 2999,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Mouse+Pad',
    brand: 'AndMore',
    category: 'office',
    isNew: true
  },
  {
    id: 'm11',
    title: 'Tech Sticker Pack',
    description: 'Set of 10 tech-themed vinyl stickers',
    price: 999,
    originalPrice: 1299,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Stickers',
    brand: 'AndMore',
    category: 'office',
    isOnSale: true
  },
  {
    id: 'm12',
    title: 'Cable Organizer Set',
    description: 'Keep your cables tidy with this organizer set',
    price: 1499,
    thumbnail: 'https://placehold.co/500x500/1E3A8A/FFFFFF?text=Cable+Organizer',
    brand: 'AndMore',
    category: 'office',
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
  'drinkware': 'Drinkware (Mugs, Tumblers)',
  'writing': 'Writing Instruments',
  'apparel': 'Apparel (T-Shirts, Caps)',
  'office': 'Office Supplies'
};

// Product status options
const statusOptions = [
  { id: 'new', label: 'New Arrivals' },
  { id: 'sale', label: 'On Sale' }
];

export default function MerchPage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    category: [],
    status: []
  });
  const [activeSort, setActiveSort] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(merchProducts);
  const { duration, delay } = useAnimationPreference();
  
  // Create filter groups
  const filterGroups = [
    {
      id: 'category',
      title: 'Category',
      options: Object.entries(categoryNames).map(([id, label]) => ({
        id,
        label,
        count: merchProducts.filter(p => p.category === id).length
      }))
    },
    {
      id: 'status',
      title: 'Product Status',
      options: statusOptions.map(option => ({
        id: option.id,
        label: option.label,
        count: option.id === 'new' 
          ? merchProducts.filter(p => p.isNew).length
          : merchProducts.filter(p => p.isOnSale).length
      }))
    }
  ];
  
  // Handle filter changes
  const handleFilterChange = (filters: Record<string, string[]>) => {
    setActiveFilters(filters);
    
    // Apply filters
    let result = [...merchProducts];
    
    // Filter by category
    if (filters.category && filters.category.length > 0) {
      result = result.filter(product => filters.category.includes(product.category));
    }
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      result = result.filter(product => {
        if (filters.status.includes('new') && product.isNew) return true;
        if (filters.status.includes('sale') && product.isOnSale) return true;
        return false;
      });
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
  const applySorting = (products: typeof merchProducts, sortId: string) => {
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
              <h1 className="text-3xl font-bold text-[var(--primary)]">Merchandise</h1>
              <nav className="flex">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                  <li className="font-medium text-[var(--primary)]">Merch</li>
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
                    onClick={() => handleFilterChange({ category: [], status: [] })}
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