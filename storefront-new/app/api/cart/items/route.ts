import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

/**
 * Add an item to the cart
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { cartId, variantId, quantity } = body;
    
    if (!cartId || !variantId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart ID, variant ID, and quantity are required' },
        { status: 400 }
      );
    }
    
    console.log(`Adding item to cart ${cartId}: ${variantId} x ${quantity}`);
    
    // Call Medusa backend
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
      },
      body: JSON.stringify({ 
        variant_id: variantId, 
        quantity: quantity 
      }),
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Handle error response
    if (!response.ok) {
      console.error('Error adding item to cart:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to add item to cart' },
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
    console.error('Cart item add error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update cart item quantity
 */
export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { cartId, itemId, quantity } = body;
    
    if (!cartId || !itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart ID, item ID, and quantity are required' },
        { status: 400 }
      );
    }
    
    console.log(`Updating item ${itemId} in cart ${cartId} to quantity: ${quantity}`);
    
    // Call Medusa backend
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
      },
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Handle error response
    if (!response.ok) {
      console.error('Error updating cart item:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to update cart item' },
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
    console.error('Cart item update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete an item from the cart
 */
export async function DELETE(request: NextRequest) {
  // Get cart_id and item_id from query parameters
  const url = new URL(request.url);
  const cartId = url.searchParams.get('cartId');
  const itemId = url.searchParams.get('itemId');
  
  if (!cartId || !itemId) {
    return NextResponse.json(
      { error: 'Cart ID and item ID are required' },
      { status: 400 }
    );
  }
  
  try {
    console.log(`Removing item ${itemId} from cart ${cartId}`);
    
    // Call Medusa backend
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
      method: 'DELETE',
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
      console.error('Error removing cart item:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to remove cart item' },
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
    console.error('Cart item removal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 