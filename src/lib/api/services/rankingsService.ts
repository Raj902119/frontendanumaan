import apiClient from '../client';

// Mock data for rankings (only used as fallback)
const mockRankingsData = [
  { id: 1, name: "Rajesh Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh", score: 1250, netProfitLoss: 12500 },
  { id: 2, name: "Priya Singh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", score: 980, netProfitLoss: 9800 },
  { id: 3, name: "Vikram Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", score: 870, netProfitLoss: 8700 },
  { id: 4, name: "Ananya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya", score: 820, netProfitLoss: 8200 },
  { id: 5, name: "Suresh Reddy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh", score: 750, netProfitLoss: 7500 },
  { id: 6, name: "Meera Joshi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera", score: 720, netProfitLoss: 7200 },
  { id: 7, name: "Arun Gupta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arun", score: 680, netProfitLoss: 6800 },
  { id: 8, name: "Kavita Verma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita", score: 650, netProfitLoss: 6500 },
  { id: 9, name: "Deepak Choudhary", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak", score: 620, netProfitLoss: 6200 },
  { id: 10, name: "Neha Mishra", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha", score: 590, netProfitLoss: 5900 },
  { id: 11, name: "Amit Kumar", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit", score: 550, netProfitLoss: 5500 },
  { id: 12, name: "Sonia Gupta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sonia", score: 520, netProfitLoss: 5200 },
  { id: 13, name: "Rahul Verma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", score: 490, netProfitLoss: 4900 },
  { id: 14, name: "Kiran Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiran", score: 460, netProfitLoss: 4600 },
  { id: 15, name: "Vijay Singh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay", score: 430, netProfitLoss: 4300 }
];

const rankingsService = {
  /**
   * Get top players ranked by net profit/loss and createdAt
   */
  getTopPlayers: async (limit: number = 10) => {
    try {
      // Try to get data from API with timeout to avoid long wait
      const response = await apiClient.get(`/rankings/top?limit=${limit}&sort=netProfitLoss`, {
        timeout: 5000 // 5 second timeout
      });
      
      // If successful, return the API data
      return response;
    } catch (error) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for rankings (API failed or not available)');
      }
      
      // Sort by netProfitLoss (highest first) and take top 'limit' entries
      const sortedData = [...mockRankingsData]
        .sort((a, b) => {
          // First sort by netProfitLoss (descending)
          if (b.netProfitLoss !== a.netProfitLoss) {
            return b.netProfitLoss - a.netProfitLoss;
          }
          // If netProfitLoss is equal, use ID as a proxy for creation date (ascending)
          return a.id as number - (b.id as number); 
        })
        .slice(0, limit);
      
      return {
        data: sortedData
      };
    }
  }
};

export default rankingsService; 