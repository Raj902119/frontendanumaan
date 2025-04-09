import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../lib/api/services/orderService';
import { walletService } from '../../lib/api/services/walletService';

// Types
interface Order {
  id: string;
  orderId: string;
  eventId: any;
  position: string;
  quantity: number;
  price: number;
  investment: number;
  currentValue: number;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  transactionId: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface WalletBalance {
  totalBalance: number;
  availableBalance: number;
  currentValue: number;
  depositedAmount: number;
  withdrawableAmount: number;
  bonusAmount: number;
  netProfitLoss: number;
}

interface PortfolioState {
  orders: Order[];
  activeOrders: Order[];
  settledOrders: Order[];
  transactions: Transaction[];
  walletBalance: WalletBalance | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PortfolioState = {
  orders: [],
  activeOrders: [],
  settledOrders: [],
  transactions: [],
  walletBalance: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'portfolio/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchActiveOrders = createAsyncThunk(
  'portfolio/fetchActiveOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders({ status: 'MATCHED' });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch active orders');
    }
  }
);

export const fetchSettledOrders = createAsyncThunk(
  'portfolio/fetchSettledOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders({ status: 'SETTLED' });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch settled orders');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'portfolio/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await walletService.getTransactions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchWalletBalance = createAsyncThunk(
  'portfolio/fetchWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await walletService.getBalance();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch wallet balance');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchActiveOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOrders = action.payload;
      })
      .addCase(fetchActiveOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSettledOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettledOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.settledOrders = action.payload;
      })
      .addCase(fetchSettledOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.walletBalance = action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default portfolioSlice.reducer; 