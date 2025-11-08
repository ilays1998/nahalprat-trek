import React, { useState, createContext, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Menu, X, Globe, Mountain, Calendar, ImageIcon, Package, BookOpen, ChevronRight, ArrowUp, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { Button } from "./components/ui/button";
import { LoginButton } from "./components/auth/LoginButton";
import { useAuth } from "./contexts/AuthContext";
import config from "./config";
import { LanguageToggle } from "./components/ui/LanguageToggle";
import { cfImage } from "./utils/image";

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
    footerDesc: "חווה את מדבר יהודה בטרק בהשראת הליכה אירופאית בין בקתות הרים.",
    logout: "התנתק",
    logoutConfirm: "האם אתה בטוח?",
    logoutMessage: "האם אתה בטוח שברצונך להתנתק מהמערכת?",
    cancel: "ביטול",
    loading: "טוען...",
    terms: "תקנון ותנאי שימוש",
    privacy: "מדיניות פרטיות",
    accessibility: "הצהרת נגישות"
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
    footerDesc: "Experience the Judean Desert through a trek inspired by European hut-to-hut hiking.",
    logout: "Log Out",
    logoutConfirm: "Are you sure?",
    logoutMessage: "Are you sure you want to log out of the system?",
    cancel: "Cancel",
    loading: "Loading...",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    accessibility: "Accessibility Statement"
  }
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [language, setLanguage] = useState(() => {
    // Load language from localStorage, default to 'he' if not found
    return localStorage.getItem('preferred-language') || 'he';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAuthenticated, loading } = useAuth();
  
  const t = translations[language];
  const isRTL = language === 'he';

  // Don't show navigation on auth callback page only
  const shouldShowNavigation = location.pathname !== '/auth/callback';
  
  // Check if we're on the home page to use transparent styling
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setShowScrollTop(currentScrollY > 300);
      setScrolled(currentScrollY > 50);
      
      // Hide navbar when scrolling down past 150px
      if (currentScrollY > 150) {
        setShowNav(false);
      } else {
        // Only show when near the top (within 150px)
        setShowNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    setLanguage(prev => {
      const newLanguage = prev === 'he' ? 'en' : 'he';
      // Save the new language preference to localStorage
      localStorage.setItem('preferred-language', newLanguage);
      return newLanguage;
    });
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  }, [mobileMenuOpen]);


  return (
    <LanguageContext.Provider value={{ language, t, isRTL, toggleLanguage }}>
      <div className={`min-h-screen bg-gradient-to-b from-desert-50 via-white to-desert-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Navigation - Only show when authenticated */}
        {shouldShowNavigation && (
          <>
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
            
            <nav 
              className={`fixed top-0 left-0 right-0 w-full backdrop-blur-md shadow-desert-bar border-b py-0.5 sm:py-2 md:py-3 z-[9999] transition-transform duration-300 ${
                isHomePage 
                  ? 'bg-white/15 border-white/20'
                  : 'bg-desert-solid border-desert-soft'
              } ${showNav ? 'transform translate-y-0' : 'transform -translate-y-full'}`}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0
              }}
            >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 h-[54px] sm:h-[64px]">
                {/* Logo */}
                <Link 
                  to={createPageUrl("Home")} 
                  className="flex items-center group flex-shrink-0 mt-5 sm:mt-0"
                >
                  <div className="relative">
                    <div className="relative w-12 h-16 md:w-16 md:h-20 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                      <img src={cfImage("/images/logo/logo.png")} alt="TNP Logo" className="w-full h-full object-contain drop-shadow-lg" />
                    </div>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center justify-center flex-1">
                  <div className="flex items-center gap-3">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className={`group relative overflow-hidden flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          location.pathname === item.url
                            ? isHomePage
                              ? 'bg-white/20 text-white shadow-xl backdrop-blur-lg border border-white/20 transform scale-105'
                              : 'bg-[#c56f19] text-white shadow-xl transform scale-105 border border-[#dca359]/50'
                            : isHomePage
                              ? 'text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/20 hover:transform hover:scale-105'
                              : 'text-[#743f1f] hover:text-[#3e2211] bg-[#f7e9cd]/80 hover:bg-[#f1ddb8] border border-[#e3c992] hover:border-[#dca359] hover:transform hover:scale-105'
                        }`}
                        style={{ animation: location.pathname === item.url ? 'gentlePulse 3s infinite' : 'none' }}
                      >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${
                          isHomePage ? 'bg-gradient-to-r from-white/20 to-white/30' : 'bg-[#dca359]/25'
                        }`}></div>
                        <item.icon className="relative w-4 h-4 group-hover:scale-110 transition-transform z-10 flex-shrink-0" />
                        <span className="relative whitespace-nowrap z-10">{item.title}</span>
                      </Link>
                    ))}
                    <LanguageToggle
                      language={language}
                      onToggle={toggleLanguage}
                      variant="desktop"
                      transparent={isHomePage}
                    />
                    <LoginButton
                      transparent={isHomePage}
                    />
                  </div>
                </div>

                {/* Mobile menu button and controls */}
                <div className="lg:hidden flex items-center gap-3 mt-6 sm:mt-0">
                  <LanguageToggle
                    language={language}
                    onToggle={toggleLanguage}
                    variant="mobile"
                    transparent={isHomePage}
                  />
                  {/* Mobile menu toggle */}
                  <button
                    type="button"
                    aria-label={
                      mobileMenuOpen
                        ? language === "he"
                          ? "סגור תפריט"
                          : "Close menu"
                        : language === "he"
                        ? "פתח תפריט"
                        : "Open menu"
                    }
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`relative group h-11 w-11 inline-flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#dca359]/60
                      ${
                        isHomePage
                          ? mobileMenuOpen
                            ? "bg-white/20 text-white shadow-xl backdrop-blur-lg border border-white/20 transform scale-105 hover:scale-110 hover:shadow-2xl hover:bg-white/25"
                            : "bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30"
                          : "bg-[#f7e9cd]/80 hover:bg-[#f1ddb8] border border-[#e3c992]"
                      }`}
                  >
                    <span className="sr-only">Menu</span>

                    {/* Top bar */}
                    <span
                      className={`absolute h-0.5 w-6 origin-center rounded-full transition-all duration-400 ease-out ${
                        mobileMenuOpen
                          ? isHomePage
                            ? "rotate-45 translate-y-0 bg-white/80"
                            : "rotate-45 translate-y-0 bg-[#c56f19]"
                          : isHomePage
                          ? "-translate-y-2 bg-white/80 group-hover:bg-white"
                          : "-translate-y-2 bg-gray-600 group-hover:bg-gray-900"
                      }`}
                    ></span>

                    {/* Middle bar */}
                    <span
                      className={`absolute h-0.5 w-6 rounded-full transition-all duration-400 ease-out ${
                        mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                      } ${
                        isHomePage
                          ? "bg-white/80 group-hover:bg-white"
                          : "bg-gray-600 group-hover:bg-gray-900"
                      }`}
                    ></span>

                    {/* Bottom bar */}
                    <span
                      className={`absolute h-0.5 w-6 origin-center rounded-full transition-all duration-400 ease-out ${
                        mobileMenuOpen
                          ? isHomePage
                            ? "-rotate-45 translate-y-0 bg-white/80"
                            : "-rotate-45 translate-y-0 bg-[#c56f19]"
                          : isHomePage
                          ? "translate-y-2 bg-white/80 group-hover:bg-white"
                          : "translate-y-2 bg-gray-600 group-hover:bg-gray-900"
                      }`}
                    ></span>
                  </button>

                </div>
              </div>

              {/* Mobile Navigation Menu */}
              <div
                id="mobile-navigation"
                className={`lg:hidden mt-6 transition-all duration-500 ease-in-out overflow-hidden ${
                  mobileMenuOpen ? 'max-h-[85vh] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
                }`}
              >
                <div
                  className={`relative flex flex-col gap-2 rounded-2xl mx-2 pb-4 pt-4 px-2 backdrop-blur-xl overflow-hidden border shadow-lg ${
                    isHomePage
                      ? 'bg-gradient-to-br from-white/15 via-white/10 to-white/5 border-white/25'
                      : 'bg-desert-solid border-desert-soft'
                  }`}
                  style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 92%, transparent 100%)' }}
                >
                  <div className="overflow-y-auto overscroll-contain max-h-[60vh] px-1 pr-2 mobile-menu-scroll">
                  {navigationItems.map((item, index) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative group flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:[#dca359]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                        location.pathname === item.url
                          ? isHomePage
                            ? 'bg-white/15 text-white shadow-md'
                            : 'bg-[#c56f19] text-white shadow-sm'
                          : isHomePage
                            ? 'text-white/80 hover:text-white hover:bg-white/10'
                            : 'text-[#743f1f] hover:text-[#3e2211] hover:bg-[#f1ddb8]/70'
                      }`}
                      style={{ animation: mobileMenuOpen ? `fadeScaleIn 0.4s ${index * 40}ms both` : 'none' }}
                    >
                      <span className={`absolute left-2 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-gradient-to-b ${
                        location.pathname === item.url
                          ? isHomePage
                            ? 'from-white/70 to-white/30'
                            : 'from-[#dca359] to-[#e0b16a]'
                          : 'opacity-0 group-hover:opacity-40 from-[#dca359]/40 to-[#e0b16a]/30'
                      } transition-opacity duration-500`}></span>
                      <item.icon className="relative w-5 h-5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span className="relative flex-1 text-start">{item.title}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto transition-all ${
                        location.pathname === item.url ? 'opacity-60' : 'opacity-30 group-hover:opacity-60 translate-x-0 group-hover:translate-x-1'
                      }`} />
                    </Link>
                  ))}
                  
                  {/* Mobile Login Button */}
                  <div
                    className={`mt-2 pt-3 mx-1 ${
                      isHomePage ? 'border-t border-white/20' : 'border-t border-gray-200'
                    }`}
                  >
                    <LoginButton
                      transparent={isHomePage}
                      className="w-full py-3 text-base"
                    />
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          </>
        )}

        {/* Main Content */}
          <main className={`flex-1 ${!isHomePage ? 'pt-20 md:pt-24' : 'pt-0'}`}>
          {children}
        </main>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-5 p-3 bg-desert-solid-deep hover:bg-desert-bold rounded-full shadow-warm-lg text-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
            showScrollTop 
              ? 'opacity-50 translate-y-0 hover:opacity-100' 
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
                  <div className="w-10 h-12 flex-shrink-0 flex items-center justify-center">
                    <img src={cfImage("/images/logo/logo.png")} alt="TNP Logo" className="w-full h-full object-contain drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl font-display font-bold whitespace-nowrap min-w-0 flex-1">{t.title}</h3>
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
                  {/* <a 
                    href={config.SOCIAL.FACEBOOK} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group"
                  >
                    <FaFacebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a> */}
                  <a 
                    href={config.SOCIAL.INSTAGRAM} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-all duration-300 group"
                  >
                    <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                  {/* <a 
                    href={config.SOCIAL.YOUTUBE} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300 group"
                  >
                    <FaYoutube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a> */}
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
              <div className="mb-4">
                <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-500">
                  <Link 
                    to="/terms" 
                    className="hover:text-desert-300 transition-colors duration-200"
                  >
                    {t.terms}
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link 
                    to="/privacy" 
                    className="hover:text-desert-300 transition-colors duration-200"
                  >
                    {t.privacy}
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link 
                    to="/accessibility" 
                    className="hover:text-desert-300 transition-colors duration-200"
                  >
                    {t.accessibility}
                  </Link>
                </div>
              </div>
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