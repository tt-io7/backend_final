import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
// Removed Header and Footer imports as they are in layout.tsx
import ProductCard from '../components/ProductCard' // Adjusted path if necessary
import { ProductGrid } from '../components/product'
import { getFeaturedProducts, fetchNewArrivals } from '@/lib/api'
import NewsletterForm from '../components/NewsletterForm'

// Define Product type to match what the components expect
interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string;
  variants: {
    id: string;
    title: string;
    prices: {
      amount: number;
      currency_code: string;
    }[];
  }[];
}

// Define Medusa API product type (or import from your types folder)
interface MedusaProduct {
  id: string;
  title: string;
  description?: string;
  handle: string;
  thumbnail?: string;
  variants?: Array<{
    id?: string;
    title?: string;
    prices?: Array<{
      amount: number;
      currency_code: string;
    }>;
    price?: {
      amount: number;
      currency_code: string;
    };
  }>;
}

// Sample featured products data (Using data from storefront/app/page.tsx)
const featuredProducts = [
  {
    id: 'p1',
    title: 'Samsung Galaxy S23 Ultra',
    description: 'The ultimate smartphone experience with an advanced camera system',
    price: 119999,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Samsung+Galaxy', // Updated placeholder color
    brand: 'Samsung',
    isNew: true,
    handle: 'samsung-galaxy-s23-ultra', // Added handle
    variants: [{ id: 'var_s23_1', title: 'Samsung Galaxy S23 Ultra - 256GB - Black', prices: [{ amount: 119999, currency_code: 'usd' }] }] // Added variants
  },
  {
    id: 'p2',
    title: 'iPhone 15 Pro Max',
    description: "Apple's most powerful iPhone with A17 Pro chip",
    price: 129900,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=iPhone+15', // Updated placeholder color
    brand: 'Apple',
    isNew: true,
    handle: 'iphone-15-pro-max', // Added handle
    variants: [{ id: 'var_iphone_1', title: 'iPhone 15 Pro Max - 256GB - Black', prices: [{ amount: 129900, currency_code: 'usd' }] }] // Added variants
  },
  {
    id: 'p3',
    title: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancelling wireless headphones',
    price: 39999,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Sony+Headphones', // Updated placeholder color
    brand: 'Sony',
    isNew: false,
    handle: 'sony-wh-1000xm5', // Added handle
    variants: [{ id: 'var_sony_1', title: 'Sony WH-1000XM5 - Black', prices: [{ amount: 39999, currency_code: 'usd' }] }] // Added variants
  },
  {
    id: 'p4',
    title: 'Google Pixel 8 Pro',
    description: "Google's flagship phone with advanced AI capabilities",
    price: 99900,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Google+Pixel', // Updated placeholder color
    brand: 'Google',
    isNew: true,
    handle: 'google-pixel-8-pro', // Added handle
    variants: [{ id: 'var_pixel_1', title: 'Google Pixel 8 Pro - 256GB - Black', prices: [{ amount: 99900, currency_code: 'usd' }] }] // Added variants
  }
];

// Sample new arrivals data
const newArrivals = [
  {
    id: 'n1',
    title: 'Anker 20,000mAh Power Bank',
    description: 'Fast charging portable battery with USB-C Power Delivery',
    price: 4999,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Power+Bank', // Updated placeholder color
    brand: 'Anker',
    handle: 'anker-power-bank', // Added handle
    variants: [{ id: 'var_anker_1', title: 'Anker 20,000mAh Power Bank - Black', prices: [{ amount: 4999, currency_code: 'usd' }] }] // Added variants
  },
  {
    id: 'n2',
    title: 'Microsoft 365 Personal',
    description: '1-year subscription for premium Office apps',
    price: 6999,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Microsoft+365', // Updated placeholder color
    brand: 'Microsoft',
    handle: 'microsoft-365-personal', // Added handle
    variants: [{ id: 'var_ms365_1', title: 'Microsoft 365 Personal - 1 Year', prices: [{ amount: 6999, currency_code: 'usd' }] }] // Added variants
  },
  {
    id: 'n3',
    title: 'AndMore Premium Pen Set',
    description: 'Elegant writing instruments with the AndMore logo',
    price: 1999,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Premium+Pen', // Updated placeholder color
    brand: 'AndMore',
    handle: 'andmore-premium-pen-set', // Added handle
    variants: [{ id: 'var_pen_1', title: 'AndMore Premium Pen Set - Black', prices: [{ amount: 1999, currency_code: 'usd' }] }] // Added variants
  }
];

// Sample deals data
const deals = [
  {
    id: 'd1',
    title: 'Samsung Galaxy A54',
    description: 'Mid-range smartphone with premium features',
    price: 39999,
    originalPrice: 44999,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=Galaxy+A54', // Updated placeholder color
    brand: 'Samsung',
    isOnSale: true,
    handle: 'samsung-galaxy-a54', // Added handle
    variants: [{ id: 'var_a54_1', title: 'Samsung Galaxy A54 - 128GB - Black', prices: [{ amount: 39999, currency_code: 'usd' }] }] // Added variants
  },
  {
    id: 'd2',
    title: 'Apple AirPods Pro (2nd Gen)',
    description: 'Active noise cancellation earbuds with spatial audio',
    price: 19900,
    originalPrice: 24900,
    thumbnail: 'https://placehold.co/500x500/9370DB/FFFFFF?text=AirPods+Pro', // Updated placeholder color
    brand: 'Apple',
    isOnSale: true,
    handle: 'apple-airpods-pro-2nd-gen', // Added handle
    variants: [{ id: 'var_airpods_1', title: 'Apple AirPods Pro (2nd Gen)', prices: [{ amount: 19900, currency_code: 'usd' }] }] // Added variants
  }
];

// Sample featured brands
const featuredBrands = [
  { name: 'Samsung', logo: 'https://placehold.co/200x100/FFFFFF/9370DB?text=Samsung' }, // Updated placeholder color
  { name: 'Apple', logo: 'https://placehold.co/200x100/FFFFFF/9370DB?text=Apple' }, // Updated placeholder color
  { name: 'Google', logo: 'https://placehold.co/200x100/FFFFFF/9370DB?text=Google' }, // Updated placeholder color
  { name: 'Sony', logo: 'https://placehold.co/200x100/FFFFFF/9370DB?text=Sony' } // Updated placeholder color
];

// Sample categories
const categories = [
  {
    name: 'Smartphones',
    slug: 'smartphones',
    count: 24,
    image: 'https://placehold.co/800x600/9370DB/FFFFFF?text=Smartphones',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    count: 18,
    image: 'https://placehold.co/800x600/7B68EE/FFFFFF?text=Laptops',
    color: 'from-primary to-primary-dark',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: 42,
    image: 'https://placehold.co/800x600/D4AF37/FFFFFF?text=Accessories',
    color: 'from-secondary to-secondary-dark',
  },
]

export const metadata = {
  title: 'AndMore - Premium Tech Products',
  description: 'Shop the latest tech gadgets and accessories at AndMore',
}

export default function Home() {
  // Redirect to the default country route
  redirect('/us')
}
