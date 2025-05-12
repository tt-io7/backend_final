import { NextRequest, NextResponse } from 'next/server';
import { medusaClient } from '../../../../lib/medusa-client';

// GET - Get all addresses for the current user
export async function GET(request: NextRequest) {
  try {
    // Get cookies from the request to pass to Medusa
    const cookies = request.cookies;
    const cookieString = cookies.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    // Call the Medusa API to get customer addresses
    try {
      const { addresses } = await medusaClient.getCustomerAddresses();
      return NextResponse.json({ addresses });
    } catch (apiError) {
      console.error('Error fetching addresses from Medusa:', apiError);
      return NextResponse.json(
        { error: 'Failed to fetch addresses', details: apiError.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error getting addresses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add a new address for the current user
export async function POST(request: NextRequest) {
  try {
    // Get the address data from the request
    const addressData = await request.json();
    console.log('Received address data:', addressData);

    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'address_1', 'city', 'postal_code', 'country_code'];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Call the Medusa API to add the address
    try {
      const result = await medusaClient.addCustomerAddress(addressData);
      console.log('Address added successfully:', result);
      return NextResponse.json(result);
    } catch (apiError) {
      console.error('Error adding address to Medusa:', apiError);
      return NextResponse.json(
        { error: 'Failed to add address', details: apiError.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
