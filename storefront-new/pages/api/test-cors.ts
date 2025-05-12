import type { NextApiRequest, NextApiResponse } from 'next'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie, Set-Cookie, x-publishable-api-key'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test direct connection to Medusa
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
      },
    });

    const responseData = await response.json();
    
    // Create cart as another test
    const cartResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
      },
    });

    const cartData = await cartResponse.json();

    return res.status(200).json({
      success: true,
      productRequestSuccess: response.ok,
      productStatus: response.status,
      productStatusText: response.statusText,
      productData: responseData,
      cartRequestSuccess: cartResponse.ok,
      cartStatus: cartResponse.status,
      cartData: cartData,
      publishableKey: PUBLISHABLE_API_KEY,
    });
  } catch (error) {
    console.error('CORS test error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      publishableKey: PUBLISHABLE_API_KEY,
    });
  }
} 