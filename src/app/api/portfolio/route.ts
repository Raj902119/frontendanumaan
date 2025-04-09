import { NextResponse } from 'next/server';
// We're still importing prisma but it's now a mock implementation
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '../../../lib/auth';

// Mock portfolio data for frontend-only deployment
const mockPortfolioData = {
  balance: 10000,
  portfolio: [
    { symbol: "NIFTY", quantity: 5, avgPrice: 22100.50 },
    { symbol: "BANKNIFTY", quantity: 2, avgPrice: 46250.75 },
    { symbol: "RELIANCE", quantity: 10, avgPrice: 2456.30 }
  ]
};

export async function GET(request: Request) {
  try {
    // For frontend-only deployment, we'll skip authentication
    // and return mock data
    return NextResponse.json(mockPortfolioData);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { message: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}
