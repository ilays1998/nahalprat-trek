
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils"; // TODO: Check if this file exists
import { Button } from "../components/ui/button"; // TODO: Check if this file exists
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; // TODO: Check if this file exists
import { Badge } from "../components/ui/badge"; // TODO: Check if this file exists
import { Check, Star, Users, Clock, Utensils, Bed, Car, ShieldCheck } from "lucide-react";

export default function Packages() {
  const language = 'he';
  const isRTL = language === 'he';

  const content = {
    he: {
      title: "חבילות הטיול",
      subtitle: "בחר את החבילה המתאימה לך מבין שלוש רמות איכות שונות",
      popular: "הכי פופולרי",
      bookNow: "הזמן עכשיו",
      perPerson: "לאדם",
      included: "כלול בחבילה",
      packages: {
        basic: {
          name: "בסיסי",
          price: "1,000",
          description: "חבילה בסיסית לחוויה מושלמת במדבר",
          features: [
            "3 ימי הליכה מודרכת",
            "לינה במאהלים משותפים",
            "ארוחות שדה בסיסיות",
            "מדריך מקצועי",
            "ציוד בטיחות בסיסי",
            "ביטול חינם"
          ]
        },
        pro: {
          name: "מקצועי",
          price: "2,000",
          description: "איזון מושלם בין נוחות לחוויה אותנטית",
          features: [
            "כל מה שבבסיסי ועוד:",
            "לינה בבקתות נוחות",
            "ארוחות איכותיות",
            "תחבורה פרטית",
            "ציוד מקצועי מלא",
            "ביטול חינם"
          ]
        },
        premium: {
          name: "פרימיום",
          price: "3,000",
          description: "חוויה יוקרתית ברמה הגבוהה ביותר",
          features: [
            "כל מה שבמקצועי ועוד:",
            "לינה בצימרים יוקרתיים",
            "ארוחות שף מקומיות",
            "תחבורה VIP",
            "חבילת ספא במדבר",
            "ביטול חינם"
          ]
        }
      }
    },
    en: {
      title: "Trek Packages",
      subtitle: "Choose the package that suits you from three different quality levels",
      popular: "Most Popular",
      bookNow: "Book Now",
      perPerson: "per person",
      included: "What's Included",
      packages: {
        basic: {
          name: "Basic",
          price: "1,000",
          description: "Essential package for a perfect desert experience",
          features: [
            "3 days guided hiking",
            "Shared tent accommodation",
            "Basic field meals",
            "Professional guide",
            "Basic safety equipment",
            "Free Cancellation"
          ]
        },
        pro: {
          name: "Pro",
          price: "2,000",
          description: "Perfect balance between comfort and authentic experience",
          features: [
            "Everything in Basic, plus:",
            "Comfortable hut accommodation",
            "Quality meals",
            "Private transportation",
            "Full professional equipment",
            "Free Cancellation"
          ]
        },
        premium: {
          name: "Premium",
          price: "3,000",
          description: "Luxury experience at the highest level",
          features: [
            "Everything in Pro, plus:",
            "Luxury cabin accommodation",
            "Local chef prepared meals",
            "VIP transportation",
            "Desert spa package",
            "Free Cancellation"
          ]
        }
      }
    }
  };

  const currentContent = content[language];

  const renderFeature = (feature, index) => {
    const isFreeCancellation = feature.toLowerCase().includes('cancellation') || feature.includes('ביטול');
    const Icon = isFreeCancellation ? ShieldCheck : Check;
    const color = isFreeCancellation ? 'text-green-600' : 'text-green-500';

    return (
      <li key={index} className="flex items-start gap-3">
        <Icon className={`w-4 h-4 ${color} mt-1 flex-shrink-0`} />
        <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
      </li>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {Object.entries(currentContent.packages).map(([key, pkg], index) => (
            <Card 
              key={key} 
              className={`border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden ${
                key === 'pro' ? 'ring-2 ring-amber-300 transform scale-105' : ''
              }`}
            >
              {key === 'pro' && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-center py-2 text-sm font-semibold">
                    {currentContent.popular}
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center pb-8 ${key === 'pro' ? 'pt-12' : 'pt-8'}`}>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </CardTitle>
                <div className="text-5xl font-bold text-amber-600 mb-4">
                  ₪{pkg.price}
                </div>
                <p className="text-gray-500 mb-2">{currentContent.perPerson}</p>
                <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
              </CardHeader>

              <CardContent className="space-y-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    {currentContent.included}
                  </h4>
                  <ul className="space-y-3">
                    {pkg.features.map(renderFeature)}
                  </ul>
                </div>

                <Link to={createPageUrl("Booking")} className="block mt-auto pt-4">
                  <Button 
                    className={`w-full text-lg py-6 ${
                      key === 'pro' 
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {currentContent.bookNow}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'he' ? 'מוכן להתחיל?' : 'Ready to Start?'}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {language === 'he' 
                ? 'בחר את התאריך המתאים לך והתחל את ההרפתקה במדבר היהודי'
                : 'Choose your preferred date and start your adventure in the Judean Desert'
              }
            </p>
            <Link to={createPageUrl("Booking")}>
              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90 text-lg px-12 py-4">
                {language === 'he' ? 'הזמן עכשיו' : 'Book Now'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
