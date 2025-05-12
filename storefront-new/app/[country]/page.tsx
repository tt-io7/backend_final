import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProducts, fetchNewArrivals } from '@/lib/api'
import NewsletterForm from '../../components/NewsletterForm'
import { Product as MedusaProduct } from '../../types/product'
import ProductGrid from '../../components/ProductGrid'

// Import types and sample data from the original page
import { metadata as rootMetadata } from '../page'

export const metadata = {
  ...rootMetadata
}

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

type CountryPageProps = {
  params: {
    country: string;
  };
};

export default async function CountryHomePage({ params }: CountryPageProps) {
  // Get the country code from the params
  const { country } = params;
  
  // These would typically fetch from your Medusa backend
  let apiProducts: MedusaProduct[] = [];
  let apiNewArrivals: MedusaProduct[] = [];
  
  try {
    apiProducts = await getFeaturedProducts();
    apiNewArrivals = await fetchNewArrivals();
  } catch (error) {
    console.error('Error fetching products from API:', error);
    // We'll use the fallback data if we can't fetch from API
  }
  
  // Convert the products to the format expected by ProductGrid
  const gridProducts: GridProduct[] = apiProducts.map(adaptProductForGrid);
  const newArrivalsGrid: GridProduct[] = apiNewArrivals.map(adaptProductForGrid);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white">
        {/* Background decoration */}
        <div className="absolute inset-x-0 bottom-0">
          <svg
            className="w-full h-32 text-white"
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 25C240 75 480 100 720 75C960 50 1200 0 1440 0V100H0V25Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl">
                <span className="block">The latest</span>
                <span className="block text-primary">tech for everyone</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl">
                Shop the newest gadgets and accessories at AndMore. Quality products, exceptional service, and fast shipping to {country.toUpperCase()}.
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/${country}/products`}
                  className="px-8 py-3 rounded-md shadow bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href={`/${country}/categories`}
                  className="px-8 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 relative">
              <Image
                src="https://placehold.co/800x600/9370DB/FFFFFF?text=Premium+Tech"
                alt="Featured tech products"
                width={800}
                height={600}
                className="rounded-lg shadow-lg object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                <p className="text-sm font-medium text-gray-900">New arrivals weekly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Featured Products</h2>
          <Link
            href={`/${country}/collections/featured`}
            className="text-primary hover:text-primary-dark transition-colors font-medium"
          >
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <ProductGrid products={gridProducts} />
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">New Arrivals</h2>
          <Link
            href={`/${country}/products?sort=newest`}
            className="text-primary hover:text-primary-dark transition-colors font-medium"
          >
            View All <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <ProductGrid products={newArrivalsGrid} />
      </section>

      {/* Newsletter */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Stay updated
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Subscribe to our newsletter to get the latest updates on new products, exclusive deals, and tech tips.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 