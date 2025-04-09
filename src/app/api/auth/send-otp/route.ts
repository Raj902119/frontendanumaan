import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { phone, name, referralCode } = await request.json()

    // Validate input
    if (!phone) {
      console.error('Missing required field: phone')
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Format phone number for consistency (remove non-numeric characters)
    const formattedPhone = phone.replace(/\D/g, '')

    console.log('Sending OTP for:', { 
      phone: formattedPhone, 
      name: name ? 'Provided' : 'Not provided', 
      referralCode: referralCode ? 'Provided' : 'Not provided' 
    })

    // Send OTP request to backend API with v1 prefix
    const response = await fetch('http://localhost:5000/api/v1/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, name, referralCode }),
    })

    const data = await response.json()

    // Return response from backend
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Error in send-otp API route:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 