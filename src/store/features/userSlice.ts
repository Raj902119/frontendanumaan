import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../lib/api/services/userService';
import apiClient from '../../lib/api/client';
import { ProfileUpdateRequest, UserProfile } from '../../lib/api/types';

// Include all the required user stats for finance platforms
export interface UserStats {
  totalBalance: number;
  availableBalance: number;
  currentValue: number;
  depositedAmount: number;
  withdrawableAmount: number; // Ensuring this field is present
  bonusAmount: number;
  pendingAmount: number;
  netProfitLoss: number;
  // Keep these fields for stats display
  totalTrades?: number;
  activeTrades?: number;
  todayReturns?: number;
}

export interface WinRateStats {
  overallWinRate: number;
  weeklyWinRate: number;
  monthlyWinRate: number;
  categorizedWinRates: {
    [category: string]: number;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  kycStatus: string;
  upiId?: string;
  createdAt: string;
  updatedAt: string;
  referralCode: string;
}

interface UserState {
  profile: UserProfile | null;
  stats: UserStats | null;
  winRateStats: WinRateStats | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  profile: null,
  stats: null,
  winRateStats: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile();
      console.log('Profile data received:', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: ProfileUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update profile');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/v1/users/stats');
      console.log('User stats received:', response.data);
      
      // Ensure withdrawableAmount is present in the stats
      const statsData = response.data.data || {};
      return {
        ...statsData,
        withdrawableAmount: statsData.withdrawableAmount !== undefined ? 
          Number(statsData.withdrawableAmount) : 
          Number(statsData.availableBalance || 0)
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch user stats');
    }
  }
);

export const fetchWinRateStats = createAsyncThunk(
  'user/fetchWinRateStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/v1/users/win-rate');
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch win rate stats:', error);
      // Return a default object with zeros rather than rejecting
      return {
        overallWinRate: 0,
        weeklyWinRate: 0,
        monthlyWinRate: 0,
        categorizedWinRates: {}
      };
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.stats = null;
      state.winRateStats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch stats cases
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch win rate stats cases
      .addCase(fetchWinRateStats.fulfilled, (state, action) => {
        state.winRateStats = action.payload;
      });
  },
});

export const { clearUserError, setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer; 