import { fetchProducts } from '../../../lib/api'
import { ProductGrid } from '../../../components/product'
import { FilterSortSystem } from '../../../components'
import { Metadata } from 'next'

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params
  const title = handle === 'all' 
    ? 'All Products' 
    : `${handle.charAt(0).toUpperCase() + handle.slice(1)} Collection`

  return {
    title: `${title} | AndMore`,
    description: `Shop our ${title.toLowerCase()} collection at AndMore.`,
  }
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = params
  
  // Fetch products for the given collection
  // In a real app, you would filter by collection handle
  const products = await fetchProducts()
  
  // Get collection name
  const collectionName = handle === 'all' 
    ? 'All Products' 
    : `${handle.charAt(0).toUpperCase() + handle.slice(1)}`

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-6">
          {collectionName}
        </h1>
        
        {/* Filtering and sorting controls */}
        <div className="mb-8">
          <FilterSortSystem />
        </div>
        
        {/* Product grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900">No products found</h2>
            <p className="mt-2 text-gray-500">
              Try adjusting your filters or check back later for new arrivals.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 