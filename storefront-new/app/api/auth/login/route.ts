import { NextRequest, NextResponse } from 'next/server';

// Initialize environment variables
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

export async function POST(request: NextRequest) {
  console.log('Processing login request with direct API call');

  try {
    const body = await request.json();
    const { email, password } = body;

    console.log(`Attempting login for email: ${email}`);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Call Medusa backend directly with the correct endpoint for v2.6.1
      const response = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/emailpass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      // Handle error response
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error("Login API error:", errorData);

          if (response.status === 401) {
            return NextResponse.json(
              { error: "Invalid email or password" },
              { status: 401 }
            );
          }

          return NextResponse.json(
            { error: errorData.message || "Login failed" },
            { status: response.status }
          );
        } catch (parseError) {
          console.error("Error parsing login error response:", parseError);
          return NextResponse.json(
            { error: `Login failed with status ${response.status}` },
            { status: response.status }
          );
        }
      }

      // Get the response data
      const data = await response.json();
      console.log('Login response data keys:', Object.keys(data).join(', '));

      // Extract the token
      const token = data.token || data.access_token;

      if (!token) {
        console.error('No token in login response');
        return NextResponse.json(
          { error: 'Authentication succeeded but no token was received' },
          { status: 500 }
        );
      }

      // Now fetch the customer data using the token
      const customerResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
      });

      if (!customerResponse.ok) {
        console.error('Failed to fetch customer data after login');
        // Return just the token if we can't get customer data
        return NextResponse.json(
          { token: token },
          { status: 200 }
        );
      }

      const customerData = await customerResponse.json();

      // Return success with customer data and token
      return NextResponse.json({
        customer: customerData.customer,
        token: token,
        success: true
      });
    } catch (error: any) {
      console.error("Login error:", error);
      return NextResponse.json(
        { error: error.message || "Login failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login request processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
