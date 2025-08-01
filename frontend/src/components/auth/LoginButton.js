import React from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, LogOut, User } from 'lucide-react';

export const LoginButton = ({ className = '' }) => {
  const { user, login, logout, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Button variant="outline" className={className} disabled>
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm flex items-center gap-1">
          <User className="w-4 h-4" />
          {user.name || user.email}
          {user.role === 'admin' && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className={className}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={login}
      className={className}
    >
      <LogIn className="w-4 h-4 mr-1" />
      Login with Google
    </Button>
  );
}; 