import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Registering customer with email:', email);

    try {

      // Step 1: Get registration token from auth endpoint
      console.log('Step 1: Getting registration token from Medusa...');
      const authResponse = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/emailpass/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      console.log('Auth response status:', authResponse.status);
      console.log('Auth response headers:', Object.fromEntries(authResponse.headers.entries()));

      // Check if auth response is HTML or has error
      if (!authResponse.ok) {
        const authResponseText = await authResponse.text();
        if (authResponseText.trim().startsWith('<!DOCTYPE') || authResponseText.trim().startsWith('<html')) {
          console.error('Received HTML instead of JSON from auth endpoint');
          console.error('FULL HTML RESPONSE:', authResponseText);
          return NextResponse.json(
            { error: 'Server returned HTML instead of JSON. Authentication failed.' },
            { status: 500 }
          );
        }

        try {
          const authErrorData = JSON.parse(authResponseText);
          console.error('Auth error:', authErrorData);
          return NextResponse.json(
            { error: authErrorData.message || 'Authentication failed' },
            { status: authResponse.status }
          );
        } catch (jsonError) {
          console.error('Failed to parse auth error response as JSON:', authResponseText);
          return NextResponse.json(
            { error: 'Authentication failed with invalid server response' },
            { status: 500 }
          );
        }
      }

      // Parse auth response to get token
      const authData = await authResponse.json();
      console.log('Auth response data keys:', Object.keys(authData).join(', '));

      const token = authData.token || authData.access_token;
      if (!token) {
        console.error('No token received from auth endpoint');
        return NextResponse.json(
          { error: 'Failed to obtain authentication token' },
          { status: 500 }
        );
      }

      console.log('Successfully obtained auth token');

      // Step 2: Create customer with the token
      console.log('Step 2: Creating customer with token...');
      const registrationResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': PUBLISHABLE_API_KEY
        },
        body: JSON.stringify({
          email,
          first_name: first_name || '',
          last_name: last_name || ''
        }),
      });

      // Log response details for debugging
      console.log('Registration response status:', registrationResponse.status);
      console.log('Registration response headers:', Object.fromEntries(registrationResponse.headers.entries()));

      if (!registrationResponse.ok) {
        // Check if the response is HTML instead of JSON
        const responseText = await registrationResponse.text();
        if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
          console.error('Received HTML instead of JSON from registration endpoint');
          console.error('FULL HTML RESPONSE:', responseText);

          // Log the request details for debugging
          console.error('REQUEST DETAILS:', {
            url: `${MEDUSA_BACKEND_URL}/store/customers`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'x-publishable-api-key': PUBLISHABLE_API_KEY
            },
            body: JSON.stringify({
              email,
              password,
              first_name: first_name || '',
              last_name: last_name || ''
            })
          });

          return NextResponse.json(
            { error: 'Server returned HTML instead of JSON. Registration failed.' },
            { status: 500 }
          );
        }

        // Try to parse the response as JSON
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.error('Registration token error:', errorData);
        } catch (jsonError) {
          console.error('Failed to parse error response as JSON:', responseText);
          return NextResponse.json(
            { error: 'Registration failed with invalid server response' },
            { status: 500 }
          );
        }

        // If registration fails with an identity already exists error, try to login
        if (registrationResponse.status === 401) {
          console.log('Email already exists, attempting login...');
          try {
            // Try to login with the provided credentials
            const loginResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/auth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': PUBLISHABLE_API_KEY
              },
              body: JSON.stringify({
                email,
                password,
                actor_type: 'customer',
                auth_provider: 'emailpass'
              }),
            });

            console.log('Login response status:', loginResponse.status);

            // Check if login response is HTML
            const loginResponseText = await loginResponse.text();
            if (loginResponseText.trim().startsWith('<!DOCTYPE') || loginResponseText.trim().startsWith('<html')) {
              console.error('Received HTML instead of JSON from login endpoint');
              return NextResponse.json(
                { error: 'Server returned HTML instead of JSON. Login failed.' },
                { status: 500 }
              );
            }

            // Try to parse login response
            let loginData;
            try {
              loginData = JSON.parse(loginResponseText);
            } catch (jsonError) {
              console.error('Failed to parse login response as JSON:', loginResponseText);
              return NextResponse.json(
                { error: 'Login failed with invalid server response' },
                { status: 500 }
              );
            }

            if (!loginResponse.ok) {
              console.error('Login failed after registration attempt:', loginData);
              return NextResponse.json(
                { error: 'Email already exists but credentials are invalid' },
                { status: 401 }
              );
            }

            console.log('Login successful after registration attempt');

            // We got the token, now create the customer
            const token = loginData.token || loginData.access_token;

            if (!token) {
              return NextResponse.json(
                { error: 'Authentication succeeded but no token was received' },
                { status: 500 }
              );
            }

            // Step 2: Create customer with the login token
            return await createCustomer(token, email, first_name, last_name);
          } catch (loginError) {
            console.error('Error during login fallback:', loginError);
            return NextResponse.json(
              { error: 'Failed to authenticate with existing account' },
              { status: 500 }
            );
          }
        }

        // For other registration errors
        return NextResponse.json(
          { error: errorData.message || 'Registration failed' },
          { status: registrationResponse.status }
        );
      }

      // In Medusa v2.6.1, the /store/customers endpoint creates the customer with the token
      // and returns the customer data
      const registerData = await registrationResponse.json();
      console.log('Registration response data:', registerData);

      // Extract customer from response
      const customer = registerData.customer;

      if (!customer) {
        console.error('No customer data received from registration endpoint');
        return NextResponse.json(
          { error: 'Failed to create customer account' },
          { status: 500 }
        );
      }

      // Return success response with customer data and token
      return NextResponse.json({
        customer,
        token, // Use the token we got from the auth endpoint
        success: true
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in register API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to create a customer with a token
async function createCustomer(token: string, email: string, first_name?: string, last_name?: string) {
  const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
  const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

  console.log('Creating customer with token...');
  console.log(`Making request to ${MEDUSA_BACKEND_URL}/store/customers`);

  const customerResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-publishable-api-key': PUBLISHABLE_API_KEY
    },
    body: JSON.stringify({
      email,
      first_name: first_name || '',
      last_name: last_name || '',
    }),
  });

  console.log('Customer creation response status:', customerResponse.status);
  console.log('Customer creation response headers:', Object.fromEntries(customerResponse.headers.entries()));

  if (!customerResponse.ok) {
    // Check if the response is HTML
    const responseText = await customerResponse.text();
    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
      console.error('Received HTML instead of JSON from customer creation endpoint');
      console.error('HTML response preview:', responseText.substring(0, 200));
      return NextResponse.json(
        { error: 'Server returned HTML instead of JSON. Customer creation failed.' },
        { status: 500 }
      );
    }

    // Try to parse as JSON
    try {
      const errorData = JSON.parse(responseText);
      console.error('Customer creation error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to create customer' },
        { status: customerResponse.status }
      );
    } catch (jsonError) {
      console.error('Failed to parse customer creation error as JSON:', responseText);
      return NextResponse.json(
        { error: 'Customer creation failed with invalid server response' },
        { status: 500 }
      );
    }
  }

  // Try to parse the successful response
  try {
    const responseText = await customerResponse.text();
    let customerData;

    try {
      customerData = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse customer data as JSON:', responseText);
      return NextResponse.json(
        { error: 'Customer was created but response format was invalid' },
        { status: 500 }
      );
    }

    console.log('Customer created successfully:', customerData.customer?.id || 'Unknown ID');

    // Return success response with customer data and token
    return NextResponse.json({
      customer: customerData.customer,
      token: token,
      success: true
    });
  } catch (error) {
    console.error('Error processing customer creation response:', error);
    return NextResponse.json(
      { error: 'Error processing customer creation response' },
      { status: 500 }
    );
  }
}
