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
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const API_BASE_URL = config.API_BASE_URL;

  useEffect(() => {
    // Try to fetch user info on app load (cookie-based auth)
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',  // Include cookies in request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setAuthError(null);
      } else if (response.status === 401) {
        // Not authenticated or session expired
        setUser(null);
        setAuthError(null);
      } else {
        // Other errors
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUser(null);
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

  const loginGoogle = () => {
    // Redirect to backend login endpoint
    window.location.href = `${API_BASE_URL}/auth/login`;
  };

  const loginEmail = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-email`, {
        method: 'POST',
        credentials: 'include',  // Include cookies in request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Cookie is set by backend
        setUser(data.user);
        setAuthError(null);
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          error: data.error,
          needsVerification: data.needs_verification 
        };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message, emailSent: data.email_sent };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const handleAuthCallback = async () => {
    // Cookie is already set by backend during OAuth redirect
    // Just fetch user info and redirect
    await fetchUserInfo();
    
    // Return the path we should navigate to; caller performs navigation
    const redirectPath = localStorage.getItem('redirectPath') || '/';
    localStorage.removeItem('redirectPath');
    return redirectPath;
  };

  const logout = async () => {
    try {
      // Call backend to clear cookie
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    setUser(null);
    setAuthError(null);
  };

  const value = {
    user,
    loading,
    loginGoogle,
    loginEmail,
    register,
    verifyEmail,
    resendVerification,
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