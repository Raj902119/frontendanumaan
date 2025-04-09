import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { AxiosError } from 'axios';

interface TopInviter {
  username: string;
  profilePicture: string;
  earnings: number;
}

interface Activity {
  type: string;
  amount: number;
  date: string;
  description: string;
}

interface ReferralState {
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  availableBonus: number;
  currentEarning: number;
  referralLink: string;
  topInviters: TopInviter[];
  recentActivity: Activity[];
  bonusHistory: any[];
  bonusUsageHistory: any[];
  referredUsers: any[];
  loading: boolean;
  error: string | null;
}

// Async thunks
export const fetchReferralCode = createAsyncThunk(
  'referral/fetchReferralCode',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching referral code...');
      const response = await api.get('/v1/referrals/my-referral-code');
      console.log('Referral code response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching referral code:', error);
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch referral code');
    }
  }
);

export const fetchReferralDashboard = createAsyncThunk(
  'referral/fetchReferralDashboard',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching referral dashboard...');
      const response = await api.get('/v1/referrals/user-dashboard');
      console.log('Referral dashboard response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching referral dashboard:', error);
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch dashboard');
    }
  }
);

const initialState: ReferralState = {
  referralCode: '',
  totalReferrals: 0,
  activeReferrals: 0,
  totalEarnings: 0,
  availableBonus: 0,
  currentEarning: 0,
  referralLink: '',
  topInviters: [],
  recentActivity: [],
  bonusHistory: [],
  bonusUsageHistory: [],
  referredUsers: [],
  loading: false,
  error: null
};

const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralCode.fulfilled, (state, action) => {
        state.loading = false;
        state.referralCode = action.payload.referralCode;
        state.totalReferrals = action.payload.totalReferrals;
        state.totalEarnings = action.payload.totalReferralBonus;
        state.availableBonus = action.payload.availableReferralBonus;
      })
      .addCase(fetchReferralCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchReferralDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.referralCode = action.payload.referralCode;
        state.totalReferrals = action.payload.totalReferrals;
        state.activeReferrals = action.payload.activeReferrals || 0;
        state.totalEarnings = action.payload.totalEarnings;
        state.availableBonus = action.payload.availableBonus;
        state.currentEarning = action.payload.currentEarning || action.payload.availableBonus;
        state.referralLink = action.payload.referralLink || '';
        state.topInviters = action.payload.topInviters || [];
        state.recentActivity = action.payload.recentActivity || [];
        state.bonusHistory = action.payload.bonusHistory || [];
        state.bonusUsageHistory = action.payload.bonusUsageHistory || [];
        state.referredUsers = action.payload.referredUsers || [];
      })
      .addCase(fetchReferralDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default referralSlice.reducer;
