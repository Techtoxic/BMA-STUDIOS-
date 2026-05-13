"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "Wedding", "Portrait", "Event", "Commercial"];

const portfolioItems = [
  { id: 1, title: "Garden Wedding", category: "Wedding", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop", likes: 234, orientation: "portrait" },
  { id: 2, title: "Corporate Headshot", category: "Portrait", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", likes: 156, orientation: "landscape" },
  { id: 3, title: "Product Launch", category: "Event", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop", likes: 189, orientation: "landscape" },
  { id: 4, title: "Fashion Editorial", category: "Commercial", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop", likes: 312, orientation: "portrait" },
  { id: 5, title: "Beach Ceremony", category: "Wedding", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop", likes: 278, orientation: "landscape" },
  { id: 6, title: "Studio Portrait", category: "Portrait", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop", likes: 198, orientation: "portrait" },
  { id: 7, title: "Birthday Party", category: "Event", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop", likes: 145, orientation: "landscape" },
  { id: 8, title: "Brand Campaign", category: "Commercial", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop", likes: 267, orientation: "landscape" },
];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const currentIndex = selectedImage !== null 
    ? filteredItems.findIndex(item => item.id === selectedImage)
    : -1;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
      : (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[newIndex].id);
  };

  return (
    <section id="portfolio" className="py-6 sm:py-12 bg-background">
      <div className="mx-auto max-w-[1600px] w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 sm:w-8 bg-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400">Portfolio</span>
          </div>
          <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
            Our Work
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5 sm:gap-1.5 mb-4 sm:mb-5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-2 sm:px-2.5 py-1 text-xs sm:text-[10px] rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? "bg-amber-400 text-background"
                  : "border border-border text-muted-foreground hover:border-amber-400 hover:text-amber-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="mb-2 sm:mb-2 break-inside-avoid group cursor-pointer"
              onClick={() => setSelectedImage(item.id)}
            >
              <div className="relative overflow-hidden rounded-lg sm:rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={item.orientation === 'portrait' ? 400 : 200}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2">
                    <p className="text-xs font-medium text-white">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-white/70">{item.category}</span>
                      <div className="flex items-center gap-0.5">
                        <Heart className="h-2.5 w-2.5 sm:h-2.5 sm:w-2.5 text-amber-400" strokeWidth={1.5} />
                        <span className="text-xs text-white/70">{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Icon */}
                <div className="absolute top-1.5 right-1.5 sm:top-1.5 sm:right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="h-3 w-3 sm:h-3 sm:w-3 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
            
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-2 sm:left-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            >
              <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
            </button>

            <div className="max-w-4xl max-h-[80vh] w-full">
              <Image
                src={filteredItems.find(item => item.id === selectedImage)?.image || ''}
                alt="Selected"
                width={800}
                height={600}
                className="max-h-[70vh] sm:max-h-[80vh] w-auto mx-auto object-contain rounded-lg"
              />
              <div className="mt-3 text-center">
                <p className="text-sm sm:text-base text-white">{filteredItems.find(item => item.id === selectedImage)?.title}</p>
                <p className="text-xs sm:text-sm text-white/50">{filteredItems.find(item => item.id === selectedImage)?.category}</p>
              </div>
            </div>

            <button
              onClick={() => navigateImage('next')}
              className="absolute right-2 sm:right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            >
              <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
