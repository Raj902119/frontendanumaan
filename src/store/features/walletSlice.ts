import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { AxiosError } from 'axios';
import { RootState } from '../index';

interface Transaction {
  id: string;
  transactionId: string;
  userId: string;
  type: string; // DEPOSIT, WITHDRAWAL, BONUS, REFUND, SETTLEMENT
  amount: number;
  method: string; // UPI, BANK_TRANSFER, etc.
  status: string; // PENDING, COMPLETED, FAILED, CANCELED
  description?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

interface WalletBalance {
  totalBalance: number;
  availableBalance: number;
  depositedAmount: number;
  withdrawableAmount: number;
  bonusAmount: number;
  pendingAmount?: number;
  currentValue?: number;
  netProfitLoss: number;
}

interface DepositPayload {
  amount: number;
  method: string;
  reference?: string;
}

interface WithdrawalPayload {
  amount: number;
  method: string;
  accountNumber?: string;
  ifsc?: string;
  upiId?: string;
}

interface WalletState {
  balance: WalletBalance | null;
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  recentTransactions: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: WalletState = {
  balance: null,
  transactions: [],
  pendingTransactions: [],
  recentTransactions: [],
  currentTransaction: null,
  loading: false,
  error: null,
  successMessage: null
};

// Helper function to get balance from auth state
const getBalanceFromAuth = (getState: () => RootState): Partial<WalletBalance> => {
  const state = getState();
  const auth = state.auth;
  const user = auth.user;
  
  if (!user) return {};
  
  // Get all available values from user object
  const balanceData: Partial<WalletBalance> = {
    totalBalance: user.totalBalance || 0,
    availableBalance: user.availableBalance || 0,
  };
  
  // Add any additional fields that might be available on the user object
  // Need to check and convert to number to avoid type errors
  if ('withdrawableAmount' in user && typeof user.withdrawableAmount === 'number') {
    balanceData.withdrawableAmount = user.withdrawableAmount;
  }
  
  if ('bonusAmount' in user && typeof user.bonusAmount === 'number') {
    balanceData.bonusAmount = user.bonusAmount;
  }
  
  if ('netProfitLoss' in user && typeof user.netProfitLoss === 'number') {
    balanceData.netProfitLoss = user.netProfitLoss;
  }
  
  if ('depositedAmount' in user && typeof user.depositedAmount === 'number') {
    balanceData.depositedAmount = user.depositedAmount;
  }
  
  return balanceData;
};

// Async thunks
export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('Fetching wallet balance...');
      const response = await api.get('/v1/wallet/balance');
      console.log('Wallet balance response:', response.data);
      
      // Make sure all necessary fields are present and properly formatted
      const walletData = response.data.data || {};
      
      const formattedBalance = {
        totalBalance: Number(walletData.totalBalance || 0),
        availableBalance: Number(walletData.availableBalance || 0),
        depositedAmount: Number(walletData.depositedAmount || 0),
        withdrawableAmount: Number(walletData.withdrawableAmount || 0),
        bonusAmount: Number(walletData.bonusAmount || 0),
        pendingAmount: Number(walletData.pendingAmount || 0),
        currentValue: Number(walletData.currentValue || 0),
        netProfitLoss: Number(walletData.netProfitLoss || 0)
      };
      
      console.log('Formatted wallet balance:', formattedBalance);
      return formattedBalance;
    } catch (error: any) {
      console.error('Error fetching wallet balance:', error);
      
      // Try to get user data from auth state as fallback
      try {
        const state = getState() as RootState;
        const user = state.auth.user;
        
        if (user?.wallet) {
          console.log('Using wallet data from auth state as fallback');
          return {
            totalBalance: Number(user.wallet.totalBalance || 0),
            availableBalance: Number(user.wallet.availableBalance || 0),
            depositedAmount: Number(user.wallet.depositedAmount || 0),
            withdrawableAmount: Number(user.wallet.withdrawableAmount || 0),
            bonusAmount: Number(user.wallet.bonusAmount || 0),
            currentValue: Number(user.wallet.totalBalance || 0),
            netProfitLoss: 0
          };
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch wallet balance');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      // Use v1 prefix for wallet endpoints
      const response = await api.get('/v1/wallet/transactions');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPendingTransactions = createAsyncThunk(
  'wallet/fetchPendingTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet/transactions/pending');
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch pending transactions');
    }
  }
);

export const initiateDeposit = createAsyncThunk(
  'wallet/initiateDeposit',
  async (depositData: DepositPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/wallet/deposit', depositData);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to initiate deposit');
    }
  }
);

export const initiateWithdrawal = createAsyncThunk(
  'wallet/initiateWithdrawal',
  async (withdrawalData: WithdrawalPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/wallet/withdraw', withdrawalData);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to initiate withdrawal');
    }
  }
);

export const verifyTransaction = createAsyncThunk(
  'wallet/verifyTransaction',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/wallet/transactions/${transactionId}/verify`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to verify transaction');
    }
  }
);

export const calculateWalletBalance = createAsyncThunk(
  'wallet/calculateBalance',
  async (_, { rejectWithValue }) => {
    try {
      // Use exact path that matches the backend route
      const response = await api.post('/wallet/calculate');
      console.log('🧮 Wallet calculation API response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
      
      if (response.data && response.data.data) {
        console.log('✅ Using wallet calculation data:', response.data.data);
        return response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        console.log('✅ Using wallet calculation data (direct object):', response.data);
        return response.data;
      }
      
      console.warn('⚠️ No data found in wallet calculation response');
      return null;
    } catch (error) {
      console.error('❌ Error calculating wallet balance:', error);
      const axiosError = error as AxiosError;
      
      // Try the alternative API path with /api prefix if it fails
      try {
        console.log('🔄 Retrying calculation with alternative API path');
        const altResponse = await api.post('/api/wallet/calculate');
        if (altResponse.data && altResponse.data.data) {
          console.log('✅ Alternative path calculation successful:', altResponse.data.data);
          return altResponse.data.data;
        } else if (altResponse.data) {
          console.log('✅ Alternative path calculation successful (direct object):', altResponse.data);
          return altResponse.data;
        }
      } catch (altError) {
        console.error('❌ Alternative calculation path also failed:', altError);
      }
      
      return rejectWithValue(axiosError.response?.data || 'Failed to calculate wallet balance');
    }
  }
);

// Standalone function to directly fetch wallet balance (bypasses Redux)
// Can be used for diagnostic purposes
export const directFetchWalletBalance = async (): Promise<WalletBalance | null> => {
  try {
    console.log('🔍 Direct wallet balance fetch initiated');
    
    // Try both API paths
    let response;
    try {
      // First try without /api prefix
      response = await api.get('/wallet/balance');
    } catch (error) {
      // If that fails, try with /api prefix
      console.log('⚠️ Direct fetch without /api prefix failed, trying with prefix');
      response = await api.get('/api/wallet/balance');
    }
    
    console.log('✅ Direct wallet balance fetch successful:', response.data);
    
    // Extract balance data from response
    if (response.data && response.data.data) {
      return response.data.data as WalletBalance;
    } else if (response.data && typeof response.data === 'object') {
      if ('totalBalance' in response.data || 'availableBalance' in response.data) {
        return response.data as WalletBalance;
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ Direct wallet balance fetch failed:', error);
    return null;
  }
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch wallet balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        // Set recent transactions (last 5)
        state.recentTransactions = action.payload.slice(0, 5);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch pending transactions
      .addCase(fetchPendingTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTransactions = action.payload;
      })
      .addCase(fetchPendingTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Initiate deposit
      .addCase(initiateDeposit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(initiateDeposit.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.pendingTransactions = [action.payload, ...state.pendingTransactions];
        state.successMessage = 'Deposit initiated successfully';
      })
      .addCase(initiateDeposit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Initiate withdrawal
      .addCase(initiateWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(initiateWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.pendingTransactions = [action.payload, ...state.pendingTransactions];
        state.successMessage = 'Withdrawal request submitted successfully';
      })
      .addCase(initiateWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Verify transaction
      .addCase(verifyTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        // Update the transaction in lists
        const updateTransaction = (list: Transaction[]) =>
          list.map(transaction =>
            transaction.transactionId === action.payload.transactionId
              ? action.payload
              : transaction
          );
        
        state.transactions = updateTransaction(state.transactions);
        state.pendingTransactions = state.pendingTransactions.filter(
          transaction => transaction.transactionId !== action.payload.transactionId
        );
        state.successMessage = 'Transaction verified successfully';
      })
      .addCase(verifyTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Calculate wallet balance
      .addCase(calculateWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.balance = action.payload;
          state.successMessage = 'Wallet balance calculated successfully';
        }
      })
      .addCase(calculateWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  clearWalletError,
  clearSuccessMessage,
  setCurrentTransaction,
  clearCurrentTransaction
} = walletSlice.actions;

export default walletSlice.reducer; 