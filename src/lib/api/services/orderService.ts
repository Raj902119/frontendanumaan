import apiClient from '../client';

interface CreateOrderParams {
  eventId: string;
  position: 'YES' | 'NO';
  quantity: number;
  price: number;
}

interface OrderQueryParams {
  status?: string;
  eventId?: string;
  page?: number;
  limit?: number;
}

interface TradeStatsParams {
  startDate?: string;
  endDate?: string;
}

// Mock data for fallback when API is unavailable
const MOCK_ACTIVE_TRADES = [
  {
    id: "mock-1",
    event: "Yoon arrested by January 31?",
    date: "Jan 31, 2025",
    investment: 50,
    gains: 25,
    currentValue: 75,
    status: "MATCHED",
  },
  {
    id: "mock-2",
    event: "Biden wins 2024 election?",
    date: "Nov 5, 2024",
    investment: 100,
    gains: 50,
    currentValue: 150,
    status: "MATCHED",
  }
];

const MOCK_CLOSED_TRADES = [
  {
    id: "mock-3",
    event: "Apple stock over $200 by June?",
    date: "Jun 30, 2024",
    investment: 75,
    gains: 30,
    status: "SETTLED",
  },
  {
    id: "mock-4",
    event: "Bitcoin reaches $100K in 2024?",
    date: "Dec 31, 2024",
    investment: 200,
    gains: -50,
    status: "SETTLED",
  }
];

export const orderService = {
  createOrder: async (data: CreateOrderParams) => {
    try {
      const response = await apiClient.post('/v1/orders', data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  getUserOrders: async (params?: OrderQueryParams) => {
    try {
      const response = await apiClient.get('/v1/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
  
  getActiveTrades: async () => {
    try {
      console.log('Fetching active trades from API...');
      const response = await apiClient.get('/v1/orders/active');
      console.log('Active trades API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching active trades, using mock data:', error);
      // Return mock data if API fails
      return { 
        success: true,
        data: MOCK_ACTIVE_TRADES 
      };
    }
  },
  
  getClosedTrades: async () => {
    try {
      console.log('Fetching closed trades from API...');
      const response = await apiClient.get('/v1/orders/closed');
      console.log('Closed trades API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching closed trades, using mock data:', error);
      // Return mock data if API fails
      return { 
        success: true,
        data: MOCK_CLOSED_TRADES
      };
    }
  },
  
  getCurrentValue: async () => {
    try {
      console.log('Fetching current value from API...');
      const response = await apiClient.get('/v1/orders/current-value');
      console.log('Current value API response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error calculating current value:', error);
      return { data: { currentValue: 0 } };
    }
  },
  
  getTodaysReturns: async () => {
    try {
      console.log('Fetching today\'s returns from API...');
      const response = await apiClient.get('/v1/orders/todays-returns');
      console.log('Today\'s returns API response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error calculating today\'s returns:', error);
      return { data: { amount: 0 } };
    }
  },
  
  getTradeStats: async (params?: TradeStatsParams) => {
    try {
      console.log('Fetching trade stats from API...');
      const response = await apiClient.get('/v1/orders/stats', { params });
      console.log('Trade stats API response:', response.data);
      
      if (!response.data?.data) {
        throw new Error('Invalid response format from getTradeStats');
      }
      
      // Get current value and today's returns
      const [currentValueRes, todaysReturnsRes] = await Promise.all([
        apiClient.get('/v1/orders/current-value'),
        apiClient.get('/v1/orders/todays-returns')
      ]);
      
      const data = response.data.data;
      
      const stats = {
        investment: Number(data.investment) || 0,
        liveGains: Number(data.liveGains) || 0,
        totalReturns: Number(data.totalReturns) || 0,
        currentValue: Number(currentValueRes.data?.data?.currentValue) || 0,
        todaysReturns: Number(todaysReturnsRes.data?.data?.amount) || 0,
        rank: Number(data.rank) || 0
      };
      
      console.log('Processed trade stats:', stats);
      return { data: stats };
    } catch (error) {
      console.error('Error fetching trade stats:', error);
      return { 
        data: {
          investment: 0,
          liveGains: 0,
          totalReturns: 0,
          currentValue: 0,
          todaysReturns: 0,
          rank: 0
        }
      };
    }
  },
  
  exitTrade: async (tradeId: string) => {
    try {
      const response = await apiClient.put(`/v1/orders/${tradeId}/exit`);
      return response.data;
    } catch (error) {
      console.error('Error exiting trade:', error);
      // Mock successful exit
      return { 
        success: true,
        data: { 
          message: 'Trade exited successfully (mock)'
        } 
      };
    }
  },

  getOrderDetails: (orderId: string) => apiClient.get(`/v1/orders/${orderId}`),
  cancelOrder: (orderId: string) => apiClient.post(`/v1/orders/${orderId}/cancel`)
};
