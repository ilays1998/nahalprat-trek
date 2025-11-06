import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../layout';
import { scrollToError } from '../navigation/ScrollToError';
import { LogIn, Mail, Lock, User, X, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const LoginModal = ({ isOpen, onClose }) => {
  const { loginGoogle, loginEmail, register, verifyEmail, resendVerification } = useAuth();
  const { language, isRTL } = useLanguage();
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

  // Translation object
  const t = {
    he: {
      login: 'התחברות',
      register: 'הרשמה',
      verifyEmail: 'אמת את האימייל שלך',
      verifyEmailDesc: 'שלחנו לינק אימות לכתובת האימייל שלך. אנא לחץ על הלינק כדי להשלים את הרישום.',
      resendVerification: 'שלח מייל אימות מחדש',
      backToLogin: 'חזור להתחברות',
      loginSubtitle: 'התחבר לחשבון שלך כדי לנהל את ההזמנות',
      registerSubtitle: 'צור חשבון חדש כדי להתחיל להזמין טיולים',
      continueWithGoogle: 'התחבר עם Google',
      or: 'או',
      fullName: 'שם מלא',
      fullNamePlaceholder: 'הזן את שמך המלא',
      email: 'כתובת אימייל',
      emailPlaceholder: 'הזן את כתובת האימייל',
      password: 'סיסמה',
      passwordPlaceholder: 'הזן סיסמה',
      confirmPassword: 'אימות סיסמה',
      confirmPasswordPlaceholder: 'הזן את הסיסמה שוב',
      loginButton: 'התחבר',
      registerButton: 'הירשם',
      noAccount: 'אין לך חשבון? הירשם כאן',
      hasAccount: 'כבר יש לך חשבון? התחבר כאן',
      loginSuccess: 'התחברות בוצעה בהצלחה!',
      verifyBeforeLogin: 'אנא אמת את כתובת האימייל שלך לפני ההתחברות',
      enterEmail: 'אנא הזן את כתובת האימייל שלך',
      fullNameRequired: 'שם מלא הוא שדה חובה',
      passwordMismatch: 'הסיסמאות אינן תואמות',
      passwordTooShort: 'הסיסמה חייבת להכיל לפחות 8 תווים',
      emailRequired: 'כתובת אימייל היא שדה חובה',
      passwordRequired: 'סיסמה היא שדה חובה'
    },
    en: {
      login: 'Login',
      register: 'Register',
      verifyEmail: 'Verify Your Email',
      verifyEmailDesc: 'We\'ve sent a verification link to your email address. Please click the link to complete your registration.',
      resendVerification: 'Resend Verification Email',
      backToLogin: 'Back to Login',
      loginSubtitle: 'Sign in to your account to manage your bookings',
      registerSubtitle: 'Create a new account to start booking treks',
      continueWithGoogle: 'Sign in with Google',
      or: 'or',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email Address',
      emailPlaceholder: 'Enter your email address',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Enter password again',
      loginButton: 'Sign In',
      registerButton: 'Sign Up',
      noAccount: 'Don\'t have an account? Sign up here',
      hasAccount: 'Already have an account? Sign in here',
      loginSuccess: 'Login successful!',
      verifyBeforeLogin: 'Please verify your email address before signing in',
      enterEmail: 'Please enter your email address',
      fullNameRequired: 'Full name is required',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 8 characters long',
      emailRequired: 'Email address is required',
      passwordRequired: 'Password is required'
    }
  };

  const text = t[language];

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
        setError(text.fullNameRequired);
        scrollToError();
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(text.passwordMismatch);
        scrollToError();
        return false;
      }
      if (formData.password.length < 8) {
        setError(text.passwordTooShort);
        scrollToError();
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      setError(text.emailRequired);
      scrollToError();
      return false;
    }
    
    if (!formData.password.trim()) {
      setError(text.passwordRequired);
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
      setSuccess(text.loginSuccess);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);
    } else {
      if (result.needsVerification) {
        setError(text.verifyBeforeLogin);
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
      setError(text.enterEmail);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
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
                {text.verifyEmail}
              </h2>
              <p className="text-gray-600 mb-6">
                {text.verifyEmailDesc}
              </p>

              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50 error-message">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className={`text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className={`text-green-600 ${isRTL ? 'text-right' : 'text-left'}`}>
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
                  <div className={`animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                ) : (
                  <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                {text.resendVerification}
              </Button>

              <Button
                onClick={() => handleModeChange('login')}
                variant="ghost"
                className="text-sm text-gray-500"
              >
                {text.backToLogin}
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
                  {mode === 'login' ? text.login : text.register}
                </h2>
                <p className="text-gray-600">
                  {mode === 'login' ? text.loginSubtitle : text.registerSubtitle}
                </p>
              </div>

              {/* Google Login Button */}
              <Button
                onClick={handleGoogleLogin}
                className="w-full mb-4 bg-desert-100 hover:bg-desert-200 text-gray-700 border-2 border-gray-200 hover:border-desert-300"
              >
                <div className={`w-5 h-5 flex items-center justify-center ${isRTL ? 'ml-2' : 'mr-2'}`}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                {text.continueWithGoogle}
              </Button>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{text.or}</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={mode === 'login' ? handleEmailLogin : handleRegister} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {text.fullName}
                    </label>
                    <div className="relative">
                      <User className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={text.fullNamePlaceholder}
                        className={`w-full ${isRTL ? 'pl-10 pr-4 text-right' : 'pr-10 pl-4 text-left'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-500 focus:border-desert-500`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {text.email}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={text.emailPlaceholder}
                      className={`w-full ${isRTL ? 'pl-10 pr-4 text-right' : 'pr-10 pl-4 text-left'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-500 focus:border-desert-500`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {text.password}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={text.passwordPlaceholder}
                      className={`w-full ${isRTL ? 'pl-10 pr-10 text-right' : 'pr-10 pl-10 text-left'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-500 focus:border-desert-500`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {text.confirmPassword}
                    </label>
                    <div className="relative">
                      <Lock className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder={text.confirmPasswordPlaceholder}
                        className={`w-full ${isRTL ? 'pl-10 pr-4 text-right' : 'pr-10 pl-4 text-left'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-desert-500 focus:border-desert-500`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <Alert className="border-red-200 bg-red-50 error-message">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className={`text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className={`text-green-600 ${isRTL ? 'text-right' : 'text-left'}`}>
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
                    <div className={`animate-spin rounded-full h-4 w-4 border-2 border-desert-200 border-t-white ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  ) : (
                    <LogIn className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  )}
                  {mode === 'login' ? text.loginButton : text.registerButton}
                </Button>
              </form>

              {/* Toggle Login/Register */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                  className="text-sm text-desert-600 hover:text-desert-700 font-medium"
                >
                  {mode === 'login' ? text.noAccount : text.hasAccount}
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