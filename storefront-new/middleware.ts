import { NextRequest, NextResponse } from 'next/server'

// Supported countries/locales
const COUNTRIES = ['us', 'ca', 'gb', 'fr', 'de']

// Default country fallback
const DEFAULT_COUNTRY = 'us'

/**
 * Middleware to handle country code redirects and API key forwarding
 *
 * Logic:
 * 1. Skip middleware for internal routes and assets
 * 2. Add publishable API key to store requests
 * 3. Pass through requests that already have a country code
 * 4. For new visits, detect country from Accept-Language and redirect to country-code URL
 * 5. Allow regular routes to work in development for easier debugging
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is a direct request to Medusa store API or via our API proxy
  if (pathname.includes('/store/') || pathname.includes('/api/medusa/')) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers)
    
    // Add the publishable API key for Medusa requests
    if (!requestHeaders.has('x-publishable-api-key')) {
      // Use NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY to match .env.local
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c'
      requestHeaders.set('x-publishable-api-key', publishableKey)
      console.log(`Adding x-publishable-api-key header to ${pathname}`)
    }
    
    // Return modified request with added headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Check if this is an account page
  const isAccountPage = pathname.startsWith('/account') ||
    COUNTRIES.some(country => pathname.startsWith(`/${country}/account`))

  // If this is an account page, check if the user is logged in
  if (isAccountPage) {
    // Check if we have a user_email cookie
    const userEmailCookie = request.cookies.get('user_email')
    const isLoggedIn = userEmailCookie && userEmailCookie.value

    // If not logged in, redirect to login
    if (!isLoggedIn) {
      // Extract country from path if it exists
      const pathParts = pathname.split('/')
      const hasCountry = COUNTRIES.includes(pathParts[1])
      const country = hasCountry ? pathParts[1] : DEFAULT_COUNTRY

      // Create redirect URL to login page
      const redirectUrl = new URL(`/${country}/login`, request.url)

      // Add redirect parameter
      redirectUrl.searchParams.set('redirect', pathname)

      return NextResponse.redirect(redirectUrl)
    }
  }

  // Skip for special paths
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('favicon.ico') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/login') || // Skip login page
    pathname.startsWith('/register') || // Skip register page
    pathname.includes('.') // Skip for static files
  ) {
    return NextResponse.next()
  }

  // Check if the path already has a country code
  const pathnameHasCountry = COUNTRIES.some(
    (country) => pathname.startsWith(`/${country}/`) || pathname === `/${country}`
  )

  // If we already have a country in the pathname, continue
  if (pathnameHasCountry) {
    return NextResponse.next()
  }

  // Get user's preferred country from Accept-Language header
  let country = DEFAULT_COUNTRY
  const acceptLanguage = request.headers.get('accept-language')

  if (acceptLanguage) {
    // Parse the Accept-Language header
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().toLowerCase())

    // Extract country codes from language tags (e.g., 'en-US' -> 'us')
    const countryCodes = languages
      .map(lang => lang.includes('-') ? lang.split('-')[1].toLowerCase() : null)
      .filter((code): code is string => code !== null) // Type guard to filter out null values

    // Find the first matching country code
    const matchedCountry = countryCodes.find(code => COUNTRIES.includes(code))
    if (matchedCountry) {
      country = matchedCountry
    }
  }

  // Create URL with country code
  const redirectUrl = new URL(`/${country}${pathname === '/' ? '' : pathname}`, request.url)

  // Preserve query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value)
  })

  // Use a temporary redirect (307) which preserves the HTTP method
  return NextResponse.redirect(redirectUrl, 307)
}

// Configure paths the middleware runs on
export const config = {
  matcher: [
    // Include API/medusa routes and skip other internal routes
    '/api/medusa/:path*',
    '/((?!_next/static|_next/image|.*\\.).*)',
  ],
}