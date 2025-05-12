import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

export async function POST(request: NextRequest) {
  try {
    // Note: Medusa v2.6.1 might not support token refresh
    // Return a helpful error message
    return NextResponse.json(
      {
        error: 'Token refresh not supported in Medusa v2.6.1',
        message: 'Please log in again to get a new token'
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in refresh API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}