import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '../../../lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const portfolio = await prisma.portfolio.findMany({
      where: { userId: user.id },
      select: {
        symbol: true,
        quantity: true,
        avgPrice: true,
      },
    });

    return NextResponse.json({
      balance: user.balance,
      portfolio,
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { message: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}
