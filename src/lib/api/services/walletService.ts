import apiClient from '../client';

interface DepositParams {
  amount: number;
  paymentMethod: string;
  paymentReference?: string;
}

interface TransactionQueryParams {
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

/**
 * Get wallet balance
 * @returns {Promise<any>} Wallet balance data
 */
export const getWalletBalance = async () => {
  try {
    console.log('Fetching wallet balance from API route');
    
    // Use frontend API route to avoid CORS issues
    const response = await fetch('/api/wallet/balance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    
    if (!response.ok) {
      console.error(`Wallet balance fetch failed with status: ${response.status}`);
      throw new Error(`Failed to fetch wallet balance: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Wallet balance received:', data);
    
    // Ensure the data is properly formatted for display
    const walletData = data.data || {};
    
    // Ensure all balance fields are present and are numbers
    const formattedData = {
      availableBalance: Number(walletData.availableBalance || 0),
      totalBalance: Number(walletData.totalBalance || walletData.availableBalance || 0),
      depositedAmount: Number(walletData.depositedAmount || 0),
      withdrawableAmount: Number(walletData.withdrawableAmount || walletData.availableBalance || 0),
      bonusAmount: Number(walletData.bonusAmount || 0),
      referralBonusBalance: Number(walletData.referralBonusBalance || 0)
    };
    
    console.log('Formatted wallet data:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('Error fetching wallet balance, falling back to direct API call:', error);
    
    // Fallback to direct API call
    try {
      console.log('Using fallback direct API call for wallet balance');
      const response = await apiClient.get('/v1/wallet/balance');
      const responseData = response.data.data || {};
      
      // Ensure consistent format in fallback too
      return {
        availableBalance: Number(responseData.availableBalance || 0),
        totalBalance: Number(responseData.totalBalance || responseData.availableBalance || 0),
        depositedAmount: Number(responseData.depositedAmount || 0),
        withdrawableAmount: Number(responseData.withdrawableAmount || responseData.availableBalance || 0),
        bonusAmount: Number(responseData.bonusAmount || 0),
        referralBonusBalance: Number(responseData.referralBonusBalance || 0)
      };
    } catch (fallbackError) {
      console.error('Error in fallback wallet balance fetch:', fallbackError);
      // Return default values
      return {
        availableBalance: 0,
        totalBalance: 0,
        depositedAmount: 0,
        withdrawableAmount: 0,
        bonusAmount: 0,
        referralBonusBalance: 0
      };
    }
  }
};

/**
 * Get wallet transactions
 * @param {Object} params Query parameters
 * @returns {Promise<any>} Transaction data
 */
export const getTransactions = async (params = {}) => {
  try {
    // Use v1 prefix for wallet endpoints
    const response = await apiClient.get('/v1/wallet/transactions', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

/**
 * Initiate wallet deposit
 * @param {number} amount Amount to deposit
 * @returns {Promise<any>} Deposit initiation response
 */
export const initiateDeposit = async (amount: number) => {
  try {
    const response = await apiClient.post('/v1/wallet/deposit', { amount });
    return response.data;
  } catch (error) {
    console.error('Error initiating deposit:', error);
    throw error;
  }
};

/**
 * Initiate wallet withdrawal
 * @param {number} amount Amount to withdraw
 * @param {string} upiId UPI ID for withdrawal
 * @returns {Promise<any>} Withdrawal initiation response
 */
export const initiateWithdrawal = async (amount: number, upiId: string) => {
  try {
    const response = await apiClient.post('/v1/wallet/withdraw', { amount, upiId });
    return response.data;
  } catch (error) {
    console.error('Error initiating withdrawal:', error);
    throw error;
  }
};

export const walletService = {
  getBalance: () => apiClient.get('/v1/wallet/balance'),
  getTransactions: () => apiClient.get('/v1/wallet/transactions')
};
