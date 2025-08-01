import React, { useState, createContext, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils"; // TODO: Check if this file exists
import { Menu, X, Globe, Mountain, Calendar, ImageIcon, Package, BookOpen, ChevronRight, ArrowUp } from "lucide-react";
import { Button } from "./components/ui/button"; // TODO: Check if this file exists
import { LoginButton } from "./components/auth/LoginButton";

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
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const t = translations[language];
  const isRTL = language === 'he';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
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
        {/* Navigation */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'glass shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link 
                to={createPageUrl("Home")} 
                className="flex items-center gap-3 group"
                data-aos="fade-right"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-desert-gradient rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-desert-gradient rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-warm">
                    <Mountain className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h1 className={`text-2xl font-display font-bold ${scrolled ? 'text-gray-900' : 'text-white'} transition-colors duration-300`}>
                    {t.title}
                  </h1>
                  <p className={`text-xs ${scrolled ? 'text-gray-600' : 'text-desert-100'} transition-colors duration-300`}>
                    {t.subtitle}
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6" data-aos="fade-left">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.url
                        ? `${scrolled ? 'bg-desert-100 text-desert-700' : 'bg-white/20 text-white'} shadow-md`
                        : `${scrolled ? 'text-gray-700 hover:bg-desert-50' : 'text-white/90 hover:bg-white/10'} hover:shadow-md`
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{item.title}</span>
                  </Link>
                ))}
                
                {/* Language Toggle */}
                <Button
                  onClick={toggleLanguage}
                  className={`relative overflow-hidden group px-3 py-2 rounded-xl ${
                    scrolled 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  } transition-all duration-300`}
                >
                  <Globe className="w-4 h-4 mr-1.5" />
                  <span className="font-medium">{language === 'he' ? 'EN' : 'עב'}</span>
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>

                <LoginButton 
                  className={`${
                    scrolled 
                      ? 'text-gray-700' 
                      : 'text-white'
                  }`} 
                />
                
                <Link to={createPageUrl("Booking")}>
                  <Button className="relative overflow-hidden group btn-primary">
                    <span className="relative z-10">{t.bookNow}</span>
                    <ChevronRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-2">
                <Button
                  onClick={toggleLanguage}
                  className={`p-2 rounded-lg ${
                    scrolled 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`p-2 rounded-lg ${
                    scrolled 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-500 ease-in-out ${
              mobileMenuOpen 
                ? 'max-h-screen opacity-100 mt-4' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              <div className="glass rounded-2xl p-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.url
                        ? 'bg-desert-100 text-desert-700 shadow-md'
                        : 'text-gray-700 hover:bg-desert-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
                <div className="pt-2 space-y-2">
                  <LoginButton className="w-full" />
                  <Link to={createPageUrl("Booking")} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full btn-primary">
                      {t.bookNow}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

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
              <div data-aos="fade-up">
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
              
              <div data-aos="fade-up" data-aos-delay="100">
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
              
              <div data-aos="fade-up" data-aos-delay="200">
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