import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

/**
 * Generic proxy handler for Medusa store API requests
 * This automatically adds the publishable API key to all requests
 */
export async function GET(request: NextRequest) {
  return handleProxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, 'DELETE');
}

export async function OPTIONS(request: NextRequest) {
  return handleProxyRequest(request, 'OPTIONS');
}

async function handleProxyRequest(request: NextRequest, method: string) {
  try {
    // Get the path from the search params
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path') || '';
    
    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }
    
    // Construct the full Medusa endpoint URL
    const medusaUrl = `${MEDUSA_BACKEND_URL}/store/${path}`;
    console.log(`Proxying ${method} request to: ${medusaUrl}`);
    
    // Get the request body if applicable
    let body = null;
    if (method !== 'GET' && method !== 'OPTIONS') {
      try {
        body = await request.json();
      } catch (e) {
        // If there's no body or it's not JSON, that's fine
      }
    }
    
    // Forward the request to Medusa with added publishable API key
    const response = await fetch(medusaUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
        // Include other headers from the original request as needed
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });
    
    // Get the response data
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Get the headers to forward
    const responseHeaders = new Headers();
    
    // Forward important headers, especially Set-Cookie
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders.append('Set-Cookie', setCookieHeader);
    }
    
    // Return the proxied response
    return contentType && contentType.includes('application/json')
      ? NextResponse.json(data, { 
          status: response.status,
          headers: responseHeaders 
        })
      : new NextResponse(data, { 
          status: response.status,
          headers: responseHeaders 
        });
  } catch (error) {
    console.error('Proxy request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 