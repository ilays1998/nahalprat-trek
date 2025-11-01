import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { scrollToError } from '../navigation/ScrollToError';
import { LogIn, Mail, Lock, User, X, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const LoginModal = ({ isOpen, onClose }) => {
  const { loginGoogle, loginEmail, register, verifyEmail, resendVerification } = useAuth();
  const [mode, setMode] = useState('login'); // 'login', 'register', 'verify'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (mode === 'register') {
      if (!formData.name.trim()) {
        setError('שם מלא הוא שדה חובה');
        scrollToError();
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('הסיסמאות אינן תואמות');
        scrollToError();
        return false;
      }
      if (formData.password.length < 8) {
        setError('הסיסמה חייבת להכיל לפחות 8 תווים');
        scrollToError();
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      setError('כתובת אימייל היא שדה חובה');
      scrollToError();
      return false;
    }
    
    if (!formData.password.trim()) {
      setError('סיסמה היא שדה חובה');
      scrollToError();
      return false;
    }

    return true;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await loginEmail(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      setSuccess('התחברות בוצעה בהצלחה!');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);
    } else {
      if (result.needsVerification) {
        setError('אנא אמת את כתובת האימייל שלך לפני ההתחברות');
        setMode('verify');
      } else {
        setError(result.error);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData.email, formData.password, formData.name);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setMode('verify');
    } else {
      setError(result.error);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email.trim()) {
      setError('אנא הזן את כתובת האימייל שלך');
      return;
    }

    setLoading(true);
    const result = await resendVerification(formData.email);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.error);
    }
  };

  const handleGoogleLogin = () => {
    onClose();
    loginGoogle();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {mode === 'verify' ? (
            // Email Verification View
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                אמת את האימייל שלך
              </h2>
              <p className="text-gray-600 mb-6">
                שלחנו לינק אימות לכתובת האימייל שלך. אנא לחץ על הלינק כדי להשלים את הרישום.
              </p>

              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50 error-message">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600 text-right">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600 text-right">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleResendVerification}
                variant="outline"
                disabled={loading}
                className="w-full mb-4"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                שלח מייל אימות מחדש
              </Button>

              <Button
                onClick={() => handleModeChange('login')}
                variant="ghost"
                className="text-sm text-gray-500"
              >
                חזור להתחברות
              </Button>
            </div>
          ) : (
            // Login/Register Form
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-desert-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-desert-600" />
                </div>
                
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                  {mode === 'login' ? 'התחברות' : 'הרשמה'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'login' 
                    ? 'התחבר לחשבון שלך כדי לנהל את ההזמנות' 
                    : 'צור חשבון חדש כדי להתחיל להזמין טיולים'}
                </p>
              </div>

              {/* Google Login Button */}
              <Button
                onClick={handleGoogleLogin}
                className="w-full mb-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300"
              >
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                המשך עם Google
              </Button>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">או</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={mode === 'login' ? handleEmailLogin : handleRegister} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      שם מלא
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="הזן את שמך המלא"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-500 focus:border-desert-500 text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    כתובת אימייל
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="הזן את כתובת האימייל"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-500 focus:border-desert-500 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    סיסמה
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="הזן סיסמה"
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-500 focus:border-desert-500 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      אימות סיסמה
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="הזן את הסיסמה שוב"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-500 focus:border-desert-500 text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50 error-message">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-600 text-right">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600 text-right">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-desert-600 hover:bg-desert-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-desert-200 border-t-white mr-2" />
                  ) : (
                    <LogIn className="w-4 h-4 mr-2" />
                  )}
                  {mode === 'login' ? 'התחבר' : 'הירשם'}
                </Button>
              </form>

              {/* Toggle Login/Register */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                  className="text-sm text-desert-600 hover:text-desert-700 font-medium"
                >
                  {mode === 'login' 
                    ? 'אין לך חשבון? הירשם כאן' 
                    : 'כבר יש לך חשבון? התחבר כאן'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;