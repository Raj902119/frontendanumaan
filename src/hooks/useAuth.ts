'use client'

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { 
  sendOTP,
  verifyOTP,
  logoutUser,
  resendOTP,
  refreshAuthToken,
  resetAuth,
} from '@/store/features/authSlice';
import { fetchReferralDashboard, fetchReferralCode } from '@/store/features/referralSlice';
import { setUser } from '@/store/features/userSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, tokens, isLoading, error, isAuthenticated: reduxAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Check for token directly in localStorage as a fallback
  const hasTokenInStorage = typeof window !== 'undefined' && !!localStorage.getItem('token');
  
  // Derived authentication state - either from Redux or localStorage
  const isAuthenticated = reduxAuthenticated || hasTokenInStorage;

  const handleSendOTP = useCallback(async (phone: string, name?: string, referralCode?: string, isLogin: boolean = false) => {
    try {
      // If this is a login attempt, first check if the user exists
      if (isLogin) {
        const checkUserResponse = await fetch('/api/auth/check-user-exists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone }),
        });

        const checkUserData = await checkUserResponse.json();
        
        // If user doesn't exist, return false immediately
        if (!checkUserResponse.ok || !checkUserData.success || !checkUserData.data.exists) {
          console.log('User check failed:', checkUserData);
          return { success: false, exists: false, message: 'User not registered. Please sign up.' };
        }
      }
      
      // If we get here, either it's not a login attempt or the user exists
      // Proceed to send OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, name, referralCode }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, exists: true, message: data.message || 'Failed to send OTP' };
      }
      
      return { success: true, exists: true, message: data.message || 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, exists: true, message: 'An error occurred' };
    }
  }, []);

  const handleVerifyOTP = useCallback(async (phone: string, otp: string, name?: string, referralCode?: string) => {
    try {
      console.log('Verifying OTP with:', { phone, otp, name, referralCode });
      const result = await dispatch(verifyOTP({ phone, otp, name, referralCode })).unwrap();
      console.log('Verification result:', result);
      return !!result;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return false;
    }
  }, [dispatch]);

  const handleResendOTP = useCallback(async (phone: string) => {
    try {
      const result = await dispatch(resendOTP({ phone })).unwrap();
      return result.success;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const handleRefreshToken = useCallback(async () => {
    if (!tokens?.refreshToken) return false;
    try {
      const result = await dispatch(refreshAuthToken(tokens.refreshToken)).unwrap();
      return !!result;
    } catch (error) {
      return false;
    }
  }, [dispatch, tokens]);

  const handleLogout = useCallback(async () => {
    try {
      // Clear localStorage first for immediate effect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('persist:root');
      }
      
      // Then dispatch the Redux action
      await dispatch(logoutUser()).unwrap();
      return true;
    } catch (error) {
      // Also clear localStorage on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('persist:root');
      }
      
      // Dispatch resetAuth directly if the thunk failed
      dispatch(resetAuth());
      return true;
    }
  }, [dispatch]);

  return {
    user,
    token: tokens?.accessToken,
    refreshToken: tokens?.refreshToken,
    isLoading,
    error,
    isAuthenticated,
    isInitialized: true,
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    resendOTP: handleResendOTP,
    refresh: handleRefreshToken,
    logout: handleLogout
  };
} 