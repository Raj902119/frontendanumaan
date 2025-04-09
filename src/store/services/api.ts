import axios from 'axios';

// Base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
console.log('API_BASE_URL in services/api.ts:', API_BASE_URL);

// Create axios instance with custom config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// URLs that don't need retry or special error handling
const STANDARD_ROUTES = [
  '/v1/wallet/balance',
  '/v1/wallet/transactions',
  '/v1/users/stats',
  '/v1/users/win-rate',
  '/v1/orders',
];

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add timestamp to prevent caching
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    // For balance endpoint, log the request
    if (config.url?.includes('/wallet/balance')) {
      console.log('🔍 Wallet balance request:', config);
    }
    
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log wallet balance response
    if (response.config.url?.includes('/wallet/balance')) {
      console.log('💰 Wallet balance response:', response.data);
    }
    return response;
  },
  async (error) => {
    // Handle wallet balance error specially
    if (error.config?.url?.includes('/wallet/balance')) {
      console.log('💰❌ Wallet balance error:', {
        url: error.config.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    
    // Log all API errors
    console.log('API error in services/api.ts:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle token expiration
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear auth data if token expired
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 