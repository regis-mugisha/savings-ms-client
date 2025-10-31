import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'https://savings-ms-client-api.onrender.com/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token, clear storage and redirect to login
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
          return Promise.reject(error);
        }

        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        await AsyncStorage.setItem('accessToken', accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (
    fullName: string,
    email: string,
    password: string,
    deviceId: string,
    pushToken?: string
  ) => {
    const response = await api.post('/auth/register', {
      fullName,
      email,
      password,
      deviceId,
      pushToken,
    });
    return response.data;
  },

  login: async (email: string, password: string, pushToken?: string) => {
    const response = await api.post('/auth/login', {
      email,
      password,
      pushToken,
    });
    return response.data;
  },

  updatePushToken: async (pushToken: string) => {
    const response = await api.post('/auth/push-token', {
      pushToken,
    });
    return response.data;
  },
};

// Savings API functions
export const savingsAPI = {
  getBalance: async () => {
    const response = await api.get('/savings/balance');
    return response.data;
  },

  deposit: async (amount: number) => {
    const response = await api.post('/savings/deposit', { amount });
    return response.data;
  },

  withdraw: async (amount: number) => {
    const response = await api.post('/savings/withdraw', { amount });
    return response.data;
  },

  getTransactionHistory: async (page: number = 1, limit: number = 20) => {
    const response = await api.get('/savings/history', {
      params: { page, limit },
    });
    return response.data;
  },
};

// Export the api instance for custom requests
export default api;
