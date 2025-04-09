import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    // Validate input
    if (!phone) {
      console.error('Missing required field: phone');
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    console.log('Resending OTP for phone:', phone);

    // Call backend API to resend OTP with correct port and v1 prefix
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        console.error('Backend resend OTP failed:', {
          status: response.status,
          message: data.message || 'Unknown error'
        });
        
        return NextResponse.json(
          { success: false, message: data.message || 'Failed to resend OTP' },
          { status: response.status }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: data.message || 'OTP resent successfully'
      });
    } catch (fetchError: any) {
      console.error('Error fetching backend API:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to connect to authentication service' },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('Error in resend-otp route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 