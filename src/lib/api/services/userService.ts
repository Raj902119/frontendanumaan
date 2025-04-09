import apiClient from '../client';
import { ProfileUpdateRequest } from '../types';

// Simple Order type definition
interface Order {
  id: string;
  status: string;
  outcome: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  wallet: {
    id: string;
    balance: number;
  };
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED';
  referralCode: string;
  totalTrades: number;
  wonTrades: number;
  lostTrades: number;
}

export interface WinRateStats {
  overallWinRate: number;
  weeklyWinRate: number;
  monthlyWinRate: number;
  categorizedWinRates: {
    [category: string]: number;
  };
}

/**
 * Get user profile data
 * @returns {Promise<any>} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/v1/users/me');
    return response.data.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Get user statistics
 * @returns {Promise<any>} User statistics data
 */
export const getUserStats = async () => {
  try {
    // Get user profile
    const profileResponse = await apiClient.get('/v1/users/me');
    const profile = profileResponse.data.data;
    
    // Get wallet balance
    const walletResponse = await apiClient.get('/v1/wallet/balance');
    const wallet = walletResponse.data.data;
    
    // Format the combined stats
    return {
      user: profile,
      wallet: wallet,
      stats: {
        availableBalance: wallet?.availableBalance || 0,
        depositedAmount: wallet?.depositedAmount || 0,
        withdrawableAmount: wallet?.withdrawableAmount || 0,
        winRate: await getWinRate()
      }
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

/**
 * Get user win rate
 * @returns {Promise<number>} Win rate percentage
 */
export const getWinRate = async (): Promise<number> => {
  try {
    console.log('Fetching win rate from API route');
    // Use frontend API route to get win rate, avoiding CORS issues
    const response = await fetch('/api/user/win-rate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    
    if (!response.ok) {
      console.error(`Win rate fetch failed with status: ${response.status}`);
      throw new Error(`Win rate fetch failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Win rate data received:', data);
    return data.data.winRate;
  } catch (error) {
    console.error('Error fetching win rate, falling back to calculating from orders:', error);
    
    // Fallback calculation from orders
    try {
      console.log('Using fallback win rate calculation from orders');
      const ordersResponse = await apiClient.get('/v1/orders');
      const orders: Order[] = ordersResponse.data.data;
      
      if (!orders || orders.length === 0) return 0;
      
      const totalOrders = orders.length;
      const winningOrders = orders.filter(order => order.status === 'COMPLETED' && order.outcome === 'WIN').length;
      
      return totalOrders > 0 ? (winningOrders / totalOrders) * 100 : 0;
    } catch (fallbackError) {
      console.error('Error in fallback win rate calculation:', fallbackError);
      return 0;
    }
  }
};

/**
 * Update user profile
 * @param {Object} data Profile data to update
 * @returns {Promise<any>} Updated profile
 */
export const updateProfile = async (data: ProfileUpdateRequest) => {
  try {
    const response = await apiClient.patch('/v1/users/profile', data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const userService = {
  getProfile: () => apiClient.get('/v1/users/profile'),
  updateProfile: (data: ProfileUpdateRequest) => apiClient.patch('/v1/users/profile', data),
  
  submitKYC: async (data: FormData) => {
    return apiClient.post('/v1/users/kyc', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getAccountStats: async () => {
    const response = await apiClient.get('/v1/users/stats');
    console.log('🔄 Raw stats response:', response.data);
    
    // Handle both possible response structures
    const statsData = response.data.data || response.data;
    
    // Ensure withdrawableAmount is included
    if (!('withdrawableAmount' in statsData)) {
      console.warn('⚠️ withdrawableAmount not found in response, fetching from wallet');
      try {
        const walletResponse = await apiClient.get('/wallet/balance');
        const walletData = walletResponse.data.data || walletResponse.data;
        statsData.withdrawableAmount = walletData.withdrawableAmount || 0;
      } catch (error) {
        console.error('❌ Failed to fetch wallet data:', error);
        statsData.withdrawableAmount = 0;
      }
    }
    
    console.log('📊 Processed stats data:', statsData);
    return { data: statsData };
  },

  getWinRateStats: () => apiClient.get('/v1/users/win-rate'),
  getStats: () => apiClient.get('/v1/users/stats'),
  
  getKYCStatus: () => apiClient.get('/v1/users/kyc/status')
};
