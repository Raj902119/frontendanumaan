import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh for 401 errors (except for refresh token endpoint)
    if (error.response?.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url !== '/v1/auth/refresh-token') {
      
      originalRequest._retry = true;
      
      try {
        // Only run on client side
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            const response = await axios.post('/api/auth/refresh-token', {
              refreshToken
            });
            
            if (response.data.data?.token) {
              // Store new token
              localStorage.setItem('token', response.data.data.token);
              
              // Update authorization header
              originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
              
              // Retry original request
              return apiClient(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear auth data on refresh failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
          // Redirect to login (if using Next.js)
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

