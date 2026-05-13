"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, User, Sparkles, Image as ImageIcon, Palette, GraduationCap, ArrowRight } from "lucide-react";
import { getServices, urlFor } from "@/lib/sanity";

// Icon mapping for dynamic icons
const iconMap: { [key: string]: React.ElementType } = {
  Heart,
  User,
  Sparkles,
  ImageIcon,
  Palette,
  GraduationCap,
  ArrowRight,
  Camera: User,
};

interface Service {
  _id: string;
  title: string;
  subtitle: string;
  price: string;
  image: any;
  imageUrl?: string;
  icon: string;
  orientation: string;
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch services from Sanity
  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Intersection Observer for animations
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
  }, [services]);

  const displayServices = services;

  if (loading) {
    return (
      <section id="services" className="relative py-6 md:py-12 overflow-hidden">
        <div className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="text-center mb-8 md:mb-12">
            <p className="mb-2 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
              What We Offer
            </p>
            <h2 className="font-[var(--font-heading)] text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              Our Services
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (displayServices.length === 0) {
    return (
      <section id="services" className="relative py-6 md:py-12 overflow-hidden">
        <div className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="text-center mb-8 md:mb-12">
            <p className="mb-2 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
              What We Offer
            </p>
            <h2 className="font-[var(--font-heading)] text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              Our Services
            </h2>
          </div>
          <p className="text-center text-muted-foreground text-sm">Coming soon</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" ref={sectionRef} className="relative py-6 md:py-12 overflow-hidden">
      <div className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20">
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
          {displayServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Sparkles;
            return (
              <div
                key={service._id}
                data-service-item
                data-index={index}
                className={`group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer ${
                  service.orientation === "portrait" 
                    ? "md:row-span-2" 
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
                    src={
                      service.image?.asset
                        ? urlFor(service.image).width(600).height(service.orientation === 'portrait' ? 800 : 400).fit('crop').auto('format').quality(80).url()
                        : service.imageUrl || service.image
                    }
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                    {/* Icon */}
                    <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-amber-400 mb-1 md:mb-2 stroke-[1.5]" />
                    
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
