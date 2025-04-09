import apiClient from '../client';

interface OTPRequestPayload {
  phone: string;
  name?: string;
}

interface OTPVerifyPayload {
  phone: string;
  otp: string;
  name?: string;
}

const authService = {
  /**
   * Send OTP to phone number
   */
  sendOTP: async (payload: OTPRequestPayload) => {
    const response = await apiClient.post('/auth/send-otp', payload);
    return response.data;
  },

  /**
   * Resend OTP to phone number
   */
  resendOTP: async (payload: { phone: string }) => {
    const response = await apiClient.post('/auth/resend-otp', payload);
    return response.data;
  },

  /**
   * Verify OTP and login/register user
   */
  verifyOTP: async (payload: OTPVerifyPayload) => {
    const response = await apiClient.post('/auth/verify-otp', payload);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }
};

export default authService;
