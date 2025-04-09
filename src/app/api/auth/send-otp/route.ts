import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // For frontend-only deployment, we'll return success response
    // without actually sending OTP
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully (mock)'
    })
  } catch (error: any) {
    console.error('Error in send-otp API route:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 