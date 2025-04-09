import { cookies } from 'next/headers'
// We'll still import verify but won't actually verify tokens
import { verify } from 'jsonwebtoken'

// Mock user for frontend-only deployment
const mockUser = {
  id: 'mock-user-id',
  phone: '9999999999',
  name: 'Demo User',
  balance: 10000,
  createdAt: new Date(),
  updatedAt: new Date()
};

export async function getUserFromToken(request: Request) {
  // For frontend-only deployment, we'll return a mock user
  // without actually verifying JWT tokens
  return mockUser;
} 