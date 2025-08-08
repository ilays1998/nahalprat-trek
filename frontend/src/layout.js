import React, { useState, createContext, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils"; // TODO: Check if this file exists
import { Menu, X, Globe, Mountain, Calendar, ImageIcon, Package, BookOpen, ChevronRight, ArrowUp } from "lucide-react";
import { Button } from "./components/ui/button"; // TODO: Check if this file exists
import { LoginButton } from "./components/auth/LoginButton";
import { useAuth } from "./contexts/AuthContext";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  he: {
    home: "בית",
    packages: "חבילות",
    gallery: "גלריה",
    booking: "הזמנה",
    myBookings: "ההזמנות שלי",
    title: "מסלול נחל פרת",
    subtitle: "חוויית טיול מודרכת בת 3 ימים במדבר יהודה",
    bookNow: "הזמן עכשיו",
    contact: "צור קשר",
    followUs: "עקוב אחרינו",
    allRights: "כל הזכויות שמורות.",
    footerDesc: "חווה את המדבר היהודי במסלול מודרך ומאורגן בהשראת הליכה אירופאית בין בקתות הרים."
  },
  en: {
    home: "Home",
    packages: "Packages",
    gallery: "Gallery", 
    booking: "Booking",
    myBookings: "My Bookings",
    title: "Nahal Prat Trek",
    subtitle: "3-Day Guided Desert Adventure",
    bookNow: "Book Now",
    contact: "Contact",
    followUs: "Follow Us",
    allRights: "All rights reserved.",
    footerDesc: "Experience the Judean Desert through a guided, organized trek inspired by European hut-to-hut hiking."
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

  // Don't show navigation on auth callback page or when not authenticated
  const shouldShowNavigation = isAuthenticated && location.pathname !== '/auth/callback';

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
  ];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'he' ? 'en' : 'he');
  };

  return (
    <LanguageContext.Provider value={{ language, t, isRTL, toggleLanguage }}>
      <div className={`min-h-screen bg-gradient-to-b from-desert-50 via-white to-desert-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Navigation - Only show when authenticated */}
        {shouldShowNavigation && (
          <nav className="relative top-0 w-full bg-white shadow-lg border-b-2 border-gray-300 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                {/* Logo */}
                <Link 
                  to={createPageUrl("Home")} 
                  className="flex items-center gap-3 group mr-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-desert-gradient rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative w-12 h-12 bg-desert-gradient rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-warm">
                      <Mountain className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h1 className="text-2xl font-display font-bold text-gray-900 transition-colors duration-300">
                      {t.title}
                    </h1>
                    <p className="text-xs text-gray-600 transition-colors duration-300">
                      {t.subtitle}
                    </p>
                  </div>
                </Link>

                {/* Centered Navigation */}
                <div className="flex items-center justify-center gap-3 flex-1">
                  {navigationItems.map((item, index) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border-2 shadow-md ${
                        location.pathname === item.url
                          ? 'bg-desert-500 text-white border-desert-600 shadow-lg transform scale-105'
                          : 'text-gray-800 border-gray-400 hover:bg-desert-100 hover:border-desert-400 hover:shadow-lg bg-gray-50 hover:transform hover:scale-102'
                      }`}
                    >
                      <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="whitespace-nowrap">{item.title}</span>
                    </Link>
                  ))}
                  
                  {/* Language Toggle */}
                  <Button
                    onClick={toggleLanguage}
                    className="relative overflow-hidden group px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border-2 border-gray-400 hover:border-gray-500 transition-all duration-300 shadow-md font-semibold flex items-center justify-between w-[80px]"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="font-semibold text-sm">{language === 'he' ? 'EN' : 'עב'}</span>
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>

                  <LoginButton 
                    className="text-gray-800 border-2 border-gray-400 hover:border-gray-500 bg-gray-50 hover:bg-gray-100 font-semibold shadow-md" 
                  />
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
                  <div className="w-10 h-10 bg-desert-gradient rounded-xl flex items-center justify-center shadow-warm">
                    <Mountain className="w-6 h-6 text-white" />
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
                    info@nahalprat.co.il
                  </p>
                  <p className="flex items-center gap-2 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 bg-desert-400 rounded-full"></span>
                    +972-50-123-4567
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-display font-semibold text-lg mb-4 text-desert-200">
                  {t.followUs}
                </h4>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-desert-500 transition-all duration-300 group">
                    <span className="text-sm font-medium group-hover:scale-110 transition-transform">FB</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-desert-500 transition-all duration-300 group">
                    <span className="text-sm font-medium group-hover:scale-110 transition-transform">IG</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-desert-500 transition-all duration-300 group">
                    <span className="text-sm font-medium group-hover:scale-110 transition-transform">YT</span>
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