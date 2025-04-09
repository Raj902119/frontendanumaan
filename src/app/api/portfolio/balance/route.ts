import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get token from the request headers
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.error('Unauthorized - No token provided for portfolio balance API');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    console.log('Forwarding portfolio balance request to backend');

    // First get the user ID from the token by fetching the user profile
    try {
      const userResponse = await fetch('http://localhost:5000/api/v1/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        console.error('Failed to fetch user profile for balance request');
        return NextResponse.json(
          { success: false, message: 'Failed to fetch user profile' },
          { status: userResponse.status }
        );
      }

      const userData = await userResponse.json();
      const user = userData.data;

      // Now fetch the balance using the user ID
      const balanceResponse = await fetch(`http://localhost:5000/api/v1/wallet/balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const balanceData = await balanceResponse.json();
      console.log('Backend balance response status:', balanceResponse.status);
      
      if (!balanceResponse.ok) {
        console.error('Backend balance request failed:', {
          status: balanceResponse.status,
          message: balanceData.message || 'Unknown error'
        });
        
        return NextResponse.json(
          { 
            success: false, 
            message: balanceData.message || 'Failed to fetch balance',
            error: balanceData.error
          },
          { status: balanceResponse.status }
        );
      }

      return NextResponse.json({
        success: true,
        data: balanceData.data || balanceData
      });
    } catch (fetchError: any) {
      console.error('Failed to fetch balance from backend:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch balance from backend' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in portfolio balance API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 