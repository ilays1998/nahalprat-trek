import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Check, Star, Users, Clock, Utensils, Bed, Car, ShieldCheck, Bus, Coffee, Map, CheckCircle, Sparkles } from "lucide-react";
import { useLanguage } from "../layout";
import { motion } from "framer-motion";

export default function Packages() {
  const { language, isRTL } = useLanguage();

  const content = {
    he: {
      title: "תמחור שקוף",
      subtitle: "אצלנו אין אותיות קטנות",
      priceStatement: "החל מ־1,000 ₪ לאדם",
      transparency: "המחיר תלוי ברמת הלינה — חבילת הסטנדרט היא 1,000 ₪ לאדם וכוללת את כל מה שרשום למטה",
      bookNow: "הזמן את המקום שלך",
      perPerson: "לאדם",
      included: "מה כלול בחבילה",
      whyChoose: "למה לבחור בנו?",
      professionalExperience: "חוויה מקצועית ומאורגנת",
      package: {
        name: "חבילת סטנדרט טרק נחל פרת",
        price: "1,000",
        description: "חבילה מקיפה ושקופה הכוללת את כל מה שצריך לחוויית טיול בלתי נשכחת במדבר יהודה",
        features: [
          {
            icon: Bus,
            title: "העברות וציוד",
            description: "אתם סוחבים רק מה שהכרחי"
          },
          {
            icon: Bed,
            title: "לינה בצימר",
            description: "2 לילות בצימרים ברמת סטנדרט"
          },
          {
            icon: Utensils,
            title: "אוכל מלא",
            description: "ארוחות בוקר וערב + צידה לדרך למהלך כל היום"
          },
          {
            icon: ShieldCheck,
            title: "ביטול חינם",
            description: "עד 3 ימים לפני הטיול - ביטול חינם"
          },
          {
            icon: Coffee,
            title: "שוברים לקפה",
            description: "שוברים לעגלת קפה מקומית בדרך"
          },
          {
            icon: Map,
            title: "מפה והסברים",
            description: "תקבלו מאיתנו מפה והסברים מפורטים על הדרך"
          }
        ]
      }
    },
    en: {
      title: "Transparent Pricing",
      subtitle: "No fine print here",
      priceStatement: "Starting from 1,000 ₪ per person",
      transparency: "Price depends on the accommodation level — the standard package is 1,000 ₪ per person and includes everything listed below",
      bookNow: "Book Your Spot",
      perPerson: "per person",
      included: "What's Included",
      whyChoose: "Why Choose Us?",
      professionalExperience: "Professional and organized experience",
      package: {
        name: "Nahal Prat Trek Standard Package",
        price: "1,000",
        description: "Comprehensive and transparent package including everything you need for an unforgettable Judean Desert experience",
        features: [
          {
            icon: Bus,
            title: "Transfers & Equipment",
            description: "You only carry what’s essential"
          },
          {
            icon: Bed,
            title: "Cabin Accommodation",
            description: "2 nights in standard cabins"
          },
          {
            icon: Utensils,
            title: "Complete Meals",
            description: "Breakfast and dinner + trail snacks throughout the day"
          },
          {
            icon: ShieldCheck,
            title: "Free Cancellation",
            description: "Up to 3 days before the trek - no fees"
          },
          {
            icon: Coffee,
            title: "Coffee Vouchers",
            description: "Vouchers for local coffee cart along the way"
          },
          {
            icon: Map,
            title: "Trail Map & Info",
            description: "We provide a detailed map and route information for self-guiding"
          }
        ]
      }
    }
  };

  const currentContent = content[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-desert-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-desert-100 to-desert-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-desert-700 font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {currentContent.professionalExperience}
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
              {currentContent.title}
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-2xl text-gray-700 mb-4 font-medium">
              {currentContent.subtitle}
            </motion.p>
            
            <motion.div variants={itemVariants} className="text-4xl font-bold text-desert-600 mb-4">
              {currentContent.priceStatement}
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentContent.transparency}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main Package Card */}
        <motion.div 
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
            <Card className="border-none shadow-2xl bg-desert-light backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0">
                <div className="bg-desert-100/70 backdrop-blur-sm border-b border-desert-300/40 text-gray-900 text-center py-3">
                  <span className="font-semibold tracking-wide" style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)" }}>
                    {currentContent.package.name}
                  </span>
                </div>
              </div>


            <CardHeader className="text-center pb-8 pt-20">
              <div className="text-7xl font-bold text-desert-600 mb-4">
                ₪{currentContent.package.price}
              </div>
              <p className="text-xl text-gray-500 mb-6">{currentContent.perPerson}</p>
              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {currentContent.package.description}
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-12">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentContent.included}</h3>
                <div className="w-24 h-1 bg-[#c56f19] mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {currentContent.package.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 p-4 bg-desert-solid rounded-xl border border-desert-200/30"
                  >
                    <div className="w-12 h-12 bg-[#c56f19] rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-center"
              >
                <Link to={createPageUrl("Booking")}>
                  <Button className="group relative overflow-hidden bg-[#c56f19] text-white text-xl px-12 py-6 rounded-2xl shadow-warm-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                    <span className="relative z-10 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      {currentContent.bookNow}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
                
                <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  {language === 'he' ? 'תשלום מאובטח' : 'Secure Payment'}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust & Transparency Section */}
        <motion.section 
          className="bg-desert-light rounded-3xl p-12 shadow-warm border border-desert-200/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#c56f19] rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentContent.whyChoose}
            </h2>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {language === 'he' 
                ? 'שקיפות מלאה, שירות מקצועי, וחוויה בלתי נשכחת. אנחנו מאמינים בכנות מלאה ובמתן ערך אמיתי לכל שקל שאתם משלמים.'
                : 'Complete transparency, professional service, and an unforgettable experience. We believe in full honesty and providing real value for every shekel you pay.'
              }
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {language === 'he' ? 'ללא עלויות נסתרות' : 'No Hidden Costs'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'he' ? 'מה שרואים זה מה שמשלמים' : 'What you see is what you pay'}
                </p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-blue-600 fill-current" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {language === 'he' ? 'איכות מובטחת' : 'Guaranteed Quality'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'he' ? 'רמת שירות גבוהה בכל שלב' : 'High service level at every stage'}
                </p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {language === 'he' ? 'תמיכה בקהילה המקומית' : 'Supporting Local Community'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'he' ? 'תמיכה בעסקים המקומיים' : 'Supporting local businesses'}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <Link to={createPageUrl("Booking")}>
                <Button size="lg" className="bg-[#c56f19] text-white hover:opacity-90 text-lg px-12 py-4 rounded-xl shadow-warm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  {language === 'he' ? 'בואו נתחיל!' : "Let's Get Started!"}
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
