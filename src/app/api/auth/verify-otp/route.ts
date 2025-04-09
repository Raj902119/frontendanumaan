import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // For frontend-only deployment, we'll return mock authentication data
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      data: {
        token: 'mock-jwt-token-for-frontend-display',
        refreshToken: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          phone: '9999999999',
          name: 'Demo User'
        }
      }
    });
  } catch (error) {
    console.error('Error in verify-otp API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 