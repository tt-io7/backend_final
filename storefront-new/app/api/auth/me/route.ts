import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching customer profile');
    
    // Get cookies from the request for authentication
    const cookies = request.cookies;
    const medusaSessionCookie = cookies.get('_medusa_session_id');
    
    // Get authorization header (if any)
    const authHeader = request.headers.get('authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
      console.log('Token found in authorization header');
    }
    
    // Check localStorage token in cookies as fallback
    const localStorageToken = cookies.get('medusa_access_token');
    if (!token && localStorageToken?.value) {
      token = localStorageToken.value;
      console.log('Token found in cookie storage');
    }
    
    // Headers for Medusa API request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_API_KEY,
    };
    
    // Add session cookie if available
    if (medusaSessionCookie?.value) {
      headers['Cookie'] = `_medusa_session_id=${medusaSessionCookie.value}`;
      console.log('Session cookie found and added to request');
    }
    
    // Add token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Token added to request:', token.substring(0, 10) + '...');
    }
    
    // If no authentication, return early
    if (!medusaSessionCookie?.value && !token) {
      console.log('No authentication found - will return null customer');
      return NextResponse.json(
        { customer: null, message: "Not authenticated" },
        { status: 200 }
      );
    }
    
    try {
      // Call Medusa backend to get customer info
      console.log('Making request to Medusa API with publishable key:', PUBLISHABLE_API_KEY.substring(0, 10) + '...');
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      
      // Log response headers and status
      console.log('Profile API response status:', response.status);
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log('Profile API response headers:', responseHeaders);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching profile:', errorText);
        
        return NextResponse.json(
          { customer: null, message: "Failed to fetch profile" },
          { status: 200 }
        );
      }
      
      const data = await response.json();
      console.log('Profile data received:', data.customer ? 'Customer found' : 'No customer data');
      
      return NextResponse.json({ customer: data.customer }, { status: 200 });
      
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      return NextResponse.json(
        { customer: null, message: error.message || "Failed to fetch profile" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Profile request processing error:", error);
    return NextResponse.json(
      { customer: null, message: "Internal server error" },
      { status: 200 }
    );
  }
}
