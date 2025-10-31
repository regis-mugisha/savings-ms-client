import { authAPI, savingsAPI } from '@/lib/api';
import { registerForPushNotificationsAsync } from '@/lib/registerForPushNotificationsAsync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
  deviceId: string;
  deviceVerified: boolean;
  balance: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  deviceId: string | null;
  pushToken: string | null;
  setPushToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, pushToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);

  // Initialize and get device ID
  useEffect(() => {
    const getDeviceId = async () => {
      try {
        const id = await Application.getAndroidId();
        setDeviceId(id);
      } catch (error) {
        console.error('Error getting device ID:', error);
      }
    };
    getDeviceId();
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const pushToken = await registerForPushNotificationsAsync();

      const response = await authAPI.login(email, password, pushToken);
      const { accessToken, refreshToken, user: userData } = response;

      // Store tokens and user data
      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken],
        ['user', JSON.stringify(userData)],
      ]);

      setUser(userData);

      // Send push token to backend if available
      if (pushToken) {
        try {
          await authAPI.updatePushToken(pushToken);
        } catch (error) {
          console.error('Failed to update push token:', error);
          // Don't throw error, login should succeed even if push token update fails
        }
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (fullName: string, email: string, password: string, pushToken: string) => {
    if (!deviceId) {
      throw new Error('Device ID not available');
    }

    try {
      const response = await authAPI.register(fullName, email, password, deviceId, pushToken);
      // Don't auto-login after registration
      // User needs to wait for device verification
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshBalance = async () => {
    try {
      const response = await savingsAPI.getBalance();
      const updatedUser = { ...user!, balance: response.balance };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        deviceId,
        pushToken,
        setPushToken,
        login,
        register,
        logout,
        refreshBalance,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
