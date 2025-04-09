import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginRequest, VerifyOTPRequest } from '../../lib/api/types';
import { authService } from '../../lib/api/auth.service';

export const sendOTPThunk = createAsyncThunk(
  'auth/sendOTP',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.sendOTP(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to send OTP'
      );
    }
  }
);

export const verifyOTPThunk = createAsyncThunk(
  'auth/verifyOTP',
  async (data: VerifyOTPRequest, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(data);
      
      // Store tokens in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to verify OTP'
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      return null;
    } catch (error: any) {
      // Even if the API call fails, we should clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to logout'
      );
    }
  }
);
