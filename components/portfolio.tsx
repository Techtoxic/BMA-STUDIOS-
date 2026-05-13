"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getPortfolio, urlFor } from "@/lib/sanity";

const defaultCategories = ["All", "Wedding", "Portrait", "Event", "Studio", "Creative", "Product"];

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // Build dynamic categories from actual data
  const uniqueCategories = Array.from(new Set(portfolioItems.map(item => item.category).filter(Boolean)));
  const categories = ["All", ...uniqueCategories.map(c => c.charAt(0).toUpperCase() + c.slice(1))];

  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category?.toLowerCase() === activeCategory.toLowerCase());

  const getImageSrc = (item: PortfolioItem) => {
    if (item.image?.asset?._ref) {
      return urlFor(item.image).width(600).height(800).fit('crop').auto('format').quality(80).url();
    }
    return item.imageUrl || '';
  };

  const currentIndex = selectedImage !== null 
    ? filteredItems.findIndex(item => item._id === selectedImage)
    : -1;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
      : (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[newIndex]._id);
  };

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

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(item._id)}
            >
              <div className="relative overflow-hidden rounded-lg sm:rounded-lg">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={getImageSrc(item)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2">
                    <p className="text-xs font-medium text-white">{item.title}</p>
                    <span className="text-xs text-white/70 capitalize">{item.category}</span>
                  </div>
                </div>

                {/* View Icon */}
                <div className="absolute top-1.5 right-1.5 sm:top-1.5 sm:right-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
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
                src={getImageSrc(filteredItems.find(item => item._id === selectedImage) || filteredItems[0])}
                alt="Selected"
                width={800}
                height={600}
                className="max-h-[70vh] sm:max-h-[80vh] w-auto mx-auto object-contain rounded-lg"
              />
              <div className="mt-3 text-center">
                <p className="text-sm sm:text-base text-white">{filteredItems.find(item => item._id === selectedImage)?.title}</p>
                <p className="text-xs sm:text-sm text-white/50">{filteredItems.find(item => item._id === selectedImage)?.category}</p>
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
