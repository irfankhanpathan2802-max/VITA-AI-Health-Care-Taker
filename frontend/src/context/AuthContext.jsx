import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vitacare_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('vitacare_token');
      if (savedToken) {
        try {
          const res = await apiRequest('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            setIsDemoMode(res.user.isDemoUser || false);
          }
        } catch (err) {
          console.warn('Session verification failed, clearing auth:', err.message);
          localStorage.removeItem('vitacare_token');
          localStorage.removeItem('vitacare_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success) {
      localStorage.setItem('vitacare_token', res.token);
      localStorage.setItem('vitacare_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setIsDemoMode(res.user.isDemoUser || false);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (res.success) {
      localStorage.setItem('vitacare_token', res.token);
      localStorage.setItem('vitacare_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setIsDemoMode(false);
    }
    return res;
  };

  const activateDemoMode = async () => {
    const res = await apiRequest('/auth/demo', {
      method: 'POST',
    });

    if (res.success) {
      localStorage.setItem('vitacare_token', res.token);
      localStorage.setItem('vitacare_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      setIsDemoMode(true);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('vitacare_token');
    localStorage.removeItem('vitacare_user');
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
  };

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
    localStorage.setItem('vitacare_user', JSON.stringify({ ...user, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isDemoMode,
        login,
        register,
        logout,
        activateDemoMode,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
