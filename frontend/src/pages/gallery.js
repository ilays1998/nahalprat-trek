import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { X, ZoomIn, Mountain, Camera, Utensils, Bed } from "lucide-react";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { useLanguage } from "../layout";
import { cfImage } from "../utils/image";
import { filenameTitleMap } from "../utils";

// Image cache to prevent reloading
const imageCache = new Map();
const preloadQueue = new Set();

// ✅ GalleryImage now receives `onImageClick` as a prop
const GalleryImage = React.memo(({ image, index, allImages, onImageClick }) => {
  const [imageState, setImageState] = useState('loading');
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  const containerRef = useRef();

  // Intersection Observer for viewport detection
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);

          // Preload next 3 images when current comes into view
          const currentIndex = allImages.findIndex(img => img.id === image.id);
          for (let i = 1; i <= 3; i++) {
            const nextImage = allImages[currentIndex + i];
            if (nextImage && !preloadQueue.has(nextImage.url)) {
              preloadQueue.add(nextImage.url);
              preloadImage(nextImage.url);
            }
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [image.id, allImages]);

  // Preload function
  const preloadImage = useCallback((url) => {
    if (imageCache.has(url)) return Promise.resolve();

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(url, img);
        resolve();
      };
      img.onerror = resolve; // Don't block on errors
      img.src = url;
    });
  }, []);

  // Handle image loading
  useEffect(() => {
    if (!isInView) return;

    if (imageCache.has(image.url)) {
      setImageState('loaded');
      return;
    }

    setImageState('loading');
    const img = new Image();
    img.onload = () => {
      imageCache.set(image.url, img);
      setTimeout(() => setImageState('loaded'), 50);
    };
    img.onerror = () => setImageState('error');
    img.src = image.url;
  }, [isInView, image.url]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-gray-100 group cursor-pointer"
      style={{ aspectRatio: '1 / 1' }}
      onClick={() => onImageClick(image)}
    >
      {imageState === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-gray-100" />
      )}

      {isInView && (
        <img
          ref={imgRef}
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{
            opacity: imageState === 'loaded' ? 1 : 0,
            filter: imageState === 'loaded' ? 'blur(0px)' : 'blur(4px)',
            transition: 'opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease',
            willChange: imageState === 'loading' ? 'opacity, filter' : 'transform'
          }}
          loading={index < 8 ? "eager" : "lazy"}
          decoding="async"
        />
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none">
        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
});

export default function Gallery() {
  const { language, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const getTitle = (filename) =>
    (filenameTitleMap[filename] &&
      filenameTitleMap[filename][language]) ||
    filename.replace(/\.(jpg|jpeg|png)$/i, "");

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

  const landscapeImages = import.meta.glob('/public/images/landscapes/*.{jpg,JPG,jpeg,JPEG,png,PNG}', { eager: true, as: 'url' });
  const activitiesImages = import.meta.glob('/public/images/activities/*.{jpg,JPG,jpeg,JPEG,png,PNG}', { eager: true, as: 'url' });
  const mealsImages = import.meta.glob('/public/images/meals/*.{jpg,JPG,jpeg,JPEG,png,PNG}', { eager: true, as: 'url' });
  const accommodationImages = import.meta.glob('/public/images/accommodation/*.{jpg,JPG,jpeg,JPEG,png,PNG}', { eager: true, as: 'url' });

  const generateTitle = (filename, language) => {
    const entry = filenameTitleMap[filename];
    if (entry && entry[language]) {
      return entry[language];
    }
    return filename.replace(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/, '');
  };

    // ✅ Keep the title dynamic — only store filename once
  const createImageObjects = (imageMap, category) =>
    Object.entries(imageMap).map(([path, url], index) => ({
      id: `${category}-${index + 1}`,
      url: cfImage(url.replace("/public", "")),
      filename: path.split("/").pop(),
      category,
    }));

  const allImages = useMemo(
    () => [
      ...createImageObjects(landscapeImages, "landscape"),
      ...createImageObjects(activitiesImages, "activities"),
      ...createImageObjects(mealsImages, "meals"),
      ...createImageObjects(accommodationImages, "accommodation"),
    ],
    []
  );


  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const galleryImages = useMemo(
    () => (allImages.length > 0 ? shuffleArray(allImages) : []),
    [allImages]
  );

  const categories = Object.entries(currentContent.categories);

  const filteredImages =
  selectedCategory === 'all'
    ? galleryImages
    : allImages
        .filter((img) => img.category === selectedCategory)
        .sort((a, b) => {
          const titleA = getTitle(a.filename) || "";
          const titleB = getTitle(b.filename) || "";
          return titleA.localeCompare(titleB, language === "he" ? "he" : "en", { sensitivity: "base" });
        });



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

            const getButtonStyle = (key, isSelected) => {
              const base = {
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

              const colorConfigs = {
                all: {
                  gradient: 'linear-gradient(to right, rgb(217, 119, 6), rgb(234, 88, 12))',
                  border: 'rgb(217, 119, 6)',
                  text: 'rgb(180, 83, 9)'
                },
                landscape: {
                  gradient: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
                  border: 'rgb(34, 197, 94)',
                  text: 'rgb(22, 163, 74)'
                },
                activities: {
                  gradient: 'linear-gradient(to right, rgb(59, 130, 246), rgb(6, 182, 212))',
                  border: 'rgb(59, 130, 246)',
                  text: 'rgb(37, 99, 235)'
                },
                meals: {
                  gradient: 'linear-gradient(to right, rgb(249, 115, 22), rgb(239, 68, 68))',
                  border: 'rgb(249, 115, 22)',
                  text: 'rgb(234, 88, 12)'
                },
                accommodation: {
                  gradient: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))',
                  border: 'rgb(168, 85, 247)',
                  text: 'rgb(147, 51, 234)'
                }
              };

              const cfg = colorConfigs[key];
              if (!cfg) return base;

              return isSelected
                ? { ...base, background: cfg.gradient, borderColor: cfg.border, color: 'white' }
                : { ...base, borderColor: cfg.border, color: cfg.text, backgroundColor: 'transparent' };
            };

            return (
              <div
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={getButtonStyle(key, isSelected)}
                onMouseEnter={(e) => {
                  if (!isSelected) e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.target.style.backgroundColor = 'transparent';
                }}
              >
                {categoryStyle && isSelected && (() => {
                  const Icon = categoryStyle.icon;
                  return <Icon style={{ width: '16px', height: '16px' }} />;
                })()}
                {label}
              </div>
            );
          })}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gallery-grid">
          {filteredImages.map((image, index) => (
            <Card
              key={image.id}
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group gallery-card"
            >
              <div className="relative">
                <GalleryImage
                  image={image}
                  index={index}
                  allImages={filteredImages}
                  onImageClick={setSelectedImage} // ✅ FIX
                />
                {selectedCategory === 'all' && (
                  <div className="absolute top-3 right-3">
                    <div
                      className={`
                        ${categoryConfig[image.category]?.bgClass || 'bg-gradient-to-r from-gray-500 to-gray-600'}
                        ${categoryConfig[image.category]?.shadowClass || 'shadow-gray-500/30'}
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                        text-white text-xs font-medium shadow-lg
                        backdrop-blur-sm border border-white/20
                        transform transition-all duration-300 hover:scale-105
                      `}
                    >
                      {categoryConfig[image.category] && (() => {
                        const Icon = categoryConfig[image.category].icon;
                        return <Icon className="w-3 h-3" />;
                      })()}
                      <span>{currentContent.categories[image.category]}</span>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900">
                  {getTitle(image.filename)}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 gallery-modal">
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
                  loading="eager"
                  decoding="async"
                />
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {getTitle(selectedImage.filename)}
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
