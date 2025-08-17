
import React, { useState, useEffect } from "react";
import { TrekDate, Booking } from "../entities/all";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CalendarIcon, Users, Phone, AlertCircle, CheckCircle } from "lucide-react";
import { format, parseISO, isAfter, startOfDay, addDays } from "date-fns";
import { useLanguage } from "../layout";
import { useAuth } from "../contexts/AuthContext";

export default function BookingPage() {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  
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
  const [selectedPackage, setSelectedPackage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    first_name: defaultNames.firstName,
    last_name: defaultNames.lastName,
    email: user?.email || '',
    phone: '',
    package_type: '',
    participants_count: 1,
    special_requests: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    language: language
  });

  useEffect(() => {
    loadAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({ ...prev, package_type: selectedPackage }));
    }
  }, [selectedPackage]);

  const loadAvailableDates = async () => {
    const dates = await TrekDate.list();
    // Filter out past dates
    const today = startOfDay(new Date());
    const futureDates = dates.filter(date => {
      const startDate = parseISO(date.start_date);
      return isAfter(startDate, today) || startDate.getTime() === today.getTime();
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

  const getAvailableSpots = (date, packageType) => {
    if (!date || !packageType) return 0;
    const field = `available_spots_${packageType}`;
    return date[field] || 0;
  };

  const isDateAvailable = (date, packageType) => {
    if (!packageType || !date) return false;
    return getAvailableSpots(date, packageType) > 0;
  };

  const getAvailableDatesForPackage = (packageType) => {
    if (!packageType) return [];
    return availableDates.filter(date => isDateAvailable(date, packageType));
  };

  const content = {
    he: {
      title: "הזמנת טיול",
      subtitle: "מלא את הפרטים והזמן את מקומך במסלול נחל פרת",
      personalInfo: "פרטים אישיים",
      trekDetails: "פרטי הטיול",
      emergencyContact: "איש קשר לחירום",
      packagePrices: {
        basic: "₪1,000",
        pro: "₪2,000", 
        premium: "₪3,000"
      },
      packageNames: {
        basic: "בסיסי",
        pro: "מקצועי",
        premium: "פרימיום"
      },
      fields: {
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        email: "כתובת אימייל",
        phone: "טלפון",
        package: "בחר חבילה",
        date: "בחר תאריך",
        participants: "מספר משתתפים",
        specialRequests: "בקשות מיוחדות",
        emergencyName: "שם איש קשר",
        emergencyPhone: "טלפון איש קשר"
      },
      placeholders: {
        specialRequests: "דיאטה מיוחדת, אלרגיות, או בקשות אחרות...",
        emergencyName: "שם מלא של איש הקשר לחירום",
        emergencyPhone: "מספר טלפון של איש הקשר"
      },
      bookNow: "הזמן עכשיו",
      totalPrice: "מחיר כולל",
      perPerson: "לאדם",
      availableSpots: "מקומות פנויים",
      selectPackageFirst: "בחר חבילה תחילה כדי לראות תאריכים זמינים",
      noAvailableDates: "אין תאריכים פנויים לחבילה זו",
      successMessage: "בקשת ההזמנה נשלחה בהצלחה! נאשר אותה ונחזור אליך בקרוב.",
      errorMessage: "אירעה שגיאה. אנא נסה שוב.",
      step1: "שלב 1: בחירת חבילה",
      step2: "שלב 2: בחירת תאריך",
      step3: "שלב 3: פרטים אישיים",
      trekDuration: "טיול של 3 ימים"
    },
    en: {
      title: "Book Your Trek",
      subtitle: "Fill in your details and reserve your spot on the Nahal Prat trek",
      personalInfo: "Personal Information",
      trekDetails: "Trek Details",
      emergencyContact: "Emergency Contact",
      packagePrices: {
        basic: "₪1,000",
        pro: "₪2,000",
        premium: "₪3,000"
      },
      packageNames: {
        basic: "Basic",
        pro: "Pro",
        premium: "Premium"
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        package: "Select Package",
        date: "Select Date",
        participants: "Number of Participants",
        specialRequests: "Special Requests",
        emergencyName: "Emergency Contact Name",
        emergencyPhone: "Emergency Contact Phone"
      },
      placeholders: {
        specialRequests: "Special diet, allergies, or other requests...",
        emergencyName: "Full name of emergency contact",
        emergencyPhone: "Emergency contact phone number"
      },
      bookNow: "Book Now",
      totalPrice: "Total Price",
      perPerson: "per person",
      availableSpots: "Available Spots",
      selectPackageFirst: "Select a package first to see available dates",
      noAvailableDates: "No available dates for this package",
      successMessage: "Booking request submitted successfully! We'll review and get back to you soon.",
      errorMessage: "An error occurred. Please try again.",
      step1: "Step 1: Choose Package",
      step2: "Step 2: Select Date", 
      step3: "Step 3: Personal Details",
      trekDuration: "3-day trek"
    }
  };

  const currentContent = content[language];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalPrice = () => {
    const prices = { basic: 1000, pro: 2000, premium: 3000 };
    return (prices[formData.package_type] || 0) * formData.participants_count;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      
      // Update available spots
      const selectedDateData = availableDates.find(d => d.start_date === format(selectedDate, 'yyyy-MM-dd'));
      if (selectedDateData) {
        const field = `available_spots_${formData.package_type}`;
        // This is a client-side prediction, actual spots will be managed on backend
        // For now, we don't decrement client-side to prevent misleading UI if backend fails.
        // We just reload the dates if needed, or rely on the success message.
      }

      setSuccess(true);
      
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
        language: language
      });
      setSelectedDate(null);
      setSelectedPackage('');
      // Optionally reload available dates to reflect changes if the booking logic was server-side and updated spots immediately.
      // await loadAvailableDates(); 

    } catch (err) {
      setError(currentContent.errorMessage);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
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
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90"
                >
                  {language === 'he' ? 'הזמנה נוספת' : 'Book Another'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = createPageUrl("MyBookings")}
                  className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
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

  const packageDates = getAvailableDatesForPackage(selectedPackage);
  const today = startOfDay(new Date());

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Package Selection */}
        <Card className="border-none shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{currentContent.step1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(currentContent.packageNames).map(([key, name]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPackage === key 
                      ? 'ring-2 ring-amber-300 bg-amber-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedPackage(key)}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
                    <div className="text-2xl font-bold text-amber-600 mb-2">
                      {currentContent.packagePrices[key]}
                    </div>
                    <p className="text-gray-500 text-sm">{currentContent.perPerson}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Date Selection */}
        {selectedPackage && (
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{currentContent.step2}</CardTitle>
            </CardHeader>
            <CardContent>
              {packageDates.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isPast = date < today;
                        const isNotAvailable = !packageDates.some(d => d.start_date === dateStr);
                        return isPast || isNotAvailable;
                      }}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      {language === 'he' ? 'תאריכים זמינים:' : 'Available Dates:'}
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {packageDates.map((date) => {
                        const spots = getAvailableSpots(date, selectedPackage);
                        const startDate = parseISO(date.start_date);
                        const endDate = parseISO(date.end_date);
                        return (
                          <div 
                            key={date.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedDate && format(selectedDate, 'yyyy-MM-dd') === date.start_date
                                ? 'border-amber-300 bg-amber-50'
                                : 'border-gray-200 hover:border-amber-200'
                            }`}
                            onClick={() => setSelectedDate(startDate)}
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
                                className={spots > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
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

        {/* Step 3: Personal Information Form */}
        {selectedPackage && selectedDate && (
          <form onSubmit={handleSubmit} className="space-y-10">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{currentContent.step3}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-5 rounded-xl border border-gray-100 bg-white/60 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-600" />
                      {currentContent.personalInfo}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === 'he' ? 'נשתמש בפרטים האלו כדי ליצור קשר בנוגע להזמנה שלך.' : 'We will use these details to contact you about your booking.'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="firstName">{currentContent.fields.firstName}</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          className="mt-2"
                          placeholder={language === 'he' ? 'יוסי' : 'John'}
                          autoComplete="given-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{currentContent.fields.lastName}</Label>
                        <Input
                          id="lastName" 
                          required
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className="mt-2"
                          placeholder={language === 'he' ? 'כהן' : 'Doe'}
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">{currentContent.fields.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-2"
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">{currentContent.fields.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-2"
                        placeholder={language === 'he' ? '050-123-4567' : '+1 (555) 123-4567'}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  {/* Trek Details */}
                  <div className="space-y-5 rounded-xl border border-gray-100 bg-white/60 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-amber-600" />
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
                          {Array.from({length: Math.min(10, getAvailableSpots(packageDates.find(d => d.start_date === format(selectedDate, 'yyyy-MM-dd')), selectedPackage))}, (_, i) => i + 1).map(num => (
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
                    <Phone className="w-5 h-5 text-amber-600" />
                    {currentContent.emergencyContact}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {language === 'he' ? 'ניצור קשר רק במקרה חירום.' : 'We will contact this person only in case of emergency.'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="emergencyName">{currentContent.fields.emergencyName}</Label>
                      <Input
                        id="emergencyName"
                        required
                        value={formData.emergency_contact_name}
                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                        placeholder={currentContent.placeholders.emergencyName}
                        className="mt-2"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">{currentContent.fields.emergencyPhone}</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        required
                        value={formData.emergency_contact_phone}
                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                        placeholder={currentContent.placeholders.emergencyPhone}
                        className="mt-2"
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary & Submit */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center md:text-left">
                    <div className="space-y-2">
                      <p className="text-lg text-gray-600">
                        {currentContent.packageNames[selectedPackage]} × {formData.participants_count}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(selectedDate, 'MMM d')} - {format(addDays(selectedDate, 2), 'MMM d, yyyy')}
                      </p>
                      <div className="text-3xl font-bold text-amber-600">
                        {currentContent.totalPrice}: ₪{calculateTotalPrice().toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90 text-lg px-12 py-4"
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

        {!selectedPackage && (
          <div className="text-center py-8 text-gray-500">
            {currentContent.selectPackageFirst}
          </div>
        )}
      </div>
    </div>
  );
}
