import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();

    useEffect(() => {
    const handleCallback = async () => {
      // Check if we have authentication data in URL hash or search params
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);
      
      let accessToken = null;
      let userData = null;

      // Handle different callback formats
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1));
        accessToken = hashParams.get('access_token');
      } else {
        accessToken = urlParams.get('access_token');
      }

      // If we have an access token in the URL, use it
      if (accessToken) {
        try {
          // Parse user data if available
          const userDataParam = urlParams.get('user');
          if (userDataParam) {
            userData = JSON.parse(decodeURIComponent(userDataParam));
          }

          handleAuthCallback(accessToken, userData);
          navigate('/', { replace: true });
        } catch (error) {
          console.error('Error handling auth callback:', error);
          navigate('/login-error', { replace: true });
        }
      } else {
        // No token found, redirect to home
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, handleAuthCallback]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}; 