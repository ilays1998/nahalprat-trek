
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Mountain, Users, Clock, Shield, Star, MapPin, CalendarIcon, ShieldCheck, Sparkles, Navigation, Heart, Camera, Backpack, Tent } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../layout";

export default function Home() {
  const { language, t, isRTL } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "/images/hero-desert-1.jpg",
    "/images/hero-nahal-prat-1.jpg",
    "/images/hero-landscape-1.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const content = {
    he: {
      hero: {
        title: "מסלול נחל פרת",
        subtitle: "חוויית טיול מודרכת בת 3 ימים במדבר יהודה",
        description: "גלה את יופיו של המדבר היהודי במסלול מאורגן ומודרך בהשראת הליכה אירופאית בין בקתות הרים. שלושה ימים של הליכה, נופים עוצרי נשימה ולינה ייחודית במדבר.",
        cta: "התחל את ההרפתקה",
        viewPackages: "צפה בחבילות"
      },
      features: {
        title: "למה לבחור במסלול שלנו?",
        subtitle: "חוויה מקצועית ומאורגנת עד הפרט האחרון",
        items: [
          {
            icon: Mountain,
            title: "נופים מדהימים",
            description: "הליכה דרך נופי מדבר עוצרי נשימה ואתרים היסטוריים עתיקים"
          },
          {
            icon: Users,
            title: "מדריכים מנוסים",
            description: "מדריכים מקצועיים עם ידע עמוק על האזור והטבע המקומי"
          },
          {
            icon: ShieldCheck,
            title: "ביטול גמיש",
            description: "תהנה משקט נפשי עם אפשרות ביטול חינם עד 7 ימים לפני הטיול"
          },
          {
            icon: Clock,
            title: "הכל מאורגן",
            description: "ארוחות, לינה ותחבורה - הכל כלול ומאורגן מראש"
          }
        ]
      },
      stats: {
        trekkers: "1,200+ מטיילים",
        rating: "4.9 דירוג",
        trails: "12 מסלולים",
        years: "8 שנות ניסיון"
      },
      packages: {
        title: "חבילות הטיול שלנו",
        subtitle: "בחר את החבילה המתאימה לך",
        viewAll: "צפה בכל החבילות",
        from: "החל מ",
        perPerson: "לאדם",
        details: "פרטים נוספים"
      },
      testimonials: {
        title: "מה אומרים המטיילים",
        subtitle: "חוויות אמיתיות ממטיילים שלנו",
        items: [
          {
            name: "שרה כהן",
            text: "חוויה בלתי נשכחת! הארגון היה מושלם והנופים פשוט מדהימים.",
            role: "מטיילת מירושלים",
            rating: 5
          },
          {
            name: "דוד לוי",
            text: "המדריכים היו נהדרים והלינה הייתה מעל הציפיות. ממליץ בחום!",
            role: "מטייל מתל אביב",
            rating: 5
          },
          {
            name: "מיכל ברק",
            text: "טיול מאורגן להפליא עם תשומת לב לכל פרט. נחזור בהחלט!",
            role: "מטיילת מחיפה",
            rating: 5
          }
        ]
      },
      cta: {
        title: "מוכנים להרפתקה?",
        subtitle: "הצטרפו אלינו למסע בלתי נשכח במדבר יהודה",
        button: "הזמן את המקום שלך"
      }
    },
    en: {
      hero: {
        title: "Nahal Prat Trek",
        subtitle: "3-Day Guided Desert Adventure",
        description: "Discover the beauty of the Judean Desert through an organized, guided trek inspired by European hut-to-hut hiking. Three days of hiking, breathtaking landscapes, and unique desert accommodation.",
        cta: "Start Your Adventure",
        viewPackages: "View Packages"
      },
      features: {
        title: "Why Choose Our Trek?",
        subtitle: "Professional and organized experience down to every detail",
        items: [
          {
            icon: Mountain,
            title: "Stunning Landscapes",
            description: "Hike through breathtaking desert scenery and ancient historical sites"
          },
          {
            icon: Users,
            title: "Expert Guides",
            description: "Professional guides with deep knowledge of the region and local nature"
          },
          {
            icon: ShieldCheck,
            title: "Flexible Cancellation",
            description: "Enjoy peace of mind with free cancellation up to 7 days before your trek"
          },
          {
            icon: Clock,
            title: "All Inclusive",
            description: "Meals, accommodation, and transportation - everything included and organized"
          }
        ]
      },
      stats: {
        trekkers: "1,200+ Trekkers",
        rating: "4.9 Rating",
        trails: "12 Trails",
        years: "8 Years Experience"
      },
      packages: {
        title: "Our Trek Packages",
        subtitle: "Choose the package that suits you",
        viewAll: "View All Packages",
        from: "From",
        perPerson: "per person",
        details: "View Details"
      },
      testimonials: {
        title: "What Trekkers Say",
        subtitle: "Real experiences from our trekkers",
        items: [
          {
            name: "Sarah Cohen",
            text: "Unforgettable experience! The organization was perfect and the views were simply amazing.",
            role: "Trekker from Jerusalem",
            rating: 5
          },
          {
            name: "David Levy",
            text: "The guides were wonderful and the accommodation exceeded expectations. Highly recommend!",
            role: "Trekker from Tel Aviv",
            rating: 5
          },
          {
            name: "Michal Barak",
            text: "Amazingly organized trip with attention to every detail. We'll definitely be back!",
            role: "Trekker from Haifa",
            rating: 5
          }
        ]
      },
      cta: {
        title: "Ready for Adventure?",
        subtitle: "Join us for an unforgettable journey through the Judean Desert",
        button: "Book Your Spot"
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

  const packages = [
    { 
      id: 'basic', 
      name: language === 'he' ? 'בסיסי' : 'Basic', 
      price: '1,000',
      features: language === 'he' 
        ? ['3 ימי הליכה', 'לינה בסיסית', 'ארוחות כלולות', 'מדריך מקצועי']
        : ['3 days hiking', 'Basic accommodation', 'Meals included', 'Professional guide'],
      icon: Tent
    },
    { 
      id: 'pro', 
      name: language === 'he' ? 'מקצועי' : 'Pro', 
      price: '2,000',
      popular: true,
      features: language === 'he'
        ? ['3 ימי הליכה', 'לינה משודרגת', 'ארוחות גורמה', 'מדריך מומחה', 'ציוד מקצועי']
        : ['3 days hiking', 'Upgraded accommodation', 'Gourmet meals', 'Expert guide', 'Pro equipment'],
      icon: Backpack
    },
    { 
      id: 'premium', 
      name: language === 'he' ? 'פרימיום' : 'Premium', 
      price: '3,000',
      features: language === 'he'
        ? ['3 ימי הליכה', 'לינה יוקרתית', 'שף פרטי', 'מדריך VIP', 'הסעה פרטית', 'צילום מקצועי']
        : ['3 days hiking', 'Luxury accommodation', 'Private chef', 'VIP guide', 'Private transport', 'Pro photography'],
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 bg-cover bg-center"
          style={{
                backgroundImage: `url(${image})`,
                opacity: currentImageIndex === index ? 1 : 0
              }}
              animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
              transition={{ duration: 1 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>
        
        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 text-shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentContent.hero.title}
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-desert-100 mb-8 font-medium"
              variants={itemVariants}
            >
              {currentContent.hero.subtitle}
            </motion.p>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              {currentContent.hero.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link to={createPageUrl("Booking")}>
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-desert-gradient text-white text-lg px-8 py-6 rounded-2xl shadow-warm-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                  {currentContent.hero.cta}
                  </span>
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              
              <Link to={createPageUrl("Packages")}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-desert-700 hover:bg-desert-50 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  {currentContent.hero.viewPackages}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-desert-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(currentContent.stats).map(([key, value], index) => (
              <motion.div
                key={key}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-desert-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              {currentContent.features.title}
            </h2>
            <p className="text-xl text-gray-600">{currentContent.features.subtitle}</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.features.items.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-warm hover:shadow-warm-lg card-hover group">
                <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-desert-gradient rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                      <div className="relative w-20 h-20 bg-desert-gradient rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-10 h-10 text-white" />
                      </div>
                  </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Preview Section */}
      <section className="py-24 bg-gradient-to-b from-desert-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              {currentContent.packages.title}
            </h2>
            <p className="text-xl text-gray-600">{currentContent.packages.subtitle}</p>
          </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={pkg.popular ? 'transform md:-translate-y-4' : ''}
              >
                <Card className={`relative h-full border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  pkg.popular ? 'border-2 border-desert-400' : ''
                }`}>
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-desert-gradient text-white px-4 py-1 rounded-bl-xl text-sm font-medium">
                      {language === 'he' ? 'פופולרי' : 'Popular'}
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-desert-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <pkg.icon className="w-8 h-8 text-desert-600" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
                        {pkg.name}
                    </h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm text-gray-500">{currentContent.packages.from}</span>
                        <span className="text-4xl font-bold text-desert-600">₪{pkg.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{currentContent.packages.perPerson}</p>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-600">
                          <Heart className="w-4 h-4 text-desert-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to={createPageUrl("Packages")}>
                      <Button className={`w-full ${
                        pkg.popular 
                          ? 'bg-desert-gradient text-white hover:shadow-lg' 
                          : 'bg-desert-100 text-desert-700 hover:bg-desert-200'
                      } transition-all duration-300`}>
                        {currentContent.packages.details}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
              ))}
            </div>
            
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
              <Link to={createPageUrl("Packages")}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-desert-300 text-desert-700 hover:bg-desert-50 rounded-xl"
              >
                  {currentContent.packages.viewAll}
                </Button>
              </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-desert-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              {currentContent.testimonials.title}
            </h2>
            <p className="text-xl text-gray-600">{currentContent.testimonials.subtitle}</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentContent.testimonials.items.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-desert-50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-desert-400 text-desert-400" />
                    ))}
                  </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-lg italic">
                    "{testimonial.text}"
                  </p>
                    <div>
                      <div className="font-display font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-desert-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            {currentContent.cta.title}
              </h2>
          <p className="text-xl text-desert-100 mb-8">
            {currentContent.cta.subtitle}
          </p>
          <Link to={createPageUrl("Booking")}>
            <Button 
              size="lg" 
              className="bg-white text-desert-700 hover:bg-desert-50 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <CalendarIcon className="w-5 h-5 mr-2" />
              {currentContent.cta.button}
                </Button>
              </Link>
        </motion.div>
      </section>
    </div>
  );
}
