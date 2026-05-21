"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Star, Tag } from "lucide-react";
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

  // Fetch products from Sanity
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

  const displayProducts = products;

  if (loading) {
    return (
      <section id="products" className="py-6 sm:py-12 bg-secondary/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 sm:w-8 bg-amber-400" />
              <span className="text-xs uppercase tracking-widest text-amber-400">Shop</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
              Camera & Accessories
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <section id="products" className="py-6 sm:py-12 bg-secondary/30">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 sm:w-8 bg-amber-400" />
              <span className="text-xs uppercase tracking-widest text-amber-400">Shop</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
              Camera & Accessories
            </h2>
          </div>
          <p className="text-center text-muted-foreground text-sm">Coming soon</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-6 sm:py-12 bg-secondary/30">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 sm:w-8 bg-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400">Shop</span>
          </div>
          <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
            Camera & Accessories
          </h2>
        </div>

        {/* Product Grid - Compact Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2">
          {displayProducts.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-md sm:rounded-lg">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={
                      product.image?.asset?._ref
                        ? urlFor(product.image).width(300).height(400).fit('crop').auto('format').quality(80).url()
                        : product.imageUrl || product.image
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Sale Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-1 left-1">
                      <span className="px-1 py-0.5 text-[8px] sm:text-[9px] font-medium bg-amber-400 text-background rounded">
                        Sale
                      </span>
                    </div>
                  )}

                  {/* Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute top-1 right-1">
                      <span className="px-1 py-0.5 text-[8px] sm:text-[9px] font-medium bg-red-500/80 text-white rounded">
                        Sold
                      </span>
                    </div>
                  )}

                  {/* Hover overlay on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Info below image */}
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
                {/* Buy button — always visible */}
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

        {/* View All Link */}
        <div className="mt-4 sm:mt-6 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-1 text-xs sm:text-xs text-muted-foreground hover:text-amber-400 transition-colors"
          >
            <Tag className="h-3 w-3 sm:h-3 sm:w-3" strokeWidth={1.5} />
            <span>View All Products</span>
          </a>
        </div>
      </div>
    </section>
  );
}
