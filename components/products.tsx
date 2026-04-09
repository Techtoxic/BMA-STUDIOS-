"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check, Star, Truck, Shield, ArrowRight } from "lucide-react";

const products = [
  {
    name: "Canon EOS R5",
    category: "Camera Body",
    price: "KSH 485,000",
    originalPrice: "KSH 520,000",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    rating: 5,
    features: ["45MP Full Frame", "8K Video"],
    inStock: true,
  },
  {
    name: "Sony A7 IV",
    category: "Camera Body",
    price: "KSH 295,000",
    originalPrice: "KSH 320,000",
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&q=80",
    rating: 5,
    features: ["33MP Full Frame", "4K 60fps"],
    inStock: true,
  },
  {
    name: "Canon RF 50mm f/1.2L",
    category: "Prime Lens",
    price: "KSH 285,000",
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1606986628253-e3e1f5091178?w=800&q=80",
    rating: 5,
    features: ["f/1.2 Aperture", "Ring-type USM"],
    inStock: true,
  },
  {
    name: "Godox AD600 Pro",
    category: "Studio Lighting",
    price: "KSH 89,000",
    originalPrice: "KSH 95,000",
    image: "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?w=800&q=80",
    rating: 4,
    features: ["600Ws Power", "TTL & HSS"],
    inStock: true,
  },
  {
    name: "Professional Tripod",
    category: "Accessories",
    price: "KSH 18,500",
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1583954964643-e6b0573d6f4a?w=800&q=80",
    rating: 4,
    features: ["Carbon Fiber", "Ball Head"],
    inStock: true,
  },
  {
    name: "Camera Backpack Pro",
    category: "Bags",
    price: "KSH 12,500",
    originalPrice: "KSH 15,000",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    rating: 5,
    features: ["Waterproof", "Laptop Slot"],
    inStock: true,
  },
  {
    name: "Canon RF 24-70mm f/2.8",
    category: "Zoom Lens",
    price: "KSH 265,000",
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&q=80",
    rating: 5,
    features: ["f/2.8 Constant", "Nano USM"],
    inStock: false,
  },
  {
    name: "Memory Card 256GB",
    category: "Storage",
    price: "KSH 8,500",
    originalPrice: "KSH 10,000",
    image: "https://images.unsplash.com/photo-1618478594486-c65b899c4936?w=800&q=80",
    rating: 4,
    features: ["300MB/s Read", "4K Ready"],
    inStock: true,
  },
];

const benefits = [
  { icon: Truck, title: "Free Delivery", desc: "Within Nyeri" },
  { icon: Shield, title: "Warranty", desc: "1 Year" },
  { icon: Check, title: "Genuine", desc: "100% Authentic" },
];

export function Products() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll("[data-product-item]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="products" ref={sectionRef} className="relative py-12 md:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="mb-2 md:mb-3 text-xs md:text-sm font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] text-amber-400">
            Camera Shop
          </p>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Camera <span className="gradient-text">Equipment</span>
          </h2>
          <p className="mx-auto max-w-xl text-xs md:text-sm text-muted-foreground">
            Quality camera gear and accessories with warranty and expert support.
          </p>
        </div>

        {/* Benefits Bar */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-border">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 md:gap-3">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20">
                <benefit.icon className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-xs md:text-sm">{benefit.title}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              data-product-item
              data-index={index}
              className={`group relative bg-secondary/50 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 hover:bg-secondary ${
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.originalPrice && (
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] md:text-[10px] font-bold text-white">
                      SALE
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] md:text-[10px] font-medium text-foreground">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Category */}
                <div className="absolute top-2 right-2">
                  <span className="rounded-full bg-background/80 backdrop-blur-sm px-1.5 py-0.5 text-[8px] md:text-[9px] text-muted-foreground">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-2.5 md:p-4">
                {/* Rating */}
                <div className="flex gap-0.5 mb-1 md:mb-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2.5 w-2.5 md:h-3 md:w-3 ${
                        i < product.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                <h3 className="font-semibold text-foreground text-xs md:text-sm mb-0.5 md:mb-1 line-clamp-1">
                  {product.name}
                </h3>

                {/* Features */}
                <p className="text-[9px] md:text-[10px] text-muted-foreground mb-2 md:mb-3 line-clamp-1">
                  {product.features.join(" | ")}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm md:text-base font-bold text-amber-400">{product.price}</span>
                    {product.originalPrice && (
                      <span className="block text-[9px] md:text-[10px] text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    disabled={!product.inStock}
                    className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                      product.inStock
                        ? "bg-amber-400 text-background hover:scale-110"
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    }`}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingBag className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 md:mt-10">
          <a
            href={`https://wa.me/254725297393?text=Hi, I'd like to inquire about camera equipment.`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-amber-400/50 px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-foreground transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10"
          >
            <span>View All Products</span>
            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
