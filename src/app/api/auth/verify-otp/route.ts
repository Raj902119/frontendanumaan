import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone, otp, name, referralCode } = await request.json();

    // Validate input
    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Forward to backend API with v1 prefix
    const response = await fetch('http://localhost:5000/api/v1/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, otp, name, referralCode }),
    });

    const data = await response.json();

    // Return response from backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in verify-otp API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 