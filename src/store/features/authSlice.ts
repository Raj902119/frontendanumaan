import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../lib/api/client';
import { fetchReferralDashboard } from './referralSlice';

// Define types and interfaces
export interface AuthState {
  user: any | null;
  tokens: {
    accessToken?: string;
    refreshToken?: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
}

interface SendOTPParams {
  phone: string;
  name?: string;
  referralCode?: string;
}

// Types
interface User {
  id: string;
  name: string;
  phone: string;
  referralCode: string;
  wallet: {
    availableBalance: number;
    bonusAmount: number;
    totalBalance: number;
    totalReferralBonus: number;
    availableReferralBonus: number;
    referralBonusBalance: number;
  };
}

// Get initial state from localStorage if available
const getInitialState = (): AuthState => {
  try {
    if (typeof window === 'undefined') {
      return {
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        otpSent: false
      };
    }

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    return {
      user: user ? JSON.parse(user) : null,
      tokens: token || refreshToken ? {
        accessToken: token || undefined,
        refreshToken: refreshToken || undefined
      } : null,
      isAuthenticated: !!token,
      isLoading: false,
      error: null,
      otpSent: false
    };
  } catch (e) {
    // If there's any error, return default state
    return {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      otpSent: false
    };
  }
};

// Initial state
const initialState: AuthState = getInitialState();

// Async thunks
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ phone, name, referralCode }: SendOTPParams, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, name, referralCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to send OTP');
      }

      return { success: true, message: data.message };
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while sending OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phone, otp, name, referralCode }: { phone: string; otp: string; name?: string; referralCode?: string }, { rejectWithValue }) => {
    try {
      console.log('Verifying OTP in authSlice:', { 
        phone, 
        otp, 
        name: name ? 'Provided' : undefined, 
        referralCode: referralCode ? 'Provided' : undefined
      });

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name, referralCode })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('OTP verification failed:', data);
        return rejectWithValue(data.message || 'Failed to verify OTP');
      }
      
      console.log('OTP verification successful, storing user data');
      
      // Store authentication data in localStorage
      if (typeof window !== 'undefined' && data.data) {
        if (data.data.token) localStorage.setItem('token', data.data.token);
        if (data.data.refreshToken) localStorage.setItem('refreshToken', data.data.refreshToken);
        if (data.data.user) localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data.data;
    } catch (error: any) {
      console.error('Error during OTP verification:', error);
      return rejectWithValue(error.message || 'An error occurred while verifying OTP');
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async ({ phone }: { phone: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to resend OTP');
      }
      
      return { success: true, message: data.message };
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while resending OTP');
    }
  }
);

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to refresh token');
      }
      
      // Update localStorage with new token if available
      if (typeof window !== 'undefined' && data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
      
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while refreshing token');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage first for immediate client-side effect
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('tokens');

      // Then call the backend API to complete server-side logout
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to logout');
      }

      return { success: true };
    } catch (error: any) {
      // Even if API call fails, still clear state
      return { success: true };
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'auth/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/v1/users/stats');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch user stats');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.otpSent = false;
    }
  },
  extraReducers: (builder) => {
    // Send OTP
    builder.addCase(sendOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOTP.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(sendOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to send OTP';
    });

    // Verify OTP
    builder.addCase(verifyOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.tokens = {
        accessToken: action.payload.token,
        refreshToken: action.payload.refreshToken
      };
      state.isAuthenticated = !!action.payload.token;
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to verify OTP';
    });

    // Resend OTP
    builder.addCase(resendOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resendOTP.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(resendOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to resend OTP';
    });

    // Refresh Token
    builder.addCase(refreshAuthToken.fulfilled, (state, action) => {
      state.tokens = {
        accessToken: action.payload.token,
        refreshToken: state.tokens?.refreshToken
      };
      state.isAuthenticated = !!action.payload.token;
    });
    builder.addCase(refreshAuthToken.rejected, (state, action) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = action.payload as string || 'Failed to refresh token';
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      // Reset auth state immediately when logout begins
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      // Ensure state is cleared
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      // Even if logout API fails, clear state
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  }
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer; 