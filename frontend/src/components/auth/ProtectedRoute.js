import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';
import { useLanguage } from '../../layout';
import LoginModal from './LoginModal';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, authError } = useAuth();
  const { language } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {language === 'he' ? 'טוען...' : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || authError) {
    return (
      <>
        <div className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-red-600 mb-4">⚠️</div>
              <p className="text-gray-900 font-semibold mb-4">
                {authError || (language === 'he' ? 'אנא התחבר כדי להמשיך' : 'Please log in to continue')}
              </p>
              <Button 
                onClick={() => setShowLoginModal(true)}
                className="bg-amber-600 hover:bg-amber-700 inline-flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {language === 'he' ? 'התחבר' : 'Log In'}
              </Button>
            </div>
          </div>
        </div>
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  return children;
}; 