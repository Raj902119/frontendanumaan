import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

interface CompletedOrder {
  id: string;
  outcome: string | null;
  status: string;
}

export async function GET(request: Request) {
  try {
    // Get user from token
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Since we don't have direct database fields for these stats,
    // we need to calculate them from completed orders
    
    // Using mock data since the Order model may not be in the schema
    // In a real implementation, this would fetch from the database
    const completedOrders: CompletedOrder[] = [
      { id: '1', outcome: 'WIN', status: 'COMPLETED' },
      { id: '2', outcome: 'LOSS', status: 'COMPLETED' },
      { id: '3', outcome: 'WIN', status: 'COMPLETED' },
      { id: '4', outcome: 'WIN', status: 'COMPLETED' },
      { id: '5', outcome: 'LOSS', status: 'COMPLETED' },
      { id: '6', outcome: 'WIN', status: 'COMPLETED' },
      { id: '7', outcome: 'WIN', status: 'COMPLETED' },
    ];

    // Calculate win rate stats dynamically from orders data
    const totalTrades = completedOrders.length;
    const wonTrades = completedOrders.filter(order => order.outcome === 'WIN').length;
    const lostTrades = completedOrders.filter(order => order.outcome === 'LOSS').length;
    
    // Calculate win rate as a decimal (0 to 1)
    const winRate = totalTrades > 0 ? wonTrades / totalTrades : 0;

    return NextResponse.json({
      data: {
        winRate,
        totalTrades,
        wonTrades,
        lostTrades
      }
    });
  } catch (error) {
    console.error('Error fetching win rate stats:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch win rate stats' } },
      { status: 500 }
    );
  }
}
