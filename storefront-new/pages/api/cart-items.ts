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

  const { cartId, itemId } = req.query;

  if (!cartId) {
    return res.status(400).json({ error: 'Cart ID is required' });
  }

  if (req.method === 'POST') {
    try {
      // Add item to cart
      const { variantId, quantity } = req.body;

      if (!variantId || quantity === undefined) {
        return res.status(400).json({ error: 'Variant ID and quantity are required' });
      }

      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify({
          variant_id: variantId,
          quantity
        }),
      });

      const data = await response.json();

      // Forward cookies from Medusa response
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        res.setHeader('Set-Cookie', cookies);
      }

      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      // Update cart item
      if (!itemId) {
        return res.status(400).json({ error: 'Item ID is required' });
      }

      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({ error: 'Quantity is required' });
      }

      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      // Forward cookies from Medusa response
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        res.setHeader('Set-Cookie', cookies);
      }

      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Error updating cart item:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Remove item from cart
      if (!itemId) {
        return res.status(400).json({ error: 'Item ID is required' });
      }

      const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
      });

      const data = await response.json();

      // Forward cookies from Medusa response
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        res.setHeader('Set-Cookie', cookies);
      }

      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 