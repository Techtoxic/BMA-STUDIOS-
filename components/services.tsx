"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, User, Sparkles, Image as ImageIcon, Palette, GraduationCap, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Wedding Photography",
    subtitle: "Capture your special day",
    price: "From KSH 45,000",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    orientation: "portrait",
  },
  {
    icon: User,
    title: "Studio Portraits",
    subtitle: "Professional headshots & family",
    price: "From KSH 3,500",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    orientation: "landscape",
  },
  {
    icon: Sparkles,
    title: "Creative Photoshoots",
    subtitle: "Fashion & lifestyle sessions",
    price: "From KSH 8,000",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    orientation: "portrait",
  },
  {
    icon: ImageIcon,
    title: "Photo Mounting",
    subtitle: "Canvas, acrylic & frames",
    price: "From KSH 1,500",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80",
    orientation: "landscape",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    subtitle: "Logos, branding & prints",
    price: "From KSH 2,500",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    orientation: "landscape",
  },
  {
    icon: GraduationCap,
    title: "Editing Training",
    subtitle: "Lightroom & Photoshop courses",
    price: "From KSH 15,000",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    orientation: "portrait",
  },
];

export function Services() {
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

    const items = document.querySelectorAll("[data-service-item]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-12 md:py-20 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="mb-2 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
            What We Offer
          </p>
          <h2 className="font-[var(--font-heading)] text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
            Our Services
          </h2>
        </div>

        {/* Services Grid - Mixed Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              data-service-item
              data-index={index}
              className={`group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer ${
                service.orientation === "portrait" 
                  ? "row-span-2" 
                  : ""
              } ${visibleItems.includes(index) ? "opacity-100" : "opacity-0"} transition-all duration-500`}
              style={{
                transform: visibleItems.includes(index) ? "translateY(0)" : "translateY(20px)",
              }}
            >
              {/* Image Container */}
              <div className={`relative w-full ${
                service.orientation === "portrait" 
                  ? "aspect-[3/4] md:aspect-[2/3]" 
                  : "aspect-[4/3] md:aspect-[3/2]"
              }`}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                  {/* Icon */}
                  <service.icon className="h-4 w-4 md:h-5 md:w-5 text-amber-400 mb-1 md:mb-2 stroke-[1.5]" />
                  
                  {/* Title */}
                  <h3 className="font-[var(--font-heading)] text-xs md:text-sm lg:text-base font-semibold text-white leading-tight">
                    {service.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-[9px] md:text-[10px] lg:text-xs text-white/70 mt-0.5">
                    {service.subtitle}
                  </p>
                  
                  {/* Price & CTA - Hidden by default, shown on hover */}
                  <div className="flex items-center justify-between mt-2 md:mt-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[9px] md:text-[10px] font-medium text-amber-400">
                      {service.price}
                    </span>
                    <a
                      href={`https://wa.me/254725297393?text=Hi, I'm interested in ${service.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[9px] md:text-[10px] text-white hover:text-amber-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Book</span>
                      <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
