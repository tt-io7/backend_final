import { notFound } from 'next/navigation'
import { fetchProductByHandle } from '@/lib/api'
import ProductDetails from '@/components/ProductDetails'
import { Product as MedusaProduct } from '@/types/product'

type ProductPageProps = {
  params: {
    handle: string
    country: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle, country } = params
  
  // Fetch the product data
  let product: MedusaProduct | null = null
  
  try {
    product = await fetchProductByHandle(handle)
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error)
    return notFound()
  }
  
  if (!product) {
    return notFound()
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <ProductDetails 
        product={product} 
        countryCode={country}
      />
    </div>
  )
} 