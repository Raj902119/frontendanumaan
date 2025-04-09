import { NextResponse } from 'next/server';

// Mock wallet data for frontend-only deployment
const mockWalletData = {
  success: true,
  data: {
    balance: 10000,
    bonus: 500,
    total: 10500,
    currency: "INR"
  }
};

export async function GET(request: Request) {
  try {
    // For frontend-only deployment, we'll return mock data
    return NextResponse.json(mockWalletData);
  } catch (error: any) {
    console.error('Error in wallet balance API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 