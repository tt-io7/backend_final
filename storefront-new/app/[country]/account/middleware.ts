import { NextRequest, NextResponse } from 'next/server';
import { protectRoute } from '../../../lib/auth-middleware';

export async function middleware(request: NextRequest) {
  // Extract the country from the URL
  const country = request.nextUrl.pathname.split('/')[1];
  return protectRoute(request, country);
}

export const config = {
  matcher: '/:country/account/:path*',
}
