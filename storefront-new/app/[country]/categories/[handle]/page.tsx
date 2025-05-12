import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { fetchProducts } from '@/lib/api'
import ProductGrid from '@/components/ProductGrid'
import { Product as MedusaProduct } from '@/types/product'

// Define the interface expected by ProductGrid
interface GridProduct {
  id: string
  title: string
  description: string
  handle: string
  thumbnail?: string
  variants: {
    id: string
    title: string
    prices: {
      amount: number
      currency_code: string
    }[]
  }[]
}

// Convert MedusaProduct to GridProduct format
function adaptProductForGrid(product: MedusaProduct): GridProduct {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    handle: product.handle,
    thumbnail: product.thumbnail,
    variants: product.variants.map(variant => ({
      id: variant.id,
      title: variant.title,
      prices: [{
        amount: variant.price.amount,
        currency_code: variant.price.currency_code
      }]
    }))
  };
}

type CategoryPageProps = {
  params: {
    handle: string
    country: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { handle, country } = params
  
  // Mock categories for UI display
  const categories = {
    phones: {
      name: 'Phones',
      description: 'Explore our collection of smartphones and mobile devices.',
      image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Phones'
    },
    accessories: {
      name: 'Accessories',
      description: 'Find the perfect accessories for all your devices.',
      image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Accessories'
    },
    software: {
      name: 'Software',
      description: 'Boost your productivity with our software solutions.',
      image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Software'
    },
    merch: {
      name: 'Merch',
      description: 'Show your support with our branded merchandise.',
      image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Merch'
    }
  }
  
  const category = categories[handle as keyof typeof categories]
  
  if (!category) {
    return notFound()
  }
  
  // Fetch products by category
  let products: MedusaProduct[] = []
  
  try {
    products = await fetchProducts({
      filters: { category_id: [handle] }
    })
  } catch (error) {
    console.error(`Error fetching products for category ${handle}:`, error)
  }
  
  // Convert to the format expected by ProductGrid
  const gridProducts = products.map(adaptProductForGrid)
  
  // Mock filter groups for UI
  const filterGroups = [
    {
      name: 'Price',
      options: [
        { value: 'under-100', label: 'Under $100' },
        { value: '100-200', label: '$100 - $200' },
        { value: '200-500', label: '$200 - $500' },
        { value: 'over-500', label: 'Over $500' }
      ]
    },
    {
      name: 'Color',
      options: [
        { value: 'black', label: 'Black' },
        { value: 'white', label: 'White' },
        { value: 'blue', label: 'Blue' },
        { value: 'red', label: 'Red' }
      ]
    }
  ]
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category hero */}
      <div className="relative overflow-hidden rounded-lg mb-8">
        <div className="h-64 md:h-80">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary-dark/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="text-white max-w-2xl px-6 md:px-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-lg md:text-xl">{category.description}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-lg p-6 bg-white">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            
            <div className="space-y-6">
              {filterGroups.map((group) => (
                <div key={group.name}>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">{group.name}</h3>
                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${group.name.toLowerCase()}-${option.value}`}
                          name={`filter-${group.name.toLowerCase()}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`filter-${group.name.toLowerCase()}-${option.value}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md text-sm font-medium transition-colors">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              {products.length} Products
            </h2>
            
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm text-gray-700 mr-2">Sort:</label>
              <select
                id="sort"
                className="text-sm border-gray-300 rounded-md py-1 pl-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {products.length > 0 ? (
            <ProductGrid products={gridProducts} />
          ) : (
            <div className="text-center py-16 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or check back later.</p>
              <Link
                href={`/${country}/products`}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 