import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

/**
 * Proxy for cart-related operations
 */
export async function GET(request: NextRequest) {
  // Get the cart ID from the query parameters
  const searchParams = request.nextUrl.searchParams;
  const cartId = searchParams.get('id');
  
  if (!cartId) {
    return NextResponse.json(
      { error: 'Cart ID is required' },
      { status: 400 }
    );
  }
  
  try {
    console.log(`Getting cart with ID: ${cartId}`);
    
    // Call Medusa backend
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
      },
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Handle error response
    if (!response.ok) {
      console.error('Error fetching cart:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to fetch cart' },
        { status: response.status }
      );
    }
    
    // Set cookies from the response if any
    const setCookieHeader = response.headers.get('set-cookie');
    const headers = new Headers();
    if (setCookieHeader) {
      headers.append('Set-Cookie', setCookieHeader);
    }
    
    return NextResponse.json(data, { 
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create a new cart
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body if it exists
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      // Empty body is fine for cart creation
    }
    
    console.log('Creating new cart');
    
    // Call Medusa backend
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Handle error response
    if (!response.ok) {
      console.error('Error creating cart:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to create cart' },
        { status: response.status }
      );
    }
    
    // Set cookies from the response
    const setCookieHeader = response.headers.get('set-cookie');
    const headers = new Headers();
    if (setCookieHeader) {
      headers.append('Set-Cookie', setCookieHeader);
    }
    
    return NextResponse.json(data, { 
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Cart creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 