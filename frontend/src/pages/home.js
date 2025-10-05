
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Mountain, Users, Clock, Shield, Star, MapPin, CalendarIcon, ShieldCheck, Sparkles, Navigation, Heart, Camera, Backpack, Tent, Bus, Bed, Utensils, Map } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../layout";

export default function Home() {
  const { language, t, isRTL } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "/images/landscapes/DSC_0346.JPG",
    "/images/landscapes/DSC_0379.JPG",
    "/images/landscapes/DSC_0431.JPG"
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
        title: "טרק נחל פרת",
        subtitle: "חוויית טיול בת 3 ימים במדבר יהודה",
        description: "גלה את יופיו של מדבר יהודה בטרק מאורגן בהשראת הליכה אירופאית בין בקתות הרים. שלושה ימים של הליכה, נופים עוצרי נשימה ולינה בבקתה במדבר.",
        cta: "התחל את ההרפתקה",
        viewPricing: "צפה במחיר"
      },
      features: {
        title: "אתם הולכים אנחנו דואגים לכל השאר",
        subtitle: "חוויה מקצועית ומאורגנת עד הפרט האחרון",
        items: [
          {
            icon: Bus,
            title: "העברות",
            description: "מירושלים עד לתחילת הטרק ובחזרה"
          },
          {
            icon: Bed,
            title: "לינה",
            description: "בקתה מעץ הכוללת שירותים, מקלחת, מיטה מפנקת ואווירה קסומה"
          },
          {
            icon: Utensils,
            title: "אוכל",
            description: "נדאג לספק לכם ארוחות בוקר וערב ונשנושים לטרק"
          },
          {
            icon: Map,
            title: "טרק",
            description: "טרק מותאם שעובר בכל המקומות היפים באיזור"
          }
        ]
      },
      stats: {
        distance: "35 ק״מ",
        springs: "3 מעיינות",
        pools: "עלייה 800 מ'",
        stream: "נחל אחד"
      },
      journey: {
        title: "סיפור דרך",
        subtitle: "מסע של שלושה ימים במדבר יהודה",
        viewAll: "צפה במחיר המלא",
        day: "יום",
        mapTitle: "מפת הטרק"
      },
      about: {
        title: "עלינו",
        subtitle: "הכירו את משפחת סופר - המארחים שלכם להרפתקה במדבר",
        text: "אנחנו משפחת סופר, גרים בנופי פרת כבר 27 שנים. מאז ומתמיד הייתה לנו אהבה גדולה לטבע ולהליכה בו. הכנו בשבילכם טרק בהשראת הטרקים באיטליה ואוסטריה עם אוכל טוב ולינה נוחה. המטרה שלנו היא לאפשר לכם לצאת למסע שבו תוכלו להתנתק מהרעש וההמולה ששוררת במדינה שלנו בדרך קבע, ולתת לעצמכם את השקט שרק המרחבים הבראשיתיים של מדבר יהודה יכולים לתת.",
        image: "/images/aboutus/DSC_0325.JPG"
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
        subtitle: "3-Day Desert Adventure",
        description: "Discover the beauty of the Judean Desert through an organized trek inspired by European hut-to-hut hiking. Three days of hiking, breathtaking landscapes, and unique desert accommodation.",
        cta: "Start Your Adventure",
        viewPricing: "View Pricing"
      },
      features: {
        title: "You Walk, We Handle Everything Else",
        subtitle: "Professional and organized experience down to every detail",
        items: [
          {
            icon: Bus,
            title: "Transportation",
            description: "From Jerusalem to the trail start and back"
          },
          {
            icon: Bed,
            title: "Accommodation",
            description: "Wooden cabin with restrooms, shower, comfortable bed and magical atmosphere"
          },
          {
            icon: Utensils,
            title: "Food",
            description: "We'll provide you with breakfast and dinner meals plus snacks for the trail"
          },
          {
            icon: Map,
            title: "Route",
            description: "Customized route that passes through all the beautiful spots in the area"
          }
        ]
      },
      stats: {
        distance: "35 KM",
        springs: "3 Springs",
        pools: "800m Elevation",
        stream: "One Stream"
      },
      journey: {
        title: "Journey Story",
        subtitle: "A three-day adventure through the Judean Desert",
        viewAll: "View Full Pricing",
        day: "Day",
        mapTitle: "Trail Map"
      },
      about: {
        title: "About Us",
        subtitle: "Meet the Sofer Family - Your Desert Adventure Hosts",
        text: "We are the Sofer family, living in the landscapes of Prat for 27 years. We have always had a great love for nature and hiking in it. We have prepared a route for you inspired by the treks in Italy and Austria with good food and comfortable accommodation. Our goal is to allow you to go on a journey where you can disconnect from the noise and hustle and bustle that constantly prevails in our country, and give yourself the quiet that only the pristine expanses of the Judean Desert can provide.",
        image: "/images/aboutus/DSC_0325.JPG"
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

  const journeyDays = [
    { 
      id: 'day1', 
      dayNumber: 1,
      title: language === 'he' ? 'מענתות לנופי פרת' : 'Anatot to Nofei Prat', 
      description: language === 'he' 
        ? 'תיאור של היום הראשון'
        : 'Description of the first day - a fast and exciting journey through the spectacular landscapes of the Judean Desert. We start in Anatot and arrive at Nofei Prat',
      garminEmbed: "https://connect.garmin.com/modern/activity/embed/19753628830",
      logo: "/images/logo.png"
    },
    { 
      id: 'day2', 
      dayNumber: 2,
      title: language === 'he' ? 'היום השני במדבר' : 'Second Day in the Desert', 
      description: language === 'he'
        ? 'תיאור של היום השני'
        : 'Description of the second day - continuing the journey with new landscapes and unforgettable experiences in the Judean Desert',
      garminEmbed: "https://connect.garmin.com/modern/activity/embed/19753628830",
      logo: "/images/logo.png"
    },
    { 
      id: 'day3', 
      dayNumber: 3,
      title: language === 'he' ? 'היום השלישי וההגעה' : 'Third Day and Arrival', 
      description: language === 'he'
        ? 'תיאור של היום השלישי'
        : 'Description of the third and final day - completing the journey with deep emotions and memories that will last forever',
      garminEmbed: "https://connect.garmin.com/modern/activity/embed/19753628830",
      logo: "/images/logo.png"
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
              className={`hero-slide ${currentImageIndex === index ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image})`
              }}
              animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
              transition={{ duration: 1 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>
        
        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 sm:py-24 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <motion.h1 
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-4 sm:mb-6 text-shadow-lg leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentContent.hero.title}
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-2xl md:text-3xl text-desert-100 mb-6 sm:mb-8 font-medium"
              variants={itemVariants}
            >
              {currentContent.hero.subtitle}
            </motion.p>
            
            <motion.p 
              className="text-sm sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
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
                  {currentContent.hero.viewPricing}
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

      {/* Journey Story Section */}
      <section className="py-24 bg-gradient-to-b from-desert-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              {currentContent.journey.title}
            </h2>
            <p className="text-xl text-gray-600">{currentContent.journey.subtitle}</p>
          </motion.div>
            
            <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-12 max-w-6xl mx-auto">
            {journeyDays.map((day, index) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                      {/* Day Info */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-14 flex items-center justify-center">
                            <img src={day.logo} alt="TNP Logo" className="w-full h-full object-contain drop-shadow-lg" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-display font-bold text-gray-900">
                              {currentContent.journey.day} {day.dayNumber}
                            </h3>
                            <h4 className="text-lg font-medium text-desert-600">
                              {day.title}
                            </h4>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {day.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-desert-600 font-medium">
                          <MapPin className="w-4 h-4" />
                          {currentContent.journey.mapTitle}
                        </div>
                      </div>
                      
                      {/* Garmin Map */}
                      <div className="relative">
                        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                          <iframe 
                            src={day.garminEmbed}
                            width="100%" 
                            height="100%" 
                            title={`${currentContent.journey.day} ${day.dayNumber} - ${currentContent.journey.mapTitle}`}
                            frameBorder="0"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
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
                  {currentContent.journey.viewAll}
                </Button>
              </Link>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-gradient-to-b from-white to-desert-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              {currentContent.about.title}
            </h2>
            <p className="text-xl text-gray-600">{currentContent.about.subtitle}</p>
          </motion.div>
          
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Image */}
              <div className="order-2 md:order-1">
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={currentContent.about.image}
                    alt={currentContent.about.title}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </div>
              
              {/* Text Content */}
              <div className="order-1 md:order-2">
                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-desert-50/50">
                  <CardContent className="p-8 lg:p-12">
                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                      {currentContent.about.text}
                    </p>
                    
                    <div className="mt-8 pt-6 border-t border-desert-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-desert-gradient rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-display font-bold text-gray-900 text-lg">
                            {language === 'he' ? 'משפחת סופר' : 'Sofer Family'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
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
