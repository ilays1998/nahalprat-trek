import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../layout';
import { LogIn, LogOut, User, Shield, X } from 'lucide-react';
import LoginModal from './LoginModal';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, t, isRTL }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 animate-in fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-amber-600" />
          </div>
          
          <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
            {t.logoutConfirm}
          </h3>
          <p className="text-gray-600 mb-6">
            {t.logoutMessage}
          </p>
          
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="flex-1"
            >
              <LogOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t.logout}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const LoginButton = ({ className = '' }) => {
  const { user, loginGoogle, logout, loading, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const isRTL = language === 'he';

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  if (loading) {
    return (
      <Button variant="outline" className={className} disabled>
        <div className={`animate-spin rounded-full h-4 w-4 border-2 border-amber-200 border-t-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
        {t.loading}
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-amber-200">
            <div className="w-8 h-8 bg-desert-gradient rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.name || user.email}
              </p>
              {user.role === 'admin' && (
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">
                    {language === 'he' ? 'מנהל' : 'Admin'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogoutModal(true)}
            className={`hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300 ${className}`}
          >
            <LogOut className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {t.logout}
          </Button>
        </div>

        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          t={t}
          isRTL={isRTL}
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowLoginModal(true)}
        className={`bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-amber-300 shadow-lg hover:shadow-xl relative overflow-hidden group ${className}`}
      >
        <div className="relative flex items-center justify-center gap-3">
          <LogIn className="w-4 h-4" />
          <span className="font-medium">{language === 'he' ? 'התחבר' : 'Log In'}</span>
        </div>
      </Button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}; 