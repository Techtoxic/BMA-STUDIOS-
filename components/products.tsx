"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Star, X, ChevronLeft, ChevronRight, ArrowLeft, Layers } from "lucide-react";
import { getProducts, urlFor } from "@/lib/sanity";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: any;
  imageUrl?: string;
  rating: number;
  inStock: boolean;
  description?: string;
  featured?: boolean;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  function getImageSrc(product: Product, width = 600, height = 800) {
    if (product.image?.asset?._ref) {
      return urlFor(product.image).width(width).height(height).fit("crop").auto("format").quality(85).url();
    }
    return product.imageUrl || product.image || "/placeholder.jpg";
  }

  // Group products by category
  const categoryMap: { [key: string]: Product[] } = {};
  products.forEach((p) => {
    const cat = p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "Other";
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(p);
  });
  const categoryNames = Object.keys(categoryMap);

  // Items in open category
  const categoryItems = openCategory ? categoryMap[openCategory] || [] : [];

  // Lightbox navigation
  function openLightbox(product: Product) {
    setSelectedProduct(product);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setSelectedProduct(null);
    document.body.style.overflow = "";
  }

  function navigateLightbox(dir: number) {
    if (!selectedProduct) return;
    const idx = categoryItems.findIndex((p) => p._id === selectedProduct._id);
    const next = (idx + dir + categoryItems.length) % categoryItems.length;
    setSelectedProduct(categoryItems[next]);
  }

  // Keyboard nav for lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedProduct) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedProduct, categoryItems]);

  const lightboxIndex = selectedProduct
    ? categoryItems.findIndex((p) => p._id === selectedProduct._id)
    : -1;

  if (loading) {
    return (
      <section id="products" className="py-6 sm:py-12 bg-secondary/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader openCategory={null} onBack={() => {}} />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="products" className="py-6 sm:py-12 bg-secondary/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader openCategory={null} onBack={() => {}} />
          <p className="text-center text-muted-foreground text-sm">Coming soon</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="products" className="py-6 sm:py-12 bg-secondary/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader
            openCategory={openCategory}
            onBack={() => {
              setOpenCategory(null);
              setSelectedProduct(null);
            }}
          />

          {/* ===== CATEGORY CARDS VIEW ===== */}
          {!openCategory && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categoryNames.map((catName) => {
                const items = categoryMap[catName];
                const total = items.length;
                const previews = items.slice(0, 2);

                return (
                  <div
                    key={catName}
                    className="group cursor-pointer"
                    onClick={() => setOpenCategory(catName)}
                  >
                    <div className="relative rounded-lg sm:rounded-xl overflow-hidden">
                      {previews.map((item, i) => (
                        <div
                          key={item._id}
                          className="relative overflow-hidden"
                          style={{
                            position: i === 0 ? "relative" : "absolute",
                            inset: i === 0 ? undefined : 0,
                            zIndex: i === 0 ? 1 : 2,
                            transform: i === 1 ? "translate(6px, -6px)" : undefined,
                            borderRadius: "inherit",
                          }}
                        >
                          <div className={`relative ${i === 0 ? "aspect-[3/4]" : "aspect-[3/4]"} w-full`}>
                            <Image
                              src={getImageSrc(item, 400, 500)}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {i === (total > 1 ? 1 : 0) && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Count badge */}
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 transition-all duration-300 group-hover:bg-amber-400/90 group-hover:scale-110">
                        <Layers className="h-2.5 w-2.5 text-amber-400 group-hover:text-background transition-colors" />
                        <span className="text-[9px] text-white font-medium group-hover:text-background transition-colors">{total}</span>
                      </div>

                      {/* Hover border glow */}
                      <div className="absolute inset-0 rounded-lg sm:rounded-xl border-2 border-transparent group-hover:border-amber-400/40 transition-all duration-500 z-[4] pointer-events-none" />

                      {/* Browse label on hover */}
                      <div className="absolute inset-0 z-[5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                        <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-amber-400 text-[10px] sm:text-xs font-medium rounded-full border border-amber-400/30">
                          Shop →
                        </span>
                      </div>
                    </div>

                    {/* Label */}
                    <div className="mt-2 text-center">
                      <p className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-amber-400 transition-colors duration-300 capitalize">
                        {catName}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground group-hover:text-amber-400/60 transition-colors duration-300">
                        {total} {total === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== PRODUCTS GRID VIEW (open category) — same on mobile & desktop ===== */}
          {openCategory && (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                {categoryItems.map((product) => (
                  <div
                    key={product._id}
                    className="group cursor-pointer flex flex-col"
                    onClick={() => openLightbox(product)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-lg">
                      <div className="relative aspect-[3/4] w-full">
                        <Image
                          src={getImageSrc(product, 300, 400)}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      {!product.inStock && (
                        <div className="absolute top-1.5 left-1.5 bg-red-500/80 text-white text-[8px] sm:text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                          Sold Out
                        </div>
                      )}
                      {product.originalPrice && product.inStock && (
                        <div className="absolute top-1.5 left-1.5 bg-amber-400 text-black text-[8px] sm:text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                          Sale
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="mt-1.5 flex flex-col flex-1 px-0.5">
                      <p className="text-[10px] sm:text-xs font-medium text-foreground line-clamp-2 leading-tight">
                        {product.name}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
                        {product.category}
                      </p>

                      {/* Price + stars row */}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] sm:text-xs font-bold text-amber-400">
                          KSH {product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground">
                            {product.rating}
                          </span>
                        </div>
                      </div>

                      {/* Buy button */}
                      <button
                        className={`mt-1.5 w-full flex items-center justify-center gap-1 py-1.5 text-[9px] sm:text-[10px] font-semibold rounded-md transition-all duration-200 ${
                          product.inStock
                            ? "bg-amber-400/20 text-amber-400 border border-amber-400/30 hover:bg-amber-400 hover:text-black"
                            : "bg-white/5 text-white/20 cursor-not-allowed border border-white/10"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.inStock) openLightbox(product);
                        }}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-2.5 w-2.5" strokeWidth={2} />
                        {product.inStock ? "Buy" : "Sold Out"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {categoryItems.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No products in this category yet.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-sm mx-auto bg-[#111] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Nav arrows */}
            {categoryItems.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-2 top-1/3 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-2 top-1/3 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Full image */}
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={getImageSrc(selectedProduct, 800, 1000)}
                alt={selectedProduct.name}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              {selectedProduct.originalPrice && (
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 text-xs font-medium bg-amber-400 text-black rounded-full">HOT SALE</span>
                </div>
              )}
              {!selectedProduct.inStock && (
                <div className="absolute top-3 right-10">
                  <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">Sold Out</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{selectedProduct.name}</h3>
                  <p className="text-xs text-amber-400/70 mt-0.5">{selectedProduct.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-amber-400">KSH {selectedProduct.price.toLocaleString()}</p>
                  {selectedProduct.originalPrice && (
                    <p className="text-xs text-muted-foreground line-through">
                      KSH {selectedProduct.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.round(selectedProduct.rating) ? "text-amber-400 fill-amber-400" : "text-white/20"}`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{selectedProduct.rating}</span>
              </div>

              {selectedProduct.description && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                  {selectedProduct.description}
                </p>
              )}

              <a
                href={`https://wa.me/254725297393?text=Hi, I'd like to buy: ${selectedProduct.name} (KSH ${selectedProduct.price.toLocaleString()})`}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  selectedProduct.inStock
                    ? "bg-amber-400 text-black hover:bg-amber-300"
                    : "bg-white/10 text-white/30 cursor-not-allowed pointer-events-none"
                }`}
                onClick={(e) => !selectedProduct.inStock && e.preventDefault()}
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                {selectedProduct.inStock ? "Buy via WhatsApp" : "Sold Out"}
              </a>

              {/* Dot indicators */}
              {categoryItems.length > 1 && (
                <div className="flex justify-center gap-1 mt-3">
                  {categoryItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedProduct(categoryItems[i])}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === lightboxIndex ? "w-4 bg-amber-400" : "w-1.5 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionHeader({
  openCategory,
  onBack,
}: {
  openCategory: string | null;
  onBack: () => void;
}) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px w-6 sm:w-8 bg-amber-400" />
        <span className="text-xs uppercase tracking-widest text-amber-400">Shop</span>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
          {openCategory ? openCategory : "Browse Categories"}
        </h2>
        {openCategory && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back</span>
          </button>
        )}
      </div>
    </div>
  );
}
