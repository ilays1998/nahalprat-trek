import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card"; // TODO: Check if this file exists
import { Badge } from "../components/ui/badge"; // TODO: Check if this file exists
import { Button } from "../components/ui/button"; // TODO: Check if this file exists
import { X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "../components/ui/dialog"; // TODO: Check if this file exists
import { useLanguage } from "../layout";

export default function Gallery() {
  const { language, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const content = {
    he: {
      title: "גלריית תמונות",
      subtitle: "חווה את יופיו של נחל פרת דרך התמונות שלנו",
      categories: {
        all: "הכל",
        landscape: "נופים",
        accommodation: "לינה",
        meals: "ארוחות",
        activities: "פעילויות"
      }
    },
    en: {
      title: "Photo Gallery",
      subtitle: "Experience the beauty of Nahal Prat through our photos",
      categories: {
        all: "All",
        landscape: "Landscapes",
        accommodation: "Accommodation",
        meals: "Meals",
        activities: "Activities"
      }
    }
  };

  const currentContent = content[language];

  const galleryImages = [
    {
      id: 1,
      url: "/images/desert-landscape-1.jpg",
      title: language === 'he' ? "נופי המדבר" : "Desert Landscapes",
      category: "landscape"
    },
    {
      id: 2,
      url: "/images/nahal-prat-1.jpg",
      title: language === 'he' ? "נחל פרת" : "Nahal Prat Stream",
      category: "landscape"
    },
    {
      id: 3,
      url: "/images/desert-camping-1.jpg",
      title: language === 'he' ? "קמפינג במדבר" : "Desert Camping",
      category: "accommodation"
    },
    {
      id: 4,
      url: "/images/outdoor-dining-1.jpg",
      title: language === 'he' ? "ארוחה באוויר הפתוח" : "Outdoor Dining",
      category: "meals"
    },
    {
      id: 5,
      url: "/images/trail-hiking-1.jpg",
      title: language === 'he' ? "הליכה בשביל" : "Trail Hiking",
      category: "activities"
    },
    {
      id: 6,
      url: "/images/desert-sunrise-1.jpg",
      title: language === 'he' ? "זריחה במדבר" : "Desert Sunrise",
      category: "landscape"
    }
  ];

  const categories = Object.entries(currentContent.categories);
  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              onClick={() => setSelectedCategory(key)}
              className={
                selectedCategory === key 
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90"
                  : "border-amber-200 text-amber-700 hover:bg-amber-50"
              }
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card 
              key={image.id} 
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-800">
                    {currentContent.categories[image.category]}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900">{image.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            {selectedImage && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70 z-10"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedImage.title}
                  </h3>
                  <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                    {currentContent.categories[selectedImage.category]}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}