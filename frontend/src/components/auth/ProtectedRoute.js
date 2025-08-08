import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginButton } from './LoginButton';
import { Mountain, Shield, Users, Lock, ArrowRight } from 'lucide-react';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-sunset-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto"></div>
            <Mountain className="w-8 h-8 text-amber-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-amber-800 font-medium text-lg">טוען...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sunset-gradient flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
          
          {/* Main authentication card */}
          <div className="relative glass rounded-2xl p-8 shadow-warm-lg backdrop-blur-sm border border-white/30">
            {/* Header with icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-desert-gradient rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-20 h-20 bg-desert-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-warm">
                  <Lock className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">
                נדרשת התחברות
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                עליך להתחבר כדי לגשת לעמוד זה
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-medium">התחברות מאובטחת עם Google</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-medium">ניהול הזמנות אישי</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Mountain className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-medium">גישה מלאה לכל החבילות</span>
              </div>
            </div>

            {/* Login button */}
            <LoginButton className="w-full text-lg py-4 group" />
            
            {/* Footer note */}
            <p className="text-center text-sm text-gray-500 mt-6">
              ההתחברות בטוחה ומהירה • ללא צורך ברישום
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-sunset-gradient flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="relative glass rounded-2xl p-8 shadow-warm-lg backdrop-blur-sm border border-white/30 text-center">
            {/* Header with icon */}
            <div className="mb-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-red-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">
                נדרשת הרשאת מנהל
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                אין לך הרשאה לגשת לעמוד זה
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                <span>תפקיד נוכחי:</span>
                <span className="font-semibold text-gray-800">
                  {user?.role === 'user' ? 'משתמש רגיל' : user?.role || 'לא ידוע'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}; 