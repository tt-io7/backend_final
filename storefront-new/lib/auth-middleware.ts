import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to protect routes that require authentication
 * @param request The incoming request
 * @param country The country code from the URL
 * @returns NextResponse with redirect if not authenticated
 */
export async function protectRoute(request: NextRequest, country?: string): Promise<NextResponse | null> {
  // Check if we have a cookie that indicates we're using a mock customer
  const mockCookie = request.cookies.get('mock_customer');
  const hasMockCookie = mockCookie?.value === 'true';
  
  // If we don't have a mock cookie, check with the API
  if (!hasMockCookie) {
    try {
      // Get all cookies to pass to the API
      const cookies = request.cookies;
      const cookieString = cookies.getAll()
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
      
      // Check if the user is authenticated
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/customers/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-publishable-api-key': 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c',
          'Cookie': cookieString
        },
        credentials: 'include'
      });
      
      // If the user is authenticated, allow access
      if (response.ok) {
        const data = await response.json();
        if (data.customer) {
          return null; // Allow access
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  } else {
    // If we have a mock cookie, allow access
    return null; // Allow access
  }
  
  // If we get here, the user is not authenticated, redirect to login
  const baseUrl = request.nextUrl.clone();
  baseUrl.pathname = country ? `/${country}/login` : '/login';
  
  // Add a redirect parameter to return to the original page after login
  baseUrl.searchParams.set('redirect', request.nextUrl.pathname);
  
  return NextResponse.redirect(baseUrl);
}
