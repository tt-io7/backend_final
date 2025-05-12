import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

export async function POST(request: NextRequest) {
  try {
    console.log('Processing logout request');
    
    // Get the cookies to pass along for authentication
    const cookies = request.cookies;
    const medusaSessionCookie = cookies.get('_medusa_session_id');
    
    // Call Medusa backend directly with the correct logout endpoint
    const response = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': medusaSessionCookie ? `_medusa_session_id=${medusaSessionCookie.value}` : '',
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      },
      credentials: 'include'
    });

    // Get any set-cookie headers to clear session
    const setCookieHeader = response.headers.get('set-cookie');
    
    if (!response.ok) {
      console.error('Logout error:', response.status, response.statusText);
      
      const nextResponse = NextResponse.json(
        { success: false, error: 'Logout failed' },
        { status: response.status }
      );
      
      // Still include cookie clearing headers if they exist
      if (setCookieHeader) {
        nextResponse.headers.set('Set-Cookie', setCookieHeader);
      }
      
      return nextResponse;
    }

    // Create success response with cookie clearing headers
    const nextResponse = NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
    if (setCookieHeader) {
      nextResponse.headers.set('Set-Cookie', setCookieHeader);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Error in logout API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
