import { NextRequest, NextResponse } from 'next/server';
import { medusaClient } from '../../../../../../lib/medusa-client';

// POST - Set an address as default for the current user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const addressId = params.id;
    console.log('Setting address as default with ID:', addressId);
    
    // Call the Medusa API to set the address as default
    try {
      const result = await medusaClient.setDefaultCustomerAddress(addressId);
      console.log('Address set as default successfully');
      return NextResponse.json(result);
    } catch (apiError) {
      console.error('Error setting address as default in Medusa:', apiError);
      return NextResponse.json(
        { error: 'Failed to set address as default', details: apiError.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error setting address as default:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
