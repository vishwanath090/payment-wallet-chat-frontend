// api/client.js
import axios from 'axios';

// Use env variable (Vite style). Fallback to localhost for dev.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Helper function to clear all auth data from both storage types
const clearAuthData = () => {
  // Clear sessionStorage (primary)
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem('user');
  
  // Clear localStorage (fallback/legacy)
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem('user');
  
  console.log('🔐 API Client - All auth data cleared from both storage types');
};

// Helper function to get token from both storage types
const getTokenFromStorage = () => {
  // Check sessionStorage first (primary)
  let token = sessionStorage.getItem("token") || sessionStorage.getItem("access_token");
  
  // If not found in sessionStorage, check localStorage (fallback)
  if (!token) {
    token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) {
      console.log('🔐 API Client - Using token from localStorage (fallback)');
    }
  } else {
    console.log('🔐 API Client - Using token from sessionStorage');
  }
  
  return token;
};

// Request interceptor - FIXED to check both storage types
// In client.js - Add token refresh logic
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Client - Response success: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    const backendMessage = error.response?.data?.detail;
    
    console.error(`❌ API Client - Response error: ${status} ${method} ${url}`);

    // ✅ ADD: Handle 403 "Not authenticated" errors
    if (status === 403 && backendMessage === 'Not authenticated') {
      console.log('🔐 API Client - Token expired or invalid, attempting refresh...');
      
      // Try to refresh the token
      try {
        const refreshToken = sessionStorage.getItem("refresh_token") || localStorage.getItem("refresh_token");
        
        if (refreshToken) {
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          if (refreshResponse.data.access_token) {
            // Save new token
            const newToken = refreshResponse.data.access_token;
            sessionStorage.setItem("token", newToken);
            sessionStorage.setItem("access_token", newToken);
            localStorage.setItem("token", newToken);
            localStorage.setItem("access_token", newToken);
            
            console.log('🔐 API Client - Token refreshed successfully');
            
            // Retry the original request with new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          }
        }
      } catch (refreshError) {
        console.log('🔐 API Client - Token refresh failed, logging out');
        clearAuthData();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // ... rest of your existing error handling
  }
);

// ✅ FIXED: Enhanced user-friendly error messages
const getUserFriendlyErrorMessage = (error) => {
  const status = error.response?.status;
  const url = error.config?.url;
  const backendMessage = error.response?.data?.detail;
  
  // Handle PIN errors specifically
  if (error.isPinError || error.isWalletError) {
    return backendMessage || 'Transaction failed. Please check your PIN and try again.';
  }
  
  switch (status) {
    case 401:
      return 'Your session has expired. Please login again.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'Server error. Please try again later.';
    case 400:
      return backendMessage || 'Invalid request. Please check your input.';
    default:
      if (!error.response) {
        return 'Network error. Please check your connection.';
      }
      return backendMessage || 'An unexpected error occurred. Please try again.';
  }
};

// Export helper functions for use in components
export { clearAuthData, getTokenFromStorage, getUserFriendlyErrorMessage };

export default api;