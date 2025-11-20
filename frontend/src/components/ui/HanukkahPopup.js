import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../layout';

const HanukkahPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasShownPopup = sessionStorage.getItem('hanukkah-popup-shown');
    
    if (!hasShownPopup) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Remember that popup was shown this session
    sessionStorage.setItem('hanukkah-popup-shown', 'true');
  };

  const content = {
    he: {
      title: "מבצע חנוכה!",
      message: "הזמינו עכשיו וקבלו 100 ₪ הנחה לאדם!",
      originalPrice: "מחיר רגיל: 1,000 ₪",
      salePrice: "מחיר חנוכה: 900 ₪",
      perPerson: "לאדם",
      bookNow: "הזמינו עכשיו",
      close: "סגור"
    },
    en: {
      title: "Hanukkah Special!",
      message: "Book now and get 100 ₪ discount per person!",
      originalPrice: "Regular price: ₪1,000",
      salePrice: "Hanukkah price: ₪900",
      perPerson: "per person",
      bookNow: "Book Now",
      close: "Close"
    }
  };

  const currentContent = content[language];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
            onClick={handleClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            className="fixed top-1/2 left-1/2 
                       bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 
                       text-white rounded-3xl shadow-2xl z-[10001] 
                       max-w-md w-[90vw] overflow-hidden"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            {/* Header with Hanukkah decorations */}
            <div className="relative p-8 text-center">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label={currentContent.close}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Hanukkah candles decoration */}
              <div className="flex justify-center mb-4">
                <div className="flex items-end gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-1 h-3 bg-yellow-400 rounded-full mb-1"
                      />
                      <div className={`w-2 ${i < 4 ? 'h-8' : 'h-10'} bg-white/80 rounded-sm`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Title with gift icon */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold">
                  {currentContent.title}
                </h2>
              </div>

              {/* Main message */}
              <p className="text-xl mb-6 leading-relaxed">
                {currentContent.message}
              </p>

              {/* Pricing */}
              <div className="space-y-2 mb-6">
                <div className="text-lg text-white/70 line-through">
                  {currentContent.originalPrice}
                </div>
                <div className="text-3xl font-bold text-yellow-400">
                  {currentContent.salePrice}
                </div>
                <div className="text-sm text-white/80">
                  {currentContent.perPerson}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  handleClose();
                  // Navigate to booking page
                  window.location.href = '/booking';
                }}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 
                         font-bold py-4 px-6 rounded-2xl text-lg
                         transform hover:scale-105 transition-all duration-200
                         shadow-lg hover:shadow-xl"
              >
                {currentContent.bookNow}
              </button>
            </div>

            {/* Decorative bottom pattern */}
            <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HanukkahPopup;