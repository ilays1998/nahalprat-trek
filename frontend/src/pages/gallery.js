import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { X, ZoomIn, Mountain, Camera, Utensils, Bed } from "lucide-react";
import { Dialog, DialogContent } from "../components/ui/dialog";
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
        activities: "פעילויות",
        accommodation: "לינה",
        meals: "ארוחות"
      }
    },
    en: {
      title: "Photo Gallery",
      subtitle: "Experience the beauty of Nahal Prat through our photos",
      categories: {
        all: "All",
        landscape: "Landscapes",
        activities: "Activities",
        accommodation: "Accommodation",
        meals: "Meals"
      }
    }
  };

  const currentContent = content[language];

  // Category icons and styles
  const categoryConfig = {
    landscape: {
      icon: Mountain,
      bgClass: "bg-gradient-to-r from-green-500 to-emerald-600",
      shadowClass: "shadow-green-500/30"
    },
    activities: {
      icon: Camera,
      bgClass: "bg-gradient-to-r from-blue-500 to-cyan-600",
      shadowClass: "shadow-blue-500/30"
    },
    meals: {
      icon: Utensils,
      bgClass: "bg-gradient-to-r from-orange-500 to-red-600",
      shadowClass: "shadow-orange-500/30"
    },
    accommodation: {
      icon: Bed,
      bgClass: "bg-gradient-to-r from-purple-500 to-pink-600",
      shadowClass: "shadow-purple-500/30"
    }
  };

  // Auto-load images using Vite's import.meta.glob (eager loading for smooth performance)
  const landscapeImages = import.meta.glob('/public/images/landscapes/*.{jpg,JPG,jpeg,JPEG,png,PNG}', { eager: true, as: 'url' });
  const activitiesImages = import.meta.glob('/public/images/activities/*.{jpg,JPG,jpeg,JPEG,png,PNG}', { eager: true, as: 'url' });
  const mealsImages = import.meta.glob('/public/images/meals/*.{jpg,JPG,jpeg,JPEG,png,PNG}', { eager: true, as: 'url' });
  const accommodationImages = import.meta.glob('/public/images/accommodation/*.{jpg,JPG,jpeg,JPEG,png,PNG}', { eager: true, as: 'url' });

  // Generate title from filename only
  const generateTitle = (filename) => {
    return filename.replace(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/, '');
  };

  // Convert imported images to gallery format
  const createImageObjects = (imageMap, category) => {
    return Object.entries(imageMap).map(([path, url], index) => {
      const filename = path.split('/').pop();
      return {
        id: `${category}-${index + 1}`,
        url: url.replace('/public', ''), // Remove /public prefix for correct URL
        title: generateTitle(filename),
        category: category
      };
    });
  };

  // Combine all images and mix them for better visual variety
  const allImages = [
    ...createImageObjects(landscapeImages, 'landscape'),
    ...createImageObjects(activitiesImages, 'activities'),
    ...createImageObjects(mealsImages, 'meals'),
    ...createImageObjects(accommodationImages, 'accommodation')
  ];

  // Mix the images for better visual variety (interleave different categories)
  const galleryImages = allImages.sort((a, b) => {
    // Sort by a combination of category and filename to create consistent mixed order
    const categoryOrder = { landscape: 0, activities: 1, accommodation: 2, meals: 3 };
    const aCategoryIndex = categoryOrder[a.category] || 999;
    const bCategoryIndex = categoryOrder[b.category] || 999;
    
    // If same category, sort by ID, otherwise alternate categories
    if (aCategoryIndex === bCategoryIndex) {
      return a.id.localeCompare(b.id);
    }
    
    // Create a mixed pattern by using modulo
    const aIndex = parseInt(a.id.split('-')[1]) || 0;
    const bIndex = parseInt(b.id.split('-')[1]) || 0;
    return (aCategoryIndex + aIndex * 0.1) - (bCategoryIndex + bIndex * 0.1);
  });

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
          {categories.map(([key, label]) => {
            const categoryStyle = categoryConfig[key];
            const isSelected = selectedCategory === key;
            
            // Define colors for each category
            const getButtonStyle = (key, isSelected) => {
              const baseStyle = {
                padding: '12px 24px',
                borderRadius: '6px',
                border: '2px solid',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              };
              
              if (key === 'all') {
                return {
                  ...baseStyle,
                  ...(isSelected ? {
                    background: 'linear-gradient(to right, rgb(217, 119, 6), rgb(234, 88, 12))',
                    borderColor: 'rgb(217, 119, 6)',
                    color: 'white'
                  } : {
                    borderColor: 'rgb(252, 231, 202)',
                    color: 'rgb(180, 83, 9)',
                    backgroundColor: 'transparent'
                  })
                };
              }
              
              const colorConfigs = {
                landscape: {
                  gradient: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
                  borderColor: 'rgb(34, 197, 94)',
                  textColor: 'rgb(22, 163, 74)'
                },
                activities: {
                  gradient: 'linear-gradient(to right, rgb(59, 130, 246), rgb(6, 182, 212))',
                  borderColor: 'rgb(59, 130, 246)',
                  textColor: 'rgb(37, 99, 235)'
                },
                meals: {
                  gradient: 'linear-gradient(to right, rgb(249, 115, 22), rgb(239, 68, 68))',
                  borderColor: 'rgb(249, 115, 22)',
                  textColor: 'rgb(234, 88, 12)'
                },
                accommodation: {
                  gradient: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))',
                  borderColor: 'rgb(168, 85, 247)',
                  textColor: 'rgb(147, 51, 234)'
                }
              };
              
              const config = colorConfigs[key];
              if (!config) return baseStyle;
              
              return {
                ...baseStyle,
                ...(isSelected ? {
                  background: config.gradient,
                  borderColor: config.borderColor,
                  color: 'white'
                } : {
                  borderColor: config.borderColor,
                  color: config.textColor,
                  backgroundColor: 'transparent'
                })
              };
            };
            
            return (
              <div
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={getButtonStyle(key, isSelected)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {categoryStyle && isSelected && (() => {
                  const IconComponent = categoryStyle.icon;
                  return <IconComponent style={{ width: '16px', height: '16px' }} />;
                })()}
                {label}
              </div>
            );
          })}
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
                {/* Modern Category Badge - Only show when viewing "All" */}
                {selectedCategory === 'all' && (
                  <div className="absolute top-3 right-3">
                    <div className={`
                      ${categoryConfig[image.category]?.bgClass || 'bg-gradient-to-r from-gray-500 to-gray-600'}
                      ${categoryConfig[image.category]?.shadowClass || 'shadow-gray-500/30'}
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                      text-white text-xs font-medium shadow-lg
                      backdrop-blur-sm border border-white/20
                      transform transition-all duration-300 hover:scale-105
                    `}>
                      {categoryConfig[image.category] && (() => {
                        const IconComponent = categoryConfig[image.category].icon;
                        return <IconComponent className="w-3 h-3" />;
                      })()}
                      <span>{currentContent.categories[image.category]}</span>
                    </div>
                  </div>
                )}
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