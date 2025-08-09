import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const API_BASE_URL = config.API_BASE_URL;

  useEffect(() => {
    if (token) {
      // Verify token and get user info on app load
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserInfo = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setAuthError(null);
      } else if (response.status === 401) {
        // Token is expired or invalid
        handleAuthError('Your session has expired. Please log in again.');
      } else {
        // Other errors
        logout();
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (message) => {
    logout();
    setAuthError(message);
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth/callback' && currentPath !== '/login-error') {
      localStorage.setItem('redirectPath', currentPath);
    }
  };

  const login = () => {
    // Redirect to backend login endpoint
    window.location.href = `${API_BASE_URL}/auth/login`;
  };

  const handleAuthCallback = (accessToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    setAuthError(null);
    localStorage.setItem('authToken', accessToken);
    
    // Redirect to stored path or default to home
    const redirectPath = localStorage.getItem('redirectPath') || '/';
    localStorage.removeItem('redirectPath'); // Clear stored path
    window.location.href = redirectPath;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    handleAuthCallback,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    authError,
    clearAuthError: () => setAuthError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 