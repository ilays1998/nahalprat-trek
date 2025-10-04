import React, { useState, createContext, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Menu, X, Globe, Mountain, Calendar, ImageIcon, Package, BookOpen, ChevronRight, ArrowUp, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { Button } from "./components/ui/button";
import { LoginButton } from "./components/auth/LoginButton";
import { useAuth } from "./contexts/AuthContext";
import config from "./config";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  he: {
    home: "בית",
    packages: "מחיר",
    gallery: "גלריה",
    booking: "הזמנה",
    myBookings: "ההזמנות שלי",
    title: "טרק נחל פרת",
    subtitle: "חוויית טיול 3 ימים במדבר יהודה",
    bookNow: "הזמן עכשיו",
    contact: "צור קשר",
    followUs: "עקוב אחרינו",
    allRights: "כל הזכויות שמורות.",
    footerDesc: "חווה את מדבר יהודה בטרק מאורגן בהשראת הליכה אירופאית בין בקתות הרים.",
    logout: "התנתק",
    logoutConfirm: "האם אתה בטוח?",
    logoutMessage: "האם אתה בטוח שברצונך להתנתק מהמערכת?",
    cancel: "ביטול",
    loading: "טוען..."
  },
  en: {
    home: "Home",
    packages: "Pricing",
    gallery: "Gallery", 
    booking: "Booking",
    myBookings: "My Bookings",
    title: "Nahal Prat Trek",
    subtitle: "3-Day Desert Adventure",
    bookNow: "Book Now",
    contact: "Contact",
    followUs: "Follow Us",
    allRights: "All rights reserved.",
    footerDesc: "Experience the Judean Desert through an organized trek inspired by European hut-to-hut hiking.",
    logout: "Log Out",
    logoutConfirm: "Are you sure?",
    logoutMessage: "Are you sure you want to log out of the system?",
    cancel: "Cancel",
    loading: "Loading..."
  }
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [language, setLanguage] = useState('he');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  
  const t = translations[language];
  const isRTL = language === 'he';

  // Don't show navigation on auth callback page only
  const shouldShowNavigation = location.pathname !== '/auth/callback';

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigationItems = [
    { title: t.home, url: createPageUrl("Home"), icon: Mountain },
    { title: t.packages, url: createPageUrl("Packages"), icon: Package },
    { title: t.gallery, url: createPageUrl("Gallery"), icon: ImageIcon },
    { title: t.booking, url: createPageUrl("Booking"), icon: Calendar },
    { title: t.myBookings, url: createPageUrl("MyBookings"), icon: BookOpen },
    { title: t.contact, url: createPageUrl("Contact"), icon: Mail },
  ];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'he' ? 'en' : 'he');
  };

  return (
    <LanguageContext.Provider value={{ language, t, isRTL, toggleLanguage }}>
      <div className={`min-h-screen bg-gradient-to-b from-desert-50 via-white to-desert-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Navigation - Only show when authenticated */}
        {shouldShowNavigation && (
          <nav className="relative top-0 w-full bg-gradient-to-r from-desert-50 via-white to-desert-50 backdrop-blur-sm shadow-warm-lg border-b border-desert-200/30 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex items-center ${isRTL ? 'gap-3' : 'gap-6'}`}>
                {/* Logo */}
                <Link 
                  to={createPageUrl("Home")} 
                  className="flex items-center group"
                >
                  <div className="relative">
                    <div className="relative w-16 h-20 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                      <img src="/images/logo.png" alt="TNP Logo" className="w-full h-full object-contain drop-shadow-lg" />
                    </div>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <div className={`hidden lg:flex items-center gap-3 flex-1 ${isRTL ? 'justify-center' : 'justify-end'}`}>
                  {navigationItems.map((item, index) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`group relative overflow-hidden flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                        location.pathname === item.url
                          ? 'bg-desert-gradient text-white shadow-warm-lg transform scale-105 hover:scale-110'
                          : 'text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white border border-desert-200/50 hover:border-desert-300 hover:shadow-warm hover:transform hover:scale-105'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-desert-100/30 to-desert-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <item.icon className="relative w-4 h-4 group-hover:scale-110 transition-transform z-10" />
                      <span className="relative whitespace-nowrap z-10">{item.title}</span>
                    </Link>
                  ))}
                  
                  {/* Language Toggle */}
                  <Button
                    onClick={toggleLanguage}
                    className="relative overflow-hidden group px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 border border-desert-200/50 hover:border-desert-300 transition-all duration-300 shadow-lg hover:shadow-warm font-semibold flex items-center justify-between w-[80px] hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-desert-100/30 to-desert-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Globe className="relative w-4 h-4 z-10" />
                    <span className="relative font-semibold text-sm z-10">{language === 'he' ? 'EN' : 'עב'}</span>
                  </Button>

                  <LoginButton 
                    className="text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white border border-desert-200/50 hover:border-desert-300 font-semibold shadow-lg hover:shadow-warm hover:scale-105" 
                  />
                </div>

                {/* Mobile menu button and controls */}
                <div className="lg:hidden flex items-center gap-2">
                  {/* Mobile Language Toggle */}
                  <Button
                    onClick={toggleLanguage}
                    className="relative overflow-hidden group p-2 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 border border-desert-200/50 hover:border-desert-300 transition-all duration-300 shadow-lg hover:shadow-warm hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-desert-100/30 to-desert-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Globe className="relative w-5 h-5 z-10" />
                  </Button>

                  {/* Mobile menu toggle */}
                  <Button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="relative overflow-hidden group p-2 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 border border-desert-200/50 hover:border-desert-300 transition-all duration-300 shadow-lg hover:shadow-warm hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-desert-100/30 to-desert-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {mobileMenuOpen ? (
                      <X className="relative w-6 h-6 z-10" />
                    ) : (
                      <Menu className="relative w-6 h-6 z-10" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Mobile Navigation Menu */}
              <div className={`lg:hidden mt-4 transition-all duration-300 overflow-hidden ${
                mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="py-2 space-y-2 border-t border-desert-200/30">
                  {navigationItems.map((item, index) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group relative overflow-hidden flex items-center gap-3 px-3 py-2 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                        location.pathname === item.url
                          ? 'bg-desert-gradient text-white shadow-warm-lg'
                          : 'text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white border border-desert-200/50 hover:border-desert-300 hover:shadow-warm'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-desert-100/30 to-desert-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <item.icon className="relative w-5 h-5 group-hover:scale-110 transition-transform z-10" />
                      <span className="relative z-10">{item.title}</span>
                      <ChevronRight className="relative w-4 h-4 ml-auto z-10" />
                    </Link>
                  ))}
                  
                  {/* Mobile Login Button */}
                  <div className="mt-2 border-t border-desert-200/30 pt-2">
                    <LoginButton 
                      className="w-full text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white border border-desert-200/50 hover:border-desert-300 font-semibold shadow-lg hover:shadow-warm py-2 text-base flex items-center justify-center" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 bg-desert-gradient rounded-full shadow-warm-lg text-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
            showScrollTop 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Footer */}
        <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-desert-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-canyon-400 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-12 flex items-center justify-center">
                    <img src="/images/logo.png" alt="TNP Logo" className="w-full h-full object-contain drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl font-display font-bold">{t.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {t.footerDesc}
                </p>
              </div>
              
              <div>
                <h4 className="font-display font-semibold text-lg mb-4 text-desert-200">
                  {t.contact}
                </h4>
                <div className="space-y-3 text-gray-400">
                  <p className="flex items-center gap-2 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 bg-desert-400 rounded-full"></span>
                    treknahalprat@gmail.com
                  </p>
                  <p className="flex items-center gap-2 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 bg-desert-400 rounded-full"></span>
                    {config.CONTACT.PHONE[language]}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-display font-semibold text-lg mb-4 text-desert-200">
                  {t.followUs}
                </h4>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group">
                    <FaFacebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all duration-300 group">
                    <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300 group">
                    <FaYoutube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                  <a 
                    href={`https://wa.me/${config.CONTACT.PHONE.en.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-green-600 transition-all duration-300 group"
                  >
                    <FaWhatsapp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p className="text-sm text-gray-500">
                © 2024 {t.title}. {t.allRights}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}