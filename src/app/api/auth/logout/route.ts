import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get token from header or cookie
    const authHeader = request.headers.get('Authorization');
    let token = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    // Forward to backend API with v1 prefix
    const response = await fetch('http://localhost:5000/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    const data = await response.json();
    
    // Clear cookies
    const nextResponse = NextResponse.json(data, { status: response.status });
    nextResponse.cookies.delete('accessToken');
    nextResponse.cookies.delete('refreshToken');
    
    return nextResponse;
  } catch (error) {
    console.error('Error in logout API route:', error);
    
    // Even if backend call fails, clear cookies and return success
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    
    return response;
  }
} 