"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

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

  // Build categories dynamically from data
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProduct(null);
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, filteredProducts]);

  function openLightbox(product: Product) {
    const idx = filteredProducts.findIndex((p) => p._id === product._id);
    setLightboxIndex(idx);
    setSelectedProduct(product);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setSelectedProduct(null);
    document.body.style.overflow = "";
  }

  function navigateLightbox(dir: number) {
    const next = (lightboxIndex + dir + filteredProducts.length) % filteredProducts.length;
    setLightboxIndex(next);
    setSelectedProduct(filteredProducts[next]);
  }

  function getImageSrc(product: Product, width = 800, height = 1000) {
    if (product.image?.asset?._ref) {
      return urlFor(product.image).width(width).height(height).fit("crop").auto("format").quality(90).url();
    }
    return product.imageUrl || product.image || "/placeholder.jpg";
  }

  if (loading) {
    return (
      <section id="products" className="py-6 sm:py-12 bg-secondary/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader />
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
          <SectionHeader />
          <p className="text-center text-muted-foreground text-sm">Coming soon</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="products" className="py-6 sm:py-12 bg-secondary/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeader />

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 sm:mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-amber-400 text-black border-amber-400"
                    : "bg-transparent text-muted-foreground border-white/15 hover:border-amber-400/50 hover:text-amber-400"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1 opacity-60">
                    ({products.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group cursor-pointer">
                {/* Image — click opens lightbox */}
                <div
                  className="relative overflow-hidden rounded-md sm:rounded-lg"
                  onClick={() => openLightbox(product)}
                >
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={getImageSrc(product, 300, 400)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {product.originalPrice && (
                      <div className="absolute top-1 left-1">
                        <span className="px-1 py-0.5 text-[8px] sm:text-[9px] font-medium bg-amber-400 text-background rounded">
                          Sale
                        </span>
                      </div>
                    )}

                    {!product.inStock && (
                      <div className="absolute top-1 right-1">
                        <span className="px-1 py-0.5 text-[8px] sm:text-[9px] font-medium bg-red-500/80 text-white rounded">
                          Sold
                        </span>
                      </div>
                    )}

                    {/* Tap hint */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-white text-[8px] font-medium bg-black/50 px-1.5 py-0.5 rounded">
                        View
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-1 px-0.5">
                  <p className="text-[10px] sm:text-xs font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate">{product.category}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] sm:text-xs font-semibold text-amber-400">
                      KSH {product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-2 w-2 text-amber-400 fill-amber-400" />
                      <span className="text-[8px] sm:text-[10px] text-muted-foreground">{product.rating}</span>
                    </div>
                  </div>
                  {product.originalPrice && (
                    <span className="text-[8px] sm:text-[9px] text-muted-foreground line-through">
                      KSH {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <a
                    href={`https://wa.me/254725297393?text=Hi, I'd like to buy: ${product.name} (KSH ${product.price.toLocaleString()})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-1.5 w-full flex items-center justify-center gap-0.5 py-1 text-[8px] sm:text-[9px] font-medium rounded transition-all duration-200 ${
                      product.inStock
                        ? "bg-amber-400/15 border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-black"
                        : "bg-white/5 border border-white/10 text-white/25 cursor-not-allowed pointer-events-none"
                    }`}
                    onClick={(e) => !product.inStock && e.preventDefault()}
                  >
                    <ShoppingCart className="h-2 w-2" strokeWidth={1.5} />
                    <span>{product.inStock ? "Buy" : "Sold Out"}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No products in this category yet.</p>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-sm mx-auto bg-[#111] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Nav arrows */}
            {filteredProducts.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
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
                  <span className="px-2 py-1 text-xs font-medium bg-amber-400 text-black rounded-full">
                    HOT SALE
                  </span>
                </div>
              )}
              {!selectedProduct.inStock && (
                <div className="absolute top-3 right-10">
                  <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Product details */}
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
              {filteredProducts.length > 1 && (
                <div className="flex justify-center gap-1 mt-3">
                  {filteredProducts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setLightboxIndex(i);
                        setSelectedProduct(filteredProducts[i]);
                      }}
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

function SectionHeader() {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px w-6 sm:w-8 bg-amber-400" />
        <span className="text-xs uppercase tracking-widest text-amber-400">Shop</span>
      </div>
      <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
        Camera & Accessories
      </h2>
    </div>
  );
}
