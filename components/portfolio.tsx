"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const categories = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Weddings" },
  { id: "portrait", label: "Portraits" },
  { id: "fashion", label: "Fashion" },
  { id: "events", label: "Events" },
];

const portfolioItems = [
  { id: 1, category: "wedding", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", title: "Sarah & James Wedding", orientation: "landscape" },
  { id: 2, category: "portrait", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", title: "Portrait Session", orientation: "portrait" },
  { id: 3, category: "fashion", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", title: "Fashion Editorial", orientation: "portrait" },
  { id: 4, category: "wedding", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80", title: "Beach Wedding", orientation: "landscape" },
  { id: 5, category: "events", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", title: "Corporate Event", orientation: "landscape" },
  { id: 6, category: "portrait", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", title: "Studio Portrait", orientation: "portrait" },
  { id: 7, category: "fashion", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", title: "Outdoor Fashion", orientation: "landscape" },
  { id: 8, category: "wedding", image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80", title: "Traditional Wedding", orientation: "portrait" },
  { id: 9, category: "events", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80", title: "Birthday Celebration", orientation: "landscape" },
  { id: 10, category: "portrait", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", title: "Professional Headshot", orientation: "portrait" },
  { id: 11, category: "fashion", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", title: "Street Fashion", orientation: "portrait" },
  { id: 12, category: "wedding", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80", title: "Garden Wedding", orientation: "landscape" },
];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredItems = activeCategory === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  useEffect(() => {
    setVisibleItems([]);
    const timer = setTimeout(() => {
      filteredItems.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 80);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeCategory, filteredItems.length]);

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxImage === null) return;
    const currentIndex = filteredItems.findIndex(item => item.id === lightboxImage);
    if (direction === "prev") {
      const newIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
      setLightboxImage(filteredItems[newIndex].id);
    } else {
      const newIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
      setLightboxImage(filteredItems[newIndex].id);
    }
  };

  return (
    <section id="portfolio" className="relative py-12 md:py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="mb-2 md:mb-3 text-xs md:text-sm font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] text-amber-400">
            Our Work
          </p>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Portfolio <span className="gradient-text">Gallery</span>
          </h2>
          <p className="mx-auto max-w-xl text-xs md:text-sm text-muted-foreground">
            Browse our collection of memorable moments captured with passion.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-8 md:mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-amber-400 to-amber-600 text-background shadow-lg shadow-amber-500/30"
                  : "bg-secondary text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div 
          ref={gridRef}
          className="columns-2 md:columns-3 gap-2 md:gap-3 lg:gap-4 space-y-2 md:space-y-3 lg:space-y-4"
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`break-inside-avoid group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer transition-all duration-500 ${
                visibleItems.includes(index) 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
              onClick={() => setLightboxImage(item.id)}
            >
              <div className={`relative ${item.orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-amber-400 text-background mb-2 md:mb-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                    <ZoomIn className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <p className="text-foreground font-medium text-xs md:text-sm text-center px-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                    {item.title}
                  </p>
                  <p className="text-amber-400 text-[10px] md:text-xs capitalize transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200">
                    {item.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-amber-400 hover:text-background"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-amber-400 hover:text-background"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-amber-400 hover:text-background"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div 
            className="relative max-w-4xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const item = portfolioItems.find(i => i.id === lightboxImage);
              if (!item) return null;
              return (
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain rounded-xl md:rounded-2xl"
                  />
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
