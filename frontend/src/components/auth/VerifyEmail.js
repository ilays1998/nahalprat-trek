import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('קוד האימות חסר או לא תקין');
      return;
    }

    handleVerification(token);
  }, [searchParams]);

  const handleVerification = async (token) => {
    try {
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('אירעה שגיאה בעת אימות האימייל');
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/', { state: { openLogin: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
                מאמת את האימייל...
              </h1>
              <p className="text-gray-600">
                אנא המתן בזמן שאנו מאמתים את כתובת האימייל שלך
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
                אימות בוצע בהצלחה!
              </h1>
              <p className="text-gray-600 mb-6">
                {message || 'האימייל שלך אומת בהצלחה. כעת תוכל להתחבר לחשבון שלך.'}
              </p>
              <Button
                onClick={handleNavigateToLogin}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                התחבר לחשבון
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
                שגיאה באימות
              </h1>
              <p className="text-gray-600 mb-6">
                {message || 'אירעה שגיאה בעת אימות האימייל. ייתכן שהלינק פג תוקף או שאינו תקין.'}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleNavigateToLogin}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  נסה להתחבר
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                >
                  חזור לעמוד הבית
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;