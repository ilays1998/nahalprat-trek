import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { X, ZoomIn, Camera, Footprints, Utensils, Bed, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { useLanguage } from "../layout";
import { loadAllGalleryImages, categoryConfig as galleryCategoryConfig } from "../utils/galleryLoader";
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

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-center justify-center pointer-events-none">
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

  const categoryStyleConfig = {
    landscape: {
      icon: Camera,
      bgClass: "bg-gradient-to-r from-green-500 to-emerald-600",
      shadowClass: "shadow-green-500/30"
    },
    activities: {
      icon: Footprints,
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

  

  const generateTitle = (filename, language) => {
    const entry = filenameTitleMap[filename];
    if (entry && entry[language]) {
      return entry[language];
    }
    return filename.replace(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/, '');
  };

    // ✅ Keep the title dynamic — only store filename once
  

  const allImages = useMemo(() => loadAllGalleryImages(), []);


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

  // Navigation functions for modal
  const currentImageIndex = useMemo(() => {
    if (!selectedImage) return -1;
    return filteredImages.findIndex(img => img.id === selectedImage.id);
  }, [selectedImage, filteredImages]);

  const canGoNext = currentImageIndex < filteredImages.length - 1;
  const canGoPrev = currentImageIndex > 0;

  const goToNext = useCallback(() => {
    if (canGoNext && currentImageIndex >= 0) {
      setSelectedImage(filteredImages[currentImageIndex + 1]);
    }
  }, [canGoNext, currentImageIndex, filteredImages]);

  const goToPrev = useCallback(() => {
    if (canGoPrev && currentImageIndex >= 0) {
      setSelectedImage(filteredImages[currentImageIndex - 1]);
    }
  }, [canGoPrev, currentImageIndex, filteredImages]);



  // Keyboard navigation for modal
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        if (isRTL) goToPrev();
        else goToNext();
      }
      if (e.key === 'ArrowLeft') {
        if (isRTL) goToNext();
        else goToPrev();
      }
      if (e.key === 'Escape') setSelectedImage(null);
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, goToNext, goToPrev, isRTL]);



  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-desert-50 to-desert-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-desert-800 mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(([key, label]) => {
            const categoryStyle = categoryStyleConfig[key];
            const isSelected = selectedCategory === key;

            const getButtonStyle = (key, isSelected) => {
              const base = {
                padding: '12px 24px',
                borderRadius: '16px',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              };

              return isSelected
                ? { 
                    ...base, 
                    background: '#c56f19', 
                    borderColor: 'rgba(220, 163, 89, 0.5)', 
                    color: 'white',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1.05)'
                  }
                : { 
                    ...base, 
                    borderColor: '#e3c992', 
                    color: '#743f1f', 
                    backgroundColor: 'rgba(247, 233, 205, 0.8)' 
                  };
            };

            return (
              <div
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={getButtonStyle(key, isSelected)}
                onMouseEnter={(e) => {
                  if (!isSelected) e.target.style.backgroundColor = 'rgba(241, 221, 184, 1)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.target.style.backgroundColor = 'rgba(247, 233, 205, 0.8)';
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
              className="bg-desert-solid border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group gallery-card"
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
                      className="flex items-center justify-center w-8 h-8 rounded-full text-desert-600 shadow-lg backdrop-blur-sm border border-desert-600/50 transform transition-all duration-300 hover:scale-105 hover:bg-desert-400/10"
                    >
                      {categoryStyleConfig[image.category] && (() => {
                        const Icon = categoryStyleConfig[image.category].icon;
                        return <Icon className="w-4 h-4" />;
                      })()}
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

        {/* Enhanced Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl max-h-[95vh] p-0 gallery-modal bg-black/95 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white/10">
            {selectedImage && (
              <div className="relative flex flex-col h-full">
                {/* Top Controls */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent">
                  <div className="flex justify-between items-center">
                    <div className="text-white/80 text-sm font-medium">
                      {currentImageIndex + 1} / {filteredImages.length}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/10 text-white hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-105"
                      onClick={() => setSelectedImage(null)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Main Image Container */}
                <div className="relative flex-1 flex items-center justify-center bg-black min-h-[400px]">
                  {/* Navigation Arrows */}
                  {canGoPrev && (
                    <button
                      className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 w-12 h-12 flex items-center justify-center border border-white/20`}
                      onClick={goToPrev}
                      aria-label="Previous image"
                    >
                      {isRTL ? <ChevronRight className="w-6 h-6 text-white" /> : <ChevronLeft className="w-6 h-6 text-white" />}
                    </button>
                  )}
                  
                  {canGoNext && (
                    <button
                      className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 w-12 h-12 flex items-center justify-center border border-white/20`}
                      onClick={goToNext}
                      aria-label="Next image"
                    >
                      {isRTL ? <ChevronLeft className="w-6 h-6 text-white" /> : <ChevronRight className="w-6 h-6 text-white" />}
                    </button>
                  )}

                  {/* Main Image */}
                  <img
                    src={selectedImage.url}
                    alt={getTitle(selectedImage.filename)}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300"
                    loading="eager"
                    decoding="async"
                    style={{ 
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                    }}
                  />
                </div>

                {/* Thumbnail Navigation (for larger screens) - positioned above text */}
                <div className="hidden md:block absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex gap-2 bg-black/60 backdrop-blur-sm rounded-full p-2 border border-white/10">
                    {filteredImages.slice(Math.max(0, currentImageIndex - 2), currentImageIndex + 3).map((img, idx) => {
                      const actualIndex = Math.max(0, currentImageIndex - 2) + idx;
                      const isCurrentImage = actualIndex === currentImageIndex;
                      
                      return (
                        <button
                          key={img.id}
                          onClick={() => setSelectedImage(img)}
                          className={`w-10 h-10 rounded-lg overflow-hidden transition-all duration-200 border-2 ${
                            isCurrentImage 
                              ? 'border-white scale-110 shadow-lg' 
                              : 'border-white/30 hover:border-white/60 hover:scale-105'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Info Panel */}
                <div className="bg-gradient-to-t from-black/90 to-transparent pt-8 pb-6 px-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {getTitle(selectedImage.filename)}
                  </h3>
                  <div className="flex items-center justify-center gap-4">
                    <Badge className="bg-desert-600 text-white border-desert-400 px-3 py-1 rounded-full">
                      {currentContent.categories[selectedImage.category]}
                    </Badge>
                    <div className="text-white/60 text-sm">
                      {selectedCategory === 'all' ? 'All Categories' : currentContent.categories[selectedCategory]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
