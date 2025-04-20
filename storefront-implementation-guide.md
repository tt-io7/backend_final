# AndMore Tech Storefront Implementation Guide

This guide provides detailed instructions for implementing the redesign plan for the AndMore Tech storefront. Follow these steps in Code mode to transform the current luxury clothing store into a tech-focused e-commerce platform.

## Phase 1: Core Structure & Branding

### Step 1: Update layout.tsx

Update the metadata and title to reflect the new tech focus:

```tsx
// storefront/app/layout.tsx
export const metadata: Metadata = {
  title: "AndMore Tech - Mobile Devices, Accessories & More",
  description: "Premium tech products and accessories from trusted brands",
};
```

### Step 2: Update globals.css

Add the new color scheme:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #1E3A8A;    /* Deep blue */
  --primary-light: #3B82F6;
  --primary-dark: #1E40AF;
  --secondary: #D4AF37;  /* Gold */
  --secondary-light: #FFD700;
  --secondary-dark: #B8860B;
  --tertiary: #F3F4F6;   /* Light gray */
}
```

Add button animations:

```css
.btn-primary {
  @apply bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] hover:scale-105 active:scale-95;
}

.btn-secondary {
  @apply bg-[var(--secondary)] text-white hover:bg-[var(--secondary-dark)] hover:scale-105 active:scale-95;
}
```

### Step 3: Update Header Component

Replace "Luxury Store" with "AndMoreTech" and update the navigation categories:

```tsx
const categories = [
  { name: 'Phones', href: '/categories/phones' },
  { name: 'Accessories', href: '/categories/accessories' },
  { name: 'Software', href: '/categories/software' },
  { name: 'Merch', href: '/categories/merch' },
  { name: 'Deals', href: '/deals', highlight: true }
]
```

Add gold accents to the logo:

```tsx
<Link href="/" className="text-2xl font-bold text-[var(--primary)]">
  AndMore<span className="text-[var(--secondary)]">Tech</span>
</Link>
```

### Step 4: Update Footer Component

Reorganize the footer with the new sitemap structure:

```tsx
const footerLinks = {
  'Shop By Category': [
    { name: 'Phones', href: '/categories/phones' },
    { name: 'Accessories', href: '/categories/accessories' },
    { name: 'Software', href: '/categories/software' },
    { name: 'Merch', href: '/categories/merch' },
    { name: 'Deals', href: '/deals' }
  ],
  'Customer Service': [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Policy', href: '/shipping' },
    { name: 'Return Policy', href: '/returns' },
    { name: 'Privacy Policy', href: '/privacy' }
  ],
  'Company Info': [
    { name: 'About AndMore', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' }
  ]
}
```

## Phase 2: Homepage Redesign

### Step 1: Update Homepage (page.tsx)

Create sample data for tech products:

```tsx
// Sample featured products data
const featuredProducts = [
  {
    id: 'p1',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'The ultimate smartphone experience with an advanced camera system',
    price: 119999,
    thumbnail: 'https://images.unsplash.com/photo-1678911820864-e5f41b4c18bf?q=80&w=500',
    brand: 'Samsung',
    isNew: true
  },
  // More products...
];
```

Add a hero section with tech focus:

```tsx
<section className="py-16 md:py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--primary)]">
          Tech That <span className="text-[var(--secondary)]">Empowers</span> You
        </h1>
        <p className="text-xl mb-8 text-gray-700">
          Discover premium tech products from trusted brands at AndMore Tech.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/categories/phones" className="btn btn-primary">
            Shop Phones
          </Link>
          <Link href="/deals" className="btn btn-secondary">
            View Deals
          </Link>
        </div>
      </div>
      <div className="md:w-1/2 relative animate-slide-up">
        {/* Featured product image */}
      </div>
    </div>
  </div>
</section>
```

Add featured brands section:

```tsx
<section className="py-12 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[var(--primary)]">
      Featured Brands
    </h2>
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
      {/* Samsung, Apple, Google, Sony logos */}
    </div>
  </div>
</section>
```

Add New Arrivals section:

```tsx
<section className="py-12 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
        New Arrivals
      </h2>
      <Link href="/new-arrivals" className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium">
        View all →
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* New arrival product cards */}
    </div>
  </div>
</section>
```

## Phase 3: Product Pages & Components

### Step 1: Update ProductCard Component

Enhance the product card with tech-specific features:

```tsx
export default function ProductCard({ 
  id, 
  title, 
  description, 
  thumbnail, 
  price, 
  brand,
  isNew,
  currencyCode = 'EUR',
  onAddToCart 
}: ProductCardProps) {
  // Component implementation
  return (
    <div className="card group">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Image 
          src={thumbnail} 
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {isNew && (
          <div className="absolute top-2 left-2 bg-[var(--primary)] text-white text-xs px-2 py-1 rounded">
            NEW
          </div>
        )}
        {brand && (
          <div className="absolute top-2 right-2 bg-white/80 text-[var(--primary)] text-xs px-2 py-1 rounded">
            {brand}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/products/${id}`} className="hover:text-[var(--primary)] transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-[var(--secondary)]">{formatPrice(price, currencyCode)}</span>
          <button 
            className="btn-primary text-sm"
            onClick={onAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Phase 4: Category Pages

Create category pages for each tech category:

### Phones Category Page

```tsx
// storefront/app/categories/phones/page.tsx
'use client'

import { useState } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ProductCard from '../../../components/ProductCard'

// Sample phone products
const phoneProducts = [
  // Android phones
  {
    id: 'p1',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'The ultimate smartphone experience with an advanced camera system',
    price: 119999,
    thumbnail: 'https://images.unsplash.com/photo-1678911820864-e5f41b4c18bf?q=80&w=500',
    brand: 'Samsung',
    category: 'android'
  },
  {
    id: 'p2',
    title: 'Google Pixel 8 Pro',
    description: 'Google's flagship phone with advanced AI capabilities',
    price: 99900,
    thumbnail: 'https://images.unsplash.com/photo-1696446702183-be9a2c1299c9?q=80&w=500',
    brand: 'Google',
    category: 'android'
  },
  // iOS phones
  {
    id: 'p3',
    title: 'iPhone 15 Pro Max',
    description: 'Apple's most powerful iPhone with A17 Pro chip',
    price: 129900,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484bce71?q=80&w=500',
    brand: 'Apple',
    category: 'ios'
  },
  {
    id: 'p4',
    title: 'iPhone 15',
    description: 'The latest iPhone with amazing camera and all-day battery life',
    price: 89900,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484bce71?q=80&w=500',
    brand: 'Apple',
    category: 'ios'
  }
];

export default function PhonesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  // Filter products based on selected filters
  const filteredProducts = phoneProducts.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedBrand && product.brand !== selectedBrand) return false;
    return true;
  });
  
  // Get unique brands
  const brands = [...new Set(phoneProducts.map(product => product.brand))];
  
  return (
    <>
      <Header />
      <div className="bg-[var(--tertiary)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-8">Phones</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="mr-2"
                    />
                    <span>All Phones</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'android'}
                      onChange={() => setSelectedCategory('android')}
                      className="mr-2"
                    />
                    <span>Android Phones</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'ios'}
                      onChange={() => setSelectedCategory('ios')}
                      className="mr-2"
                    />
                    <span>iOS Phones (iPhone)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Brand</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === null}
                      onChange={() => setSelectedBrand(null)}
                      className="mr-2"
                    />
                    <span>All Brands</span>
                  </label>
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="mr-2"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    thumbnail={product.thumbnail}
                    price={product.price}
                    currencyCode="EUR"
                    onAddToCart={() => console.log(`Added ${product.title} to cart`)}
                  />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-500">No products match your selected filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
```

## Next Steps

After implementing these core changes, proceed with:

1. Creating similar category pages for Accessories, Software, and Merch
2. Implementing the Deals page with special offers
3. Creating detailed product pages with specifications
4. Adding animations and transitions throughout the site
5. Testing on different devices to ensure responsiveness

Switch to Code mode to implement these changes and transform the storefront into a tech-focused e-commerce platform.
