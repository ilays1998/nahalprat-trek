
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrekDate, Booking } from "../entities/all";
import { createPageUrl } from "../utils";
import { scrollToError } from "../components/navigation/ScrollToError";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Checkbox } from "../components/ui/checkbox";
import { CalendarIcon, Users, Phone, AlertCircle, CheckCircle } from "lucide-react";
import { format, parseISO, isAfter, startOfDay, addDays } from "date-fns";
import { useLanguage } from "../layout";
import { useAuth } from "../contexts/AuthContext";
import { useConfig } from "../contexts/ConfigContext";

export default function BookingPage() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();

  const { getPackage, loading: configLoading } = useConfig();
  const standardPackage = getPackage("standard");
  const packagePrice = standardPackage?.price_per_person || 0;

  const currency = standardPackage?.currency || "ILS";

  const currencySymbols = {
    ILS: "₪",
    USD: "$",
    EUR: "€"
  };

  
  const getDefaultNamesFromUser = (currentUser) => {
    const fullName = (currentUser?.name || "").trim();
    if (!fullName) return { firstName: "", lastName: "" };
    const parts = fullName.split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    const lastName = parts.pop();
    const firstName = parts.join(" ");
    return { firstName, lastName };
  };
  const defaultNames = getDefaultNamesFromUser(user);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: defaultNames.firstName,
    last_name: defaultNames.lastName,
    email: user?.email || '',
    phone: '',
    package_type: 'standard',  // Single package system
    participants_count: 1,
    special_requests: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    terms_consent: false,
    language: language
  });

  useEffect(() => {
    loadAvailableDates();
  }, []);

  // No package selection needed - single package system

  const loadAvailableDates = async () => {
    const dates = await TrekDate.list();
    // Filter out past dates
    const today = startOfDay(new Date());
    const futureDates = dates.filter(date => {
      const startDate = parseISO(date.start_date);
      return isAfter(startDate, today);
    });
    setAvailableDates(futureDates);
  };

  // If user info arrives after mount, prefill empty name/email fields
  useEffect(() => {
    if (user) {
      const names = getDefaultNamesFromUser(user);
      setFormData((prev) => ({
        ...prev,
        first_name: prev.first_name || names.firstName,
        last_name: prev.last_name || names.lastName,
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const getAvailableSpots = (date) => {
    if (!date) return 0;
    return date.available_spots || 0;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    return getAvailableSpots(date) > 0;
  };

  const getAvailableDates = () => {
    return availableDates
      .filter(date => isDateAvailable(date))
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  };

  const content = {
    he: {
      title: "הזמנת טיול",
      subtitle: "מלא את הפרטים והזמן את מקומך בטרק נחל פרת",
      personalInfo: "פרטים אישיים",
      trekDetails: "פרטי הטיול",
      emergencyContact: "איש קשר נוסף",
      packageName: "טרק נחל פרת",
      fields: {
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        email: "כתובת אימייל",
        phone: "טלפון",
        date: "בחר תאריך",
        participants: "מספר משתתפים",
        specialRequests: "בקשות מיוחדות",
        emergencyName: "שם איש קשר",
        emergencyPhone: "טלפון איש קשר"
      },
      placeholders: {
        specialRequests: "דיאטה מיוחדת, אלרגיות, או בקשות אחרות...",
        emergencyName: "שם מלא של איש הקשר",
        emergencyPhone: "מספר טלפון של איש הקשר"
      },
      bookNow: "הזמן עכשיו",
      totalPrice: "מחיר כולל",
      perPerson: "לאדם",
      availableSpots: "מקומות פנויים",
      noAvailableDates: "אין תאריכים זמינים כרגע",
      successMessage: "בקשת ההזמנה נשלחה בהצלחה! קיבלת אימייל אישור ונחזור אליך בקרוב.",
      errorMessage: "אירעה שגיאה. אנא נסה שוב.",
      step1: "שלב 1: בחירת תאריך",
      step2: "שלב 2: פרטים אישיים",
      step1Subtitle: "בחר את תאריך ההתחלה לטרק של 3 ימים",
      trekDuration: "טיול של 3 ימים, 2 לילות",
      selectDateFirst: "אנא בחר תאריך כדי להמשיך",
      required: "שדה חובה",
      invalidEmail: "כתובת אימייל לא תקינה",
      invalidPhone: "מספר טלפון לא תקין (נדרש פורמט ישראלי או בינלאומי)",
      termsConsent: {
        prefix: "אני מסכים/ה ל",
        terms: "תנאי השימוש",
        and: " ול",
        privacy: "מדיניות הפרטיות"
      },
      termsRequired: "יש לאשר את תנאי השימוש"
    },
    en: {
      title: "Book Your Trek",
      subtitle: "Fill in your details and reserve your spot on the Nahal Prat trek",
      personalInfo: "Personal Information",
      trekDetails: "Trek Details",
      emergencyContact: "Contact Person",
      packageName: "Nahal Prat Trek",
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        date: "Select Date",
        participants: "Number of Participants",
        specialRequests: "Special Requests",
        emergencyName: "Contact Name",
        emergencyPhone: "Contact Phone"
      },
      placeholders: {
        specialRequests: "Special diet, allergies, or other requests...",
        emergencyName: "Full name of contact person",
        emergencyPhone: "Contact phone number"
      },
      bookNow: "Book Now",
      totalPrice: "Total Price",
      perPerson: "per person",
      availableSpots: "Available Spots",
      noAvailableDates: "No available dates at the moment",
      successMessage: "Booking request submitted successfully! You've received a confirmation email and we'll get back to you soon.",
      errorMessage: "An error occurred. Please try again.",
      step1: "Step 1: Select Date",
      step2: "Step 2: Personal Details",
      step1Subtitle: "Choose your starting date for the 3-day trek",
      trekDuration: "3-day trek, 2 nights",
      selectDateFirst: "Please select a date to continue",
      required: "Required field",
      invalidEmail: "Invalid email address",
      invalidPhone: "Invalid phone number (Israeli or international format required)",
      termsConsent: {
        prefix: "I agree to the ",
        terms: "terms and conditions",
        and: " and ",
        privacy: "privacy policy"
      },
      termsRequired: "You must agree to the terms and conditions"
    }
  };

  const currentContent = content[language];

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Remove all spaces, dashes, and parentheses for validation
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Israeli mobile: 05X-XXX-XXXX (10 digits starting with 05)
    const israeliMobile = /^05[0-9]\d{7}$/;
    
    // Israeli landline: 0X-XXX-XXXX (9 digits starting with 0, not 05)
    const israeliLandline = /^0[2-4,8-9]\d{7}$/;
    
    // International: +XX-XXX-XXX-XXXX (starts with +, 7-15 digits total)
    const international = /^\+\d{7,15}$/;
    
    return israeliMobile.test(cleanPhone) || israeliLandline.test(cleanPhone) || international.test(cleanPhone);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = currentContent.required;
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = currentContent.required;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = currentContent.required;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = currentContent.invalidEmail;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = currentContent.required;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = currentContent.invalidPhone;
    }
    
    if (!formData.emergency_contact_name.trim()) {
      newErrors.emergency_contact_name = currentContent.required;
    }
    
    if (!formData.emergency_contact_phone.trim()) {
      newErrors.emergency_contact_phone = currentContent.required;
    } else if (!validatePhone(formData.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = currentContent.invalidPhone;
    }
    
    if (!formData.terms_consent) {
      newErrors.terms_consent = currentContent.termsRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const calculateTotalPrice = () => {
    return packagePrice  * formData.participants_count;  // packagePrice  NIS per person
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      scrollToError();
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      if (!selectedDate) {
        throw new Error('Please select a date');
      }

      const bookingData = {
        ...formData,
        trek_date: format(selectedDate, 'yyyy-MM-dd'),
        total_price: calculateTotalPrice(),
        language: language
        // Status will be 'pending' by default from the entity schema
      };

      await Booking.create(bookingData);
      
      // Reload available dates to reflect updated spots
      await loadAvailableDates();

      setSuccess(true);
      
      // Scroll to center the success message in viewport
      setTimeout(() => {
        const successElement = document.querySelector('.success-message-container');
        if (successElement) {
          successElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
        }
      }, 100);
      
      // Reset form
      setFormData({
        first_name: getDefaultNamesFromUser(user).firstName,
        last_name: getDefaultNamesFromUser(user).lastName,
        email: user?.email || '',
        phone: '',
        package_type: '',
        participants_count: 1,
        special_requests: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        terms_consent: false,
        language: language
      });
      setSelectedDate(null);
      // Optionally reload available dates to reflect changes if the booking logic was server-side and updated spots immediately.
      // await loadAvailableDates(); 

    } catch (err) {
      setError(currentContent.errorMessage);
      scrollToError();
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 success-message-container">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center border-none shadow-xl">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'he' ? 'תודה!' : 'Thank You!'}
              </h2>
              <p className="text-gray-600 mb-8">
                {currentContent.successMessage}
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setSuccess(false)}
                  className="w-full bg-desert-600 text-white hover:opacity-90"
                >
                  {language === 'he' ? 'הזמנה נוספת' : 'Book Another'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = createPageUrl("MyBookings")}
                  className="w-full border-desert-200 text-desert-600 hover:bg-desert-50"
                >
                  {language === 'he' ? 'צפה בהזמנות שלי' : 'View My Bookings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const availableBookingDates = getAvailableDates();
  const today = startOfDay(new Date());

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-desert-50 to-desert-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-desert-800 mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 error-message">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Package Information */}
        <Card className="border-none shadow-lg mb-8 bg-desert-light">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentContent.packageName}</h2>
              <div className="text-4xl font-bold text-desert-600 mb-2">
                {currencySymbols[currency]}{packagePrice.toLocaleString()}
              </div>
              <p className="text-gray-600">{currentContent.perPerson}</p>
              <div className="mt-4 text-sm text-gray-500">
                {currentContent.trekDuration}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Step 1: Date Selection */}
        {(
          <Card className="border-none shadow-lg mb-8 bg-gradient-to-r from-desert-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                {currentContent.step1}
                <div className="text-sm font-normal text-gray-600 mt-2">
                  {currentContent.step1Subtitle}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getAvailableDates().length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      disabled={(date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isPast = date < today;
                        const isNotAvailable = !getAvailableDates().some(d => d.start_date === dateStr);
                        return isPast || isNotAvailable;
                      }}
                      className="rounded-md border"
                    />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      {language === 'he' ? 'תאריכים זמינים:' : 'Available Dates:'}
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto" id="available-dates-container">
                      {getAvailableDates().map((date) => {
                        const spots = getAvailableSpots(date);
                        const startDate = parseISO(date.start_date);
                        const endDate = parseISO(date.end_date);
                        const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === date.start_date;
                        return (
                          <div 
                            key={date.id}
                            id={`date-${date.id}`}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-desert-500 bg-desert-200 shadow-lg'
                                : 'border-gray-200 hover:border-desert-300 hover:bg-desert-50'
                            }`}
                            onClick={() => {
                              setSelectedDate(startDate);
                              setCalendarMonth(startDate);
                              // Auto-scroll to selected date
                              setTimeout(() => {
                                const element = document.getElementById(`date-${date.id}`);
                                if (element) {
                                  element.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'center' 
                                  });
                                }
                              }, 100);
                            }}

                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">
                                  {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                                </p>
                                <p className="text-xs text-gray-500 mb-1">
                                  {currentContent.trekDuration}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {date.weather_notes}
                                </p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={
                                  spots > 0 
                                    ? isSelected 
                                      ? "bg-desert-200 text-green-700 border-desert-300" 
                                      : "bg-desert-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                                }
                              >
                                {spots} {currentContent.availableSpots}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {currentContent.noAvailableDates}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal Information Form */}
        {selectedDate && (
          <form onSubmit={handleSubmit} className="space-y-10">
            <Card className="border-none shadow-lg bg-gradient-to-r from-desert-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {currentContent.step2}
                  <div className="text-sm font-normal text-gray-600 mt-2">
                    {format(selectedDate, 'MMM d')} - {format(addDays(selectedDate, 2), 'MMM d, yyyy')}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-5 rounded-xl border border-gray-100 bg-white/60 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-desert-600" />
                      {currentContent.personalInfo}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === 'he' ? 'נשתמש בפרטים האלו כדי ליצור קשר בנוגע להזמנה שלך.' : 'We will use these details to contact you about your booking.'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="firstName">
                          {currentContent.fields.firstName} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          className={`mt-2 ${errors.first_name ? 'border-red-300' : ''}`}
                          placeholder={language === 'he' ? 'יוסי' : 'John'}
                          autoComplete="given-name"
                        />
                        {errors.first_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">
                          {currentContent.fields.lastName} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName" 
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className={`mt-2 ${errors.last_name ? 'border-red-300' : ''}`}
                          placeholder={language === 'he' ? 'כהן' : 'Doe'}
                          autoComplete="family-name"
                        />
                        {errors.last_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">
                        {currentContent.fields.email} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="text"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`mt-2 ${errors.email ? 'border-red-300' : ''}`}
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">
                        {currentContent.fields.phone} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`mt-2 ${errors.phone ? 'border-red-300' : ''}`}
                        placeholder={language === 'he' ? '050-123-4567' : '+1 (555) 123-4567'}
                        autoComplete="tel"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Trek Details */}
                  <div className="space-y-5 rounded-xl border border-gray-100 bg-white/60 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-desert-600" />
                      {currentContent.trekDetails}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === 'he' ? 'בחר את מספר המשתתפים והוסף בקשות מיוחדות במידת הצורך.' : 'Choose the number of participants and add any special requests.'}
                    </p>

                    <div>
                      <Label htmlFor="participants">{currentContent.fields.participants}</Label>
                      <Select
                        value={formData.participants_count}
                        onChange={e => handleInputChange('participants_count', Number(e.target.value))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: Math.min(10, getAvailableSpots(getAvailableDates().find(d => d.start_date === format(selectedDate, 'yyyy-MM-dd'))))}, (_, i) => i + 1).map(num => (
                            <SelectItem key={num} value={num}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                    </div>

                    <div>
                      <Label>{currentContent.fields.specialRequests}</Label>
                      <Textarea
                        value={formData.special_requests}
                        onChange={(e) => handleInputChange('special_requests', e.target.value)}
                        placeholder={currentContent.placeholders.specialRequests}
                        className="mt-2 h-24"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Phone className="w-5 h-5 text-desert-600" />
                    {currentContent.emergencyContact}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {language === 'he' ? 'ניצור קשר רק במקרה הצורך.' : 'We will contact this person only in case of need.'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="emergencyName">
                        {currentContent.fields.emergencyName} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="emergencyName"
                        value={formData.emergency_contact_name}
                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                        placeholder={currentContent.placeholders.emergencyName}
                        className={`mt-2 ${errors.emergency_contact_name ? 'border-red-300' : ''}`}
                        autoComplete="name"
                      />
                      {errors.emergency_contact_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">
                        {currentContent.fields.emergencyPhone} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                        placeholder={currentContent.placeholders.emergencyPhone}
                        className={`mt-2 ${errors.emergency_contact_phone ? 'border-red-300' : ''}`}
                        autoComplete="tel"
                      />
                      {errors.emergency_contact_phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions Consent */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Checkbox
                      id="terms-consent"
                      checked={formData.terms_consent}
                      onCheckedChange={(checked) => handleInputChange('terms_consent', checked)}
                      className={`mt-1 ${errors.terms_consent ? 'border-red-300' : ''}`}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor="terms-consent" 
                        className="text-sm font-medium cursor-pointer"
                      >
                        {currentContent.termsConsent.prefix}
                        <Link 
                          to="/terms" 
                          className="text-desert-600 hover:text-desert-700 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {currentContent.termsConsent.terms}
                        </Link>
                        {currentContent.termsConsent.and}
                        <Link 
                          to="/privacy" 
                          className="text-desert-600 hover:text-desert-700 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {currentContent.termsConsent.privacy}
                        </Link>
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      {errors.terms_consent && (
                        <p className="mt-1 text-sm text-red-600">{errors.terms_consent}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary & Submit */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-desert-50 to-orange-50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center md:text-left">
                    <div className="space-y-2">
                      <p className="text-lg text-gray-600">
                        {currentContent.packageName} × {formData.participants_count}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(selectedDate, 'MMM d')} - {format(addDays(selectedDate, 2), 'MMM d, yyyy')}
                      </p>
                      <div className="text-3xl font-bold text-desert-600">
                        {currentContent.totalPrice}: ₪{calculateTotalPrice().toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="bg-desert-bold text-white hover:opacity-90 text-lg px-12 py-4 rounded-xl shadow-warm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {language === 'he' ? 'שולח...' : 'Booking...'}
                      </div>
                    ) : (
                      currentContent.bookNow
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {!selectedDate && (
          <div className="text-center py-8 text-gray-500">
            {currentContent.selectDateFirst}
          </div>
        )}
      </div>
    </div>
  );
}
