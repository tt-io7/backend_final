import { NextRequest, NextResponse } from 'next/server';
import { medusaClient } from '../../../../../lib/medusa-client';

// DELETE - Delete an address for the current user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const addressId = params.id;
    console.log('Deleting address with ID:', addressId);

    // Call the Medusa API to delete the address
    try {
      await medusaClient.deleteCustomerAddress(addressId);
      console.log('Address deleted successfully');
      return NextResponse.json({ success: true });
    } catch (apiError) {
      console.error('Error deleting address from Medusa:', apiError);
      return NextResponse.json(
        { error: 'Failed to delete address', details: apiError.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
