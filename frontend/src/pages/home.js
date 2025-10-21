import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Ruler } from "lucide-react";

import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Mountain, Users, Clock, Shield, Star, MapPin, CalendarIcon, ShieldCheck, Sparkles, Navigation, Heart, Camera, Backpack, Tent, Bus, Bed, Utensils, Map } from "lucide-react";
import GoogleMapsGPX from "../components/GoogleMapsGPX";
import { motion } from "framer-motion";
import { useLanguage } from "../layout";
import { cfImage } from "../utils/image";

export default function Home() {
  const { language, t, isRTL } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    cfImage("/images/landscapes/DSC_0346.JPG"),
    cfImage("/images/landscapes/DSC_0379.JPG"),
    cfImage("/images/landscapes/DSC_0431.JPG")
  ];

    useEffect(() => {
    // Preload all hero images before the loop starts
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000); // slightly slower transition to prevent skips

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
        text: `אנחנו משפחת סופר, גרים בנופי פרת כבר 27 שנים. מאז ומתמיד הייתה לנו אהבה גדולה לטבע ולהליכה בו. הכנו בשבילכם טרק בהשראת הטרקים באיטליה ואוסטריה עם אוכל טוב ולינה נוחה.
        
        המטרה שלנו היא לאפשר לכם לצאת למסע שבו תוכלו להתנתק מהרעש וההמולה ששוררת במדינה שלנו בדרך קבע, ולתת לעצמכם את השקט שרק המרחבים הבראשיתיים של מדבר יהודה יכולים לתת.`,
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
        text: "We are the Sofer family, living in the landscapes of Prat for 27 years. We have always had a great love for nature and hiking in it. We have prepared a route for you inspired by the treks in Italy and Austria with good food and comfortable accommodation.\n\nOur goal is to allow you to go on a journey where you can disconnect from the noise and hustle and bustle that constantly prevails in our country, and give yourself the quiet that only the pristine expanses of the Judean Desert can provide.",
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
        ? `אנו מתחילים מכיכר על כביש 437 — כיכר שבו נמצאת הפניה ליישוב עלמון (ענתות).
    הולכים על כביש הגישה לכיוון עלמון כ־100 מטר, ואז מחפשים בצד הצפוני של הדרך את סימון השבילים הירוק.

    מתחילים ללכת עם הסימון הירוק, ולאחר כ־200 מטר מגיעים לקבר שייח'. ממשיכים בשביל המטפס על הגבעה 'חורבת עלמית', בין בורות מים, מערות מגורים ושרידי יישוב עתיקים.
    יש להיזהר — ישנם בורות פתוחים בדרך.
    בראש הגבעה נשקף נוף מרהיב לכיוון מזרח, וביום בהיר ניתן לראות אפילו את ים המלח.

    ממשיכים בירידה מתונה לאורך גדר היישוב עלמון. לאחר כ־2 ק״מ רואים את שלט הכניסה לשמורת נחל פרת.
    השביל עובר על המצוקים בגדה הדרומית של הנחל, והירידות הופכות חדות יותר, עם עלייה קטנה לקראת פיצול שבילים (לאחר כ־4 ק״מ מההתחלה) עם סימון כחול.
    כאן פונים שמאלה וממשיכים לרדת לשמורה עוד כחצי קילומטר, עוברים סמוך למנזר פארן — המנזר הראשון במדבר יהודה.

    בתוך השמורה (בתשלום סמלי) אפשר להתרחץ בבריכות, לנוח על שולחנות הפיקניק, לקנות ארטיק או שתייה, ולמלא מים להמשך הדרך.
    לאחר המנוחה יוצאים מזרחה עם הסימון הירוק, ואחרי כחצי קילומטר פונים שמאלה לסימון הכחול, הממשיך בתוך הנחל.

    השביל עובר כמה יתדות טיפוס על הגדה הדרומית, ואחרי כקילומטר מגיעים לבריכת החרוב — נקודת רחצה מומלצת במיוחד.
    משם ממשיכים עוד כקילומטר עד לנקודת חיבור של נחל יבש מצפון, ושם עולים בסימון ירוק עד ליישוב נופי פרת.

    העלייה באורך של כקילומטר מסתיימת בתצפית יונתן שבכניסה ליישוב, ממנה נשקף נוף פנורמי מרהיב של הנחל.
    בסיום, ממשיכים בתוך היישוב עד לצימר המפנק שבו נלון בלילה.`
        : `We start at the roundabout on Road 437 — the one with the turnoff to the village of Almon (Anatot).
    Walk about 100 meters along the access road toward Almon, then look on the north side of the road for the green trail marker.

    Follow the green trail. After about 200 meters, you’ll reach a sheikh’s tomb.
    Continue up the green-marked path that climbs the hill called “Horvat Almit,” passing ancient water cisterns, cave dwellings, and archaeological remains.
    Walk carefully — there are open pits along the way.
    From the top, you’ll enjoy a panoramic view eastward, and on clear days you can even see the Dead Sea.

    Continue on the green trail downhill along Almon’s fence.
    After about 2 km you’ll reach the entrance sign to Nahal Prat Nature Reserve.
    The trail now follows the cliffs on the southern bank of the wadi, with steeper descents and a short ascent before a junction with a blue trail (about 4 km from the start).
    Turn left and descend another half kilometer toward the reserve, passing by the ancient Monastery of St. Chariton — the first monastery ever built in the Judean Desert.

    Inside the reserve (entry fee required) you can swim in the pools, rest at picnic tables, buy an ice cream or cold drink, and refill water for the rest of the trek.
    After relaxing, continue east along the green trail for about 0.5 km, then turn left to follow the blue trail, which enters the wadi.

    The blue trail includes some metal handholds for climbing up the southern side of the wadi.
    After about 1 km you’ll reach Haruv Pool — a beautiful natural pool and perfect spot for a swim.
    Continue another kilometer to where a dry tributary joins from the north; here, leave the blue trail and climb up the green-marked path toward Nofei Prat.

    The ascent is about 1 km long and ends at Yonatan Lookout at the entrance to the community, offering breathtaking views of the canyon below.
    From there, walk through the village to the cozy desert cabin where we’ll stay for the night.`,
      logo: cfImage("/images/logo.png"),
      gpxFile: '/routes/COURSE_411278476.gpx', // Added GPX file for day 1
      stats: { distance: "8", ascent: "296", descent: "477" }

    },
    { 
      id: 'day2', 
      dayNumber: 2,
      title: language === 'he' ? 'מנופי פרת לעין קלט' : 'Nofei Prat to Ein Qelt',
      description: language === 'he'
        ? `את היום השני אנו מתחילים מתצפית יונתן בכניסה ליישוב נופי פרת.
    מהתצפית נרד לנחל בסימון שבילים ירוק. הירידה אינה תלולה ונמשכת כקילומטר (בערך 30 – 40 דקות).
    כאשר נגיע לנחל נפנה מזרחה (ימינה) ונלך על הסימון הכחול אותו עזבנו אתמול.

    לאחר כמה דקות נרד באמצעות מעקה ויתדות לבריכה הנקראת 'הנקיק' — בריכה עמוקה (בחלקה מעל גובה אדם, סכנת טביעה למי שאינו יודע לשחות) עם מפל יפה.
    מי שרוצה יכול לטבול במים הקרירים.

    משם אנו ממשיכים עוד כ־700 מטר עד לצמד בריכות עם מפל ביניהן, המכונות 'הג׳קוזי' על שם המפל הקטן שבבריכה הראשונה. גם זו בריכה יפה ונעימה.

    לאחר מכן נמשיך עם הסימון הכחול, ולאחר 200 מטר יש שביל שחור העולה לכיוון כפר אדומים. אנו נמשיך במורד הנחל עם הסימון הכחול, ולאחר עוד 200 מטר נגיע לבריכה נוספת הנקראת 'הצ׳יבלבל'.

    המשך הדרך בנחל עם הסימון הכחול עוברת בין בריכות יפות, ירידות ועליות ולעיתים יתדות העוזרות להתגבר על מצוקים. לאורך הנחל נראות מערות רבות.
    לאחר הליכה של כ־1.5 ק״מ נגיע לרחבה גדולה עם בריכה עמוקה ויפה הנקראת 'יונתן הקטן'. גם כאן אפשר לנוח, לאכול ולטבול במים.

    משם נמשיך בסימון הכחול העובר בסבך עצי במבוק ומטפס על הגדה הדרומית. לאחר עוד חצי קילומטר נשפך נחל מכמש לתוך נחל פרת, ובנקודה זו הסימון הכחול מתחבר לירוק המוביל לכביש אלון.

    מכאן ואילך המים בנחל מזוהמים בביוב מנחל מכמש, ולכן אין להיכנס למים.
    לאחר עוד כחצי קילומטר נגיע לחניה של רשות הטבע והגנים, שבה בימי חג פועלת תחנת מידע.

    המשך המסלול מעין פואר ועד עין קלט סגור בשל שיפוצים במעיין הפועם ועקב זיהום הנחל. נכון לעכשיו לא ניתן להמשיך בתוך הנחל אלא בשבילים חלופיים ללא סימון (הדרכה בעל פה). המרחק מעין פואר לעין קלט כ־4 ק״מ. עין קלט עצמו עדיין מזוהם ואין להיכנס למים.

    מעין קלט נעלה לכיוון מצפה יריחו בשביל עפר נוח 4×4 בסימון שחור. העלייה נמשכת כ־2 ק״מ (40 – 60 דקות).
    מהחניה בתצפית שבראש השביל ניתן להזמין הסעה חזרה לצימר בו נישן הלילה.`
        : `We begin Day 2 at Yonatan Lookout at the entrance to Nofei Prat.
    From the lookout we descend into the canyon following the green trail, about 1 km (30–40 minutes), a gentle downhill section.
    At the bottom we turn east (right) and rejoin the blue trail we left yesterday.

    After a few minutes we descend using handrails and metal holds to reach a deep pool known locally as “Ha-Nekik” (“the Crevice”) — a deep pool (in parts above head height, so non-swimmers must be cautious) with a lovely waterfall.
    Those who wish may take a refreshing dip.

    From there we continue roughly 700 m to two adjacent pools separated by a small waterfall, nicknamed “the Jacuzzi” by locals.
    After another 200 m a black-marked path branches up toward Kfar Adumim, but we continue downstream on the blue trail.
    After 200 m we reach another scenic pool called “Ha-Chiblabal.”

    The trail continues along the stream with small climbs and descents between rock formations and pools, sometimes aided by metal handholds.
    You’ll notice numerous caves carved into the cliffs.
    After about 1.5 km we arrive at a wide open area with a large beautiful pool known as “Little Yonatan.”
    It’s a great spot for a break, snack, and a cool swim.

    From there the blue trail winds through thick bamboo and climbs up the southern bank.
    Half a kilometer later Nahal Mikhmash joins Nahal Prat.
    At this confluence the blue trail merges with the green trail leading to the Alon Road.

    From this point the water becomes polluted by sewage flowing from Nahal Mikhmash — swimming is not possible.
    After another 0.5 km we reach the Israel Nature and Parks Authority parking lot, where on holidays an information booth operates.

    The path beyond this point — from Ein Fuar to Ein Qelt — is currently closed due to renovations and pollution.
    Alternative unmarked routes are possible (given verbally).
    The distance from Ein Fuar to Ein Qelt is about 4 km.
    Ein Qelt itself remains polluted and unsafe for swimming.

    From Ein Qelt we ascend toward Mitzpe Yericho along a comfortable 4×4 dirt road marked in black.
    The climb is 2 km (40–60 minutes).
    At the top lookout parking area, transportation can be arranged back to our lodge for the night.`,
      logo: cfImage("/images/logo.png"),
      gpxFile: '/routes/COURSE_411300434.gpx', // Added GPX file for day 2
      stats: { distance: "13", ascent: "321", descent: "623" }
    },
    { 
      id: 'day3', 
      dayNumber: 3,
      title: language === 'he' ? 'היום השלישי וההגעה' : 'Third Day and Arrival', 
      description: language === 'he'
        ? 'תיאור של היום השלישי'
        : 'Description of the third and final day - completing the journey with deep emotions and memories that will last forever',
      logo: cfImage("/images/logo.png"),
      gpxFile: '/routes/COURSE_409828775.gpx', // Added GPX file for day 3
      stats: { distance: "15", ascent: "250", descent: "250" }
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section
        className="relative flex items-center justify-center overflow-hidden z-0"
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >
        {/* Animated Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className={`hero-slide absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out`}
              style={{
                backgroundImage: `url(${image})`,
                opacity: currentImageIndex === index ? 1 : 0,
                position: "absolute",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>

        
        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-20 text-center"
          style={{ paddingTop: '6rem' }}
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
              className="text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
              style={{
                fontSize: "clamp(0.95rem, 0.8vw + 0.9rem, 1.4rem)",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)"
              }}
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
                      
                      {/* Left column: Day Info & Description */}
                      <div className="flex flex-col justify-start">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-14 flex items-center justify-center">
                            <img 
                              src={day.logo} 
                              alt="TNP Logo" 
                              className="w-full h-full object-contain drop-shadow-lg" 
                            />
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

                        <div className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line 
                            max-h-[250px] sm:max-h-[300px] md:max-h-[400px] 
                            overflow-y-auto pr-2 
                            scrollbar-thin scrollbar-thumb-desert-300 scrollbar-track-desert-100 
                            rounded-md">
                          {day.description}
                        </div>
                      </div>

                      {/* Right column: Map + Stats */}
                      <div className="flex flex-col items-center">
                        {/* Map Title */}
                        <div className="flex items-center gap-2 text-desert-600 font-medium mb-3">
                          <MapPin className="w-5 h-5" />
                          <span className="text-base">{currentContent.journey.mapTitle}</span>
                        </div>

                        {/* Garmin Map */}
                        <div className="w-full bg-gray-100 rounded-xl overflow-hidden shadow-inner 
                                        aspect-[2/1] sm:aspect-[16/9] md:aspect-video">
                          <GoogleMapsGPX 
                            gpxUrl={day.gpxFile} 
                            height="100%" 
                          />
                        </div>

                        {/* Trek Stats Section */}
                        <div className="mt-6 grid grid-cols-3 gap-4 w-full text-center">
                          <div className="flex flex-col items-center justify-center bg-desert-50 p-4 rounded-xl shadow-inner">
                            <Ruler className="w-6 h-6 text-desert-600 mb-2" />
                            <span className="text-lg font-semibold text-gray-800">
                              {day.stats.distance}
                            </span>
                            <span className="text-sm text-gray-500">
                              {language === 'he' ? 'מרחק (ק"מ)' : 'Distance (km)'}
                            </span>
                          </div>

                          <div className="flex flex-col items-center justify-center bg-desert-50 p-4 rounded-xl shadow-inner">
                            <TrendingUp className="w-6 h-6 text-desert-600 mb-2" />
                            <span className="text-lg font-semibold text-gray-800">
                              {day.stats.ascent}
                            </span>
                            <span className="text-sm text-gray-500">
                              {language === 'he' ? 'עלייה (מ)' : 'Ascent (m)'}
                            </span>
                          </div>

                          <div className="flex flex-col items-center justify-center bg-desert-50 p-4 rounded-xl shadow-inner">
                            <TrendingDown className="w-6 h-6 text-desert-600 mb-2" />
                            <span className="text-lg font-semibold text-gray-800">
                              {day.stats.descent}
                            </span>
                            <span className="text-sm text-gray-500">
                              {language === 'he' ? 'ירידה (מ)' : 'Descent (m)'}
                            </span>
                          </div>
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
                    <p className="text-lg text-gray-700 leading-relaxed font-medium whitespace-pre-line">
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
