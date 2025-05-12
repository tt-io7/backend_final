import { NextRequest, NextResponse } from 'next/server';
import { protectRoute } from '../../lib/auth-middleware';

export async function middleware(request: NextRequest) {
  return protectRoute(request);
}

export const config = {
  matcher: '/account/:path*',
}
