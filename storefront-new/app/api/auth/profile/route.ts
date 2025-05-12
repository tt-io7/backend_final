import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching customer profile');
    
    // Get cookies from the request for authentication
    const cookies = request.cookies;
    const medusaSessionCookie = cookies.get('_medusa_session_id');
    
    if (!medusaSessionCookie?.value) {
      return NextResponse.json(
        { customer: null, message: "Not authenticated" },
        { status: 200 }
      );
    }
    
    try {
      // Call Medusa backend to get customer info
      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `_medusa_session_id=${medusaSessionCookie.value}`,
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        return NextResponse.json(
          { customer: null, message: "Failed to fetch profile" },
          { status: 200 }
        );
      }
      
      const data = await response.json();
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