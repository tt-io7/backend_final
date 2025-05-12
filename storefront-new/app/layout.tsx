import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import './output.css' // Import the compiled CSS first
import './essential.css' // Backup CSS in case Tailwind fails
import './browser-compatibility.css' // Re-enable browser compatibility CSS
import { WishlistProvider } from '../hooks/use-wishlist'
import { StoreProvider } from '../context/store-context'
import { ErrorProvider } from '../context/error-context'
import { CartContextProvider } from '../context/cart-context'
import { AuthProvider } from '../lib/context/auth-context'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ClientOnly from '../components/ClientOnly'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'AndMore - Premium Tech Products',
    template: '%s | AndMore',
  },
  description: 'Shop the latest tech gadgets and accessories at AndMore',
  keywords: ['tech', 'gadgets', 'electronics', 'e-commerce', 'accessories'],
  authors: [{ name: 'AndMore Team' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://andmore.example.com',
    siteName: 'AndMore',
    title: 'AndMore - Premium Tech Products',
    description: 'Shop the latest tech gadgets and accessories at AndMore',
    images: [{ url: '/images/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AndMore - Premium Tech Products',
    description: 'Shop the latest tech gadgets and accessories at AndMore',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        {/* Add viewport meta tag for proper responsive behavior */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

        {/* Add Chrome-specific meta tags for better rendering */}
        <meta name="theme-color" content="#9370DB" />
        <meta name="color-scheme" content="light" />

        {/* Force Chrome to use hardware acceleration */}
        <style>{`
          body {
            -webkit-transform: translateZ(0);
            -moz-transform: translateZ(0);
            -ms-transform: translateZ(0);
            -o-transform: translateZ(0);
            transform: translateZ(0);
          }
        `}</style>

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href={inter.style.fontFamily.split(',')[0].replace(/["']/g, '')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen selection:bg-primary/20 selection:text-primary-dark">
        <ClientOnly>
          <ErrorBoundary>
            <ErrorProvider>
              <AuthProvider>
                <StoreProvider>
                  <CartContextProvider>
                    <WishlistProvider>
                      <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-grow pt-20 w-full">
                          {children}
                        </main>
                        <Footer />
                      </div>
                    </WishlistProvider>
                  </CartContextProvider>
                </StoreProvider>
              </AuthProvider>
            </ErrorProvider>
          </ErrorBoundary>
        </ClientOnly>
      </body>
    </html>
  )
}
