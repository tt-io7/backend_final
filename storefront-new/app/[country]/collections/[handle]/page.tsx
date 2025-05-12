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

type CollectionPageProps = {
  params: {
    handle: string
    country: string
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { handle, country } = params
  
  // Mock collections for UI display
  const collections = {
    featured: {
      name: 'Featured Products',
      description: 'Our handpicked selection of standout products.',
      image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Featured'
    },
    new: {
      name: 'New Arrivals',
      description: 'The latest products to join our catalog.',
      image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=New+Arrivals'
    },
    bestsellers: {
      name: 'Bestsellers',
      description: 'Our most popular products loved by customers.',
      image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Bestsellers'
    },
    sale: {
      name: 'On Sale',
      description: 'Limited time offers and special discounts.',
      image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Sale'
    }
  }
  
  const collection = collections[handle as keyof typeof collections]
  
  if (!collection) {
    return notFound()
  }
  
  // Fetch products by collection
  let products: MedusaProduct[] = []
  
  try {
    products = await fetchProducts({
      filters: { collection_id: [handle] }
    })
  } catch (error) {
    console.error(`Error fetching products for collection ${handle}:`, error)
  }
  
  // Convert to the format expected by ProductGrid
  const gridProducts = products.map(adaptProductForGrid)
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Collection hero */}
      <div className="relative overflow-hidden rounded-lg mb-12">
        <div className="h-80 md:h-96">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary-dark/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="text-white max-w-2xl px-6 md:px-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{collection.name}</h1>
            <p className="text-lg md:text-xl">{collection.description}</p>
          </div>
        </div>
      </div>
      
      {/* Product count and sorting */}
      <div className="flex items-center justify-between mb-8">
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
      
      {/* Product grid */}
      {products.length > 0 ? (
        <ProductGrid products={gridProducts} />
      ) : (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Check back later for updates to this collection.</p>
          <Link
            href={`/${country}/products`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
          >
            View All Products
          </Link>
        </div>
      )}
      
      {/* Related collections */}
      {handle !== 'featured' && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(collections)
              .filter(([key]) => key !== handle)
              .slice(0, 3)
              .map(([key, coll]) => (
                <Link 
                  key={key} 
                  href={`/${country}/collections/${key}`}
                  className="group relative rounded-lg overflow-hidden"
                >
                  <div className="aspect-w-3 aspect-h-2">
                    <Image
                      src={coll.image}
                      alt={coll.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{coll.name}</h3>
                    <p className="text-sm text-white/80">{coll.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  )
} 