import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { phone, name, otp } = await request.json()

    // Validate input
    if (!phone || !name || !otp) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Call backend API to verify OTP and create user
    const response = await fetch('http://localhost:5000/api/v1/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, otp, name })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to verify OTP' },
        { status: response.status }
      );
    }

    // Set cookie with the token from backend
    const cookieStore = await cookies()
    cookieStore.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return NextResponse.json({
      message: 'Account created successfully',
      user: data.user
    })
  } catch (error) {
    console.error('Error in signup:', error)
    return NextResponse.json(
      { message: 'Failed to create account' },
      { status: 500 }
    )
  }
} 