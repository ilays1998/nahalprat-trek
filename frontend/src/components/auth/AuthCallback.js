import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Check if this is actually a Google OAuth callback
      // Google sends 'code' or 'state' parameters
      const hasOAuthParams = searchParams.has('code') || searchParams.has('state');
      
      if (!hasOAuthParams) {
        console.log('⚠️ AuthCallback loaded without OAuth params - redirecting to home');
        // This is likely browser history, not a real OAuth callback
        navigate('/', { replace: true });
        return;
      }

      console.log('✅ Valid OAuth callback detected - processing...');
      
      try {
        // Cookie is already set by backend during OAuth redirect
        // Just fetch user info and redirect
        const path = await handleAuthCallback();
        navigate(path, { replace: true });
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/login-error', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, handleAuthCallback, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}; 