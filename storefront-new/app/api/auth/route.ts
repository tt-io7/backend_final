import { NextRequest, NextResponse } from 'next/server';

// This is a simple proxy to forward authentication requests to Medusa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Determine the endpoint based on the action
    let endpoint = '';
    if (action === 'login') {
      endpoint = '/customers/token';
    } else if (action === 'register') {
      endpoint = '/customers';
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Forward the request to Medusa
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

    // Prepare request body based on action
    const requestBody = action === 'register'
      ? {
          first_name: body.firstName,
          last_name: body.lastName,
          email,
          password,
          phone: body.phone || undefined
        }
      : {
          email,
          password,
        };

    console.log(`Sending ${action} request to Medusa:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${medusaUrl}/store${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include',
    });

    // Get the response data
    const data = await response.json();

    // If the response is not ok, return the error
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Authentication failed' },
        { status: response.status }
      );
    }

    // Set cookies from the response
    const cookies = response.headers.getSetCookie();
    const responseHeaders = new Headers();

    if (cookies && cookies.length > 0) {
      for (const cookie of cookies) {
        responseHeaders.append('Set-Cookie', cookie);
      }
    }

    // Return the response with the cookies
    return NextResponse.json(data, {
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
