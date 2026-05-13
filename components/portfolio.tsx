"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Eye, X, ChevronLeft, ChevronRight, ArrowLeft, Layers } from "lucide-react";
import { getPortfolio, urlFor } from "@/lib/sanity";

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  image: any;
  imageUrl?: string;
  client?: string;
  date?: string;
  featured?: boolean;
}

export function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mobileSlide, setMobileSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const data = await getPortfolio();
        setPortfolioItems(data);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  const getImageSrc = (item: PortfolioItem, w = 600, h = 800) => {
    if (item.image?.asset?._ref) {
      return urlFor(item.image).width(w).height(h).fit("crop").auto("format").quality(80).url();
    }
    return item.imageUrl || "";
  };

  // Group items by category
  const categoryMap: { [key: string]: PortfolioItem[] } = {};
  portfolioItems.forEach((item) => {
    const cat = item.category?.charAt(0).toUpperCase() + item.category?.slice(1);
    if (cat) {
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(item);
    }
  });

  // Add "All" as last category
  const categoryNames = [...Object.keys(categoryMap)];
  if (portfolioItems.length > 0) {
    categoryNames.push("All");
    categoryMap["All"] = portfolioItems;
  }

  // Items for the opened category
  const galleryItems = openCategory ? categoryMap[openCategory] || [] : [];

  // Reset slide when category changes
  useEffect(() => {
    setMobileSlide(0);
    setIsAutoPlaying(true);
  }, [openCategory]);

  // Auto-advance on mobile
  useEffect(() => {
    if (!openCategory || galleryItems.length <= 1 || !isAutoPlaying) return;
    autoPlayRef.current = setInterval(() => {
      setMobileSlide((prev) => (prev + 1) % galleryItems.length);
    }, 3000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [openCategory, galleryItems.length, isAutoPlaying]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setMobileSlide((prev) => (prev + 1) % galleryItems.length);
      } else {
        setMobileSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
      }
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, [galleryItems.length]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const currentIndex =
    selectedImage !== null ? galleryItems.findIndex((item) => item._id === selectedImage) : -1;

  const navigateImage = (direction: "prev" | "next") => {
    if (currentIndex === -1) return;
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + galleryItems.length) % galleryItems.length
        : (currentIndex + 1) % galleryItems.length;
    setSelectedImage(galleryItems[newIndex]._id);
  };

  // Loading
  if (loading) {
    return (
      <section id="portfolio" className="py-6 sm:py-12 bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 sm:w-8 bg-amber-400" />
              <span className="text-xs uppercase tracking-widest text-amber-400">Portfolio</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
              Our Work
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  // Empty
  if (portfolioItems.length === 0) {
    return (
      <section id="portfolio" className="py-6 sm:py-12 bg-background">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 sm:w-8 bg-amber-400" />
              <span className="text-xs uppercase tracking-widest text-amber-400">Portfolio</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
              Our Work
            </h2>
          </div>
          <p className="text-center text-muted-foreground text-sm">Coming soon</p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-6 sm:py-12 bg-background">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 sm:w-8 bg-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400">Portfolio</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
              {openCategory ? openCategory : "Browse Categories"}
            </h2>
            {openCategory && (
              <button
                onClick={() => {
                  setOpenCategory(null);
                  setSelectedImage(null);
                }}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back</span>
              </button>
            )}
          </div>
        </div>

        {/* ===== CATEGORY CARDS VIEW ===== */}
        {!openCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categoryNames.map((catName, catIndex) => {
              const items = categoryMap[catName];
              const previewItems = items.slice(0, 3);

              return (
                <div
                  key={catName}
                  className="group cursor-pointer transition-all duration-500 hover:-translate-y-2"
                  onClick={() => setOpenCategory(catName)}
                  style={{ animationDelay: `${catIndex * 100}ms` }}
                >
                  {/* Stacked cards */}
                  <div className="relative aspect-[3/4] transition-all duration-500 group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]  rounded-xl">
                    {previewItems.map((item, i) => {
                      const total = previewItems.length;
                      const rotation = i === 0 ? -3 : i === 1 ? 0 : 3;
                      const hoverRotation = i === 0 ? -6 : i === 1 ? 0 : 6;
                      const translateY = i === 0 ? 4 : i === 1 ? 0 : 4;
                      const scale = i === 1 ? 1 : 0.95;
                      const zIndex = i === 1 ? 3 : i === 0 ? 1 : 2;

                      return (
                        <div
                          key={item._id}
                          className="absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl shadow-lg transition-all duration-500 ease-out group-hover:shadow-2xl"
                          style={{
                            transform: `rotate(${rotation}deg) translateY(${translateY}px) scale(${scale})`,
                            zIndex,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = `rotate(${hoverRotation}deg) translateY(${i === 1 ? -4 : 6}px) scale(${i === 1 ? 1.02 : 0.93})`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = `rotate(${rotation}deg) translateY(${translateY}px) scale(${scale})`;
                          }}
                        >
                          <Image
                            src={getImageSrc(item, 400, 500)}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {i === (total > 1 ? 1 : 0) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          )}
                        </div>
                      );
                    })}

                    {/* Count badge */}
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 transition-all duration-300 group-hover:bg-amber-400/90 group-hover:scale-110">
                      <Layers className="h-2.5 w-2.5 text-amber-400 group-hover:text-background transition-colors" />
                      <span className="text-[9px] text-white font-medium group-hover:text-background transition-colors">{items.length}</span>
                    </div>

                    {/* Hover border glow */}
                    <div className="absolute inset-0 rounded-lg sm:rounded-xl border-2 border-transparent group-hover:border-amber-400/40 transition-all duration-500 z-[4] pointer-events-none" />

                    {/* Browse label on hover */}
                    <div className="absolute inset-0 z-[5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-amber-400 text-[10px] sm:text-xs font-medium rounded-full border border-amber-400/30">
                        Browse →
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-amber-400 transition-colors duration-300 capitalize">
                      {catName}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground group-hover:text-amber-400/60 transition-colors duration-300">
                      {items.length} {items.length === 1 ? "photo" : "photos"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== GALLERY VIEW (open category) ===== */}
        {openCategory && (
          <>
            {/* Mobile Carousel */}
            <div
              className="md:hidden relative overflow-hidden rounded-xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative aspect-[3/4] w-full">
                {galleryItems.map((item, idx) => (
                  <div
                    key={item._id}
                    className="absolute inset-0 transition-all duration-500 ease-in-out"
                    style={{
                      transform: `translateX(${(idx - mobileSlide) * 100}%)`,
                      opacity: idx === mobileSlide ? 1 : 0.4,
                    }}
                  >
                    <Image
                      src={getImageSrc(item)}
                      alt={item.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={idx === mobileSlide}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <span className="text-xs text-white/70 capitalize">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3 pb-1">
                {galleryItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setMobileSlide(idx); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 5000); }}
                    className={`rounded-full transition-all duration-300 ${
                      idx === mobileSlide
                        ? "w-5 h-1.5 bg-amber-400"
                        : "w-1.5 h-1.5 bg-white/30"
                    }`}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="text-[10px] text-white font-medium">
                  {mobileSlide + 1} / {galleryItems.length}
                </span>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-2">
              {galleryItems.map((item) => (
                <div
                  key={item._id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(item._id)}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={getImageSrc(item)}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-xs font-medium text-white">{item.title}</p>
                        <span className="text-xs text-white/70 capitalize">{item.category}</span>
                      </div>
                    </div>

                    {/* View Icon */}
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye className="h-3 w-3 text-white" strokeWidth={1.5} />
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
                  onClick={() => navigateImage("prev")}
                  className="absolute left-2 sm:left-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                >
                  <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
                </button>

                <div className="max-w-4xl max-h-[80vh] w-full">
                  <Image
                    src={getImageSrc(
                      galleryItems.find((item) => item._id === selectedImage) || galleryItems[0]
                    )}
                    alt="Selected"
                    width={800}
                    height={600}
                    className="max-h-[70vh] sm:max-h-[80vh] w-auto mx-auto object-contain rounded-lg"
                  />
                  <div className="mt-3 text-center">
                    <p className="text-sm sm:text-base text-white">
                      {galleryItems.find((item) => item._id === selectedImage)?.title}
                    </p>
                    <p className="text-xs sm:text-sm text-white/50 capitalize">
                      {galleryItems.find((item) => item._id === selectedImage)?.category}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-2 sm:right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                >
                  <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
