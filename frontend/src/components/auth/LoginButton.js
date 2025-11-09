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
          <div className="w-16 h-16 bg-desert-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-desert-600" />
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

export const LoginButton = ({ className = '', transparent = false }) => {
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
      <button
        disabled
        className={`group relative overflow-hidden flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
          transparent
            ? 'text-white bg-black/15 backdrop-blur-md border border-white/20 shadow-xl'
            : 'text-[#743f1f] bg-[#f7e9cd]/80 border border-[#e3c992]'
        } ${className}`}
      >
        <div className={`animate-spin rounded-full h-4 w-4 border-2 ${
          transparent ? 'border-white/30 border-t-white' : 'border-desert-200 border-t-desert-600'
        }`}></div>
        {t.loading}
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl backdrop-blur-md border ${
            transparent
              ? 'bg-black/15 border-white/20 shadow-xl'
              : 'bg-[#f7e9cd]/80 border-[#e3c992]'
          }`}>
            <div className="w-7 h-7 bg-desert-bold rounded-lg flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-right">
              <p className={`text-xs font-medium ${
                transparent ? 'text-white/90 text-shadow-xl' : 'text-[#743f1f]'
              }`}>
                {user.name || user.email}
              </p>
              {user.role === 'admin' && (
                <div className="flex items-center gap-1">
                  <Shield className={`w-2.5 h-2.5 ${transparent ? 'text-blue-300' : 'text-blue-600'}`} />
                  <span className={`text-xs font-medium ${
                    transparent ? 'text-blue-300 text-shadow-xl' : 'text-blue-600'
                  }`}>
                    {language === 'he' ? 'מנהל' : 'Admin'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`group relative overflow-hidden flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap hover:transform hover:scale-105 ${
              transparent
                ? 'text-white hover:text-white bg-black/15 hover:bg-black/25 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-xl'
                : 'text-[#743f1f] hover:text-[#3e2211] bg-[#f7e9cd]/80 hover:bg-[#f1ddb8] border border-[#e3c992] hover:border-[#dca359]'
            } ${className}`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${
              transparent ? 'bg-gradient-to-r from-white/20 to-white/30' : 'bg-[#dca359]/25'
            }`}></div>
            <LogOut className={`relative w-4 h-4 group-hover:scale-110 transition-transform z-10 flex-shrink-0 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span className="relative whitespace-nowrap z-10">{t.logout}</span>
          </button>
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
      <button
        onClick={() => setShowLoginModal(true)}
        className={`group relative overflow-hidden flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap hover:transform hover:scale-105 ${
          transparent
            ? 'text-white hover:text-white bg-black/15 hover:bg-black/25 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-xl'
            : 'text-[#743f1f] hover:text-[#3e2211] bg-[#f7e9cd]/80 hover:bg-[#f1ddb8] border border-[#e3c992] hover:border-[#dca359]'
        } ${className}`}
      >
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${
          transparent ? 'bg-gradient-to-r from-white/20 to-white/30' : 'bg-[#dca359]/25'
        }`}></div>
        <LogIn className="relative w-4 h-4 group-hover:scale-110 transition-transform z-10 flex-shrink-0" />
        <span className="relative whitespace-nowrap z-10">{language === 'he' ? 'התחבר' : 'Log In'}</span>
      </button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}; 