import { LoginRequest, VerifyOTPRequest } from './types';
import apiClient from './client';

export const authService = {
  sendOTP: (data: LoginRequest) => apiClient.post('/v1/auth/send-otp', data),
  verifyOTP: (data: VerifyOTPRequest) => apiClient.post('/v1/auth/verify-otp', data),
  logout: () => apiClient.post('/v1/auth/logout')
}; 