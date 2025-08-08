import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, LogOut, User, Shield, X } from 'lucide-react';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
            האם אתה בטוח?
          </h3>
          <p className="text-gray-600 mb-6">
            האם אתה בטוח שברצונך להתנתק מהמערכת?
          </p>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              ביטול
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              התנתק
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginButton = ({ className = '' }) => {
  const { user, login, logout, loading, isAuthenticated } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  if (loading) {
    return (
      <Button variant="outline" className={className} disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-200 border-t-amber-600 mr-2"></div>
        טוען...
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
                    מנהל
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
            <LogOut className="w-4 h-4 mr-1" />
            התנתק
          </Button>
        </div>

        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      </>
    );
  }

  return (
    <Button
      onClick={login}
      className={`bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl relative overflow-hidden group ${className}`}
    >
      {/* Google colors accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center justify-center gap-3">
        {/* Google G icon */}
        <div className="w-5 h-5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <span className="font-medium">המשך עם Google</span>
      </div>
    </Button>
  );
}; 