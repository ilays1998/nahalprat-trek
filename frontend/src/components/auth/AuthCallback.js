import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const nextParam = searchParams.get('next');
      const redirectPath = nextParam || localStorage.getItem('redirectPath') || '/';
      console.log('🔁 Redirect target after login:', redirectPath);

      try {
        await handleAuthCallback();
        navigate(redirectPath, { replace: true });
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
