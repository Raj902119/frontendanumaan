import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { AxiosError } from 'axios';
import { orderService } from '../../lib/api/services/orderService';

export interface Order {
  id: string;
  eventId: string;
  eventName: string;
  userId: string;
  position: string;
  quantity: number;
  price: number;
  status: string;
  outcome: string | null;
  pnl: number;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trade {
  id: string;
  event: string;
  date: string;
  investment: number;
  gains: number;
  currentValue?: number;
  image?: string;
  status: string;
}

interface PlaceOrderPayload {
  eventId: string;
  position: string;
  quantity: number;
  price: number;
  useBonusAmount?: boolean;
}

interface OrdersState {
  activeOrders: Order[];
  pendingOrders: Order[];
  completedOrders: Order[];
  activeTrades: Trade[];
  closedTrades: Trade[];
  currentOrder: Order | null;
  loading: boolean;
  activeTradesLoading: boolean;
  closedTradesLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: OrdersState = {
  activeOrders: [],
  pendingOrders: [],
  completedOrders: [],
  activeTrades: [],
  closedTrades: [],
  currentOrder: null,
  loading: false,
  activeTradesLoading: false,
  closedTradesLoading: false,
  error: null,
  successMessage: null
};

// Helper function to handle error responses
const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error?.message) return error.error.message;
  return 'An unknown error occurred';
};

// Async thunks
export const fetchActiveOrders = createAsyncThunk(
  'orders/fetchActiveOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/orders', {
        params: { status: 'ACTIVE' }
      });
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(formatErrorMessage(axiosError.response?.data));
    }
  }
);

export const fetchPendingOrders = createAsyncThunk(
  'orders/fetchPendingOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/orders/pending');
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(formatErrorMessage(axiosError.response?.data));
    }
  }
);

export const fetchCompletedOrders = createAsyncThunk(
  'orders/fetchCompletedOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/orders', {
        params: { status: 'COMPLETED' }
      });
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(formatErrorMessage(axiosError.response?.data));
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData: PlaceOrderPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/v1/orders', orderData);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(formatErrorMessage(axiosError.response?.data));
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/v1/orders/${orderId}/cancel`);
      return {
        orderId,
        data: response.data.data
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(formatErrorMessage(axiosError.response?.data));
    }
  }
);

// New thunks for trades
export const fetchActiveTrades = createAsyncThunk(
  'orders/fetchActiveTrades',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getActiveTrades();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(formatErrorMessage(axiosError.response?.data));
    }
  }
);

export const fetchClosedTrades = createAsyncThunk(
  'orders/fetchClosedTrades',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getClosedTrades();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(formatErrorMessage(axiosError.response?.data));
    }
  }
);

export const exitTrade = createAsyncThunk(
  'orders/exitTrade',
  async (tradeId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.exitTrade(tradeId);
      return {
        tradeId,
        data: response.data
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(formatErrorMessage(axiosError.response?.data));
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch active orders
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
      
      // Fetch pending orders
      .addCase(fetchPendingOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOrders = action.payload;
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch completed orders
      .addCase(fetchCompletedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.completedOrders = action.payload;
      })
      .addCase(fetchCompletedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.pendingOrders = [...state.pendingOrders, action.payload];
        state.successMessage = 'Order placed successfully';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from pending and active lists
        state.pendingOrders = state.pendingOrders.filter(
          order => order.id !== action.payload.orderId
        );
        state.activeOrders = state.activeOrders.filter(
          order => order.id !== action.payload.orderId
        );
        state.successMessage = 'Order cancelled successfully';
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Active trades
      .addCase(fetchActiveTrades.pending, (state) => {
        state.activeTradesLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveTrades.fulfilled, (state, action) => {
        state.activeTradesLoading = false;
        state.activeTrades = action.payload;
      })
      .addCase(fetchActiveTrades.rejected, (state, action) => {
        state.activeTradesLoading = false;
        state.error = action.payload as string;
      })
      
      // Closed trades
      .addCase(fetchClosedTrades.pending, (state) => {
        state.closedTradesLoading = true;
        state.error = null;
      })
      .addCase(fetchClosedTrades.fulfilled, (state, action) => {
        state.closedTradesLoading = false;
        state.closedTrades = action.payload;
      })
      .addCase(fetchClosedTrades.rejected, (state, action) => {
        state.closedTradesLoading = false;
        state.error = action.payload as string;
      })
      
      // Exit trade
      .addCase(exitTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exitTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTrades = state.activeTrades.filter(
          trade => trade.id !== action.payload.tradeId
        );
        state.successMessage = 'Trade exited successfully';
      })
      .addCase(exitTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  clearOrderError, 
  clearSuccessMessage, 
  setCurrentOrder, 
  clearCurrentOrder 
} = orderSlice.actions;

export default orderSlice.reducer; 