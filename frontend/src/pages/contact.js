// TODO: Improve as others page to use desert color scheme
import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import config from '../config';
import { useAuth } from '../contexts/AuthContext';

const translations = {
  he: {
    title: "צור קשר",
    subtitle: "נשמח לשמוע ממך ולעזור בכל שאלה",
    name: "שם מלא",
    email: "אימייל",
    phone: "טלפון",
    subject: "נושא",
    message: "הודעה",
    namePlaceholder: "הזן את שמך המלא",
    emailPlaceholder: "הזן את כתובת האימייל שלך",
    phonePlaceholder: "הזן את מספר הטלפון שלך",
    subjectPlaceholder: "בחר נושא להודעה",
    messagePlaceholder: "כתב את הודעתך כאן...",
    send: "שלח הודעה",
    sending: "שולח...",
    required: "שדה חובה",
    invalidEmail: "כתובת אימייל לא תקינה",
    successMessage: "ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.",
    errorMessage: "שגיאה בשליחת ההודעה. אנא נסה שוב.",
    contactInfo: "פרטי יצירת קשר",
    emailLabel: "אימייל",
    phoneLabel: "טלפון",
    addressLabel: "כתובת"
  },
  en: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you and help with any questions",
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    subject: "Subject",
    message: "Message",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "Enter your email address",
    phonePlaceholder: "Enter your phone number",
    subjectPlaceholder: "Select a subject for your message",
    messagePlaceholder: "Write your message here...",
    send: "Send Message",
    sending: "Sending...",
    required: "Required field",
    invalidEmail: "Invalid email address",
    successMessage: "Message sent successfully! We'll get back to you soon.",
    errorMessage: "Error sending message. Please try again.",
    contactInfo: "Contact Information",
    emailLabel: "Email",
    phoneLabel: "Phone",
    addressLabel: "Address"
  }
};

export default function Contact() {
  const { language, isRTL } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t.required;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/contact`, {
        method: 'POST',
        credentials: 'include',  // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-desert-50 to-white py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-desert-800 mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitStatus && (
                <Alert className={`mb-6 ${submitStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={submitStatus === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {submitStatus === 'success' ? t.successMessage : t.errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t.name} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.namePlaceholder}
                    className={`mt-1 ${errors.name ? 'border-red-300' : ''}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t.email} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.emailPlaceholder}
                    className={`mt-1 ${errors.email ? 'border-red-300' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {t.phone}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.phonePlaceholder}
                    className="mt-1"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">
                    {t.subject}
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={t.subjectPlaceholder}
                    className="mt-1"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    {t.message} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t.messagePlaceholder}
                    rows={6}
                    className={`mt-1 resize-none ${errors.message ? 'border-red-300' : ''}`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-desert-600 hover:bg-desert-700 text-white py-3 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.send}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-desert-600" />
                  <div>
                    <p className="font-medium">{t.emailLabel}</p>
                    <p className="text-gray-600">treknahalprat@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-desert-600" />
                  <div>
                    <p className="font-medium">{t.phoneLabel}</p>
                    <p className="text-gray-600">{config.CONTACT.PHONE[language]}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-desert-600" />
                  <div>
                    <p className="font-medium">{t.addressLabel}</p>
                    <p className="text-gray-600">Jerusalem, Israel</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Contact */}
            <div className="bg-desert-light rounded-lg p-6">
              <h3 className="text-lg font-semibold text-desert-800 mb-3 flex items-center gap-2">
                <FaWhatsapp className="w-5 h-5 text-green-600" />
                {language === 'he' ? 'WhatsApp' : 'WhatsApp'}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'he' 
                  ? 'אנחנו זמינים גם בווטצאפ'
                  : 'We are available also on WhatsApp'}
              </p>
              <a
                href={`https://wa.me/${config.CONTACT.PHONE.en.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <FaWhatsapp className="w-4 h-4" />
                {language === 'he' ? 'פתח WhatsApp' : 'Open WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}