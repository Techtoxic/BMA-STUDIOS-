"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, User, Sparkles, Image as ImageIcon, Palette, Settings, GraduationCap, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Wedding Photography",
    description: "Capture the magic of your special day with professional wedding photography. Full day coverage, multiple photographers, and cinematic storytelling.",
    price: "From KSH 45,000",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    features: ["Full Day Coverage", "2 Photographers", "Edited Photos", "Wedding Album"],
  },
  {
    icon: User,
    title: "Studio Portraits",
    description: "Professional studio portraits for individuals, families, and corporate headshots with state-of-the-art lighting.",
    price: "From KSH 3,500",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    features: ["Professional Lighting", "Multiple Backdrops", "Retouching", "Digital Copies"],
  },
  {
    icon: Sparkles,
    title: "Creative Photoshoots",
    description: "Fashion, lifestyle, and creative photoshoots tailored to your vision. Indoor and outdoor locations.",
    price: "From KSH 8,000",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    features: ["Creative Direction", "Location Scouting", "Wardrobe Advice", "High-Res Images"],
  },
  {
    icon: ImageIcon,
    title: "Photo Mounting",
    description: "Premium photo mounting and framing services. Canvas prints, acrylic mounts, and custom frames.",
    price: "From KSH 1,500",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    features: ["Canvas Prints", "Acrylic Mounts", "Custom Frames", "Wall Galleries"],
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Professional graphic design including logos, branding, marketing materials, and social media graphics.",
    price: "From KSH 2,500",
    image: "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=800&q=80",
    features: ["Logo Design", "Brand Identity", "Print Materials", "Social Media"],
  },
  {
    icon: GraduationCap,
    title: "Editing Training",
    description: "Learn professional photo and video editing. One-on-one training in Lightroom, Photoshop, and Premiere Pro.",
    price: "From KSH 15,000",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    features: ["Lightroom Mastery", "Photoshop Skills", "Video Editing", "Certificate"],
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
      { threshold: 0.15 }
    );

    const items = document.querySelectorAll("[data-service-item]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-12 md:py-20 lg:py-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-amber-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-amber-600/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="mb-2 md:mb-3 text-xs md:text-sm font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] text-amber-400">
            What We Offer
          </p>
          <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="mx-auto max-w-xl text-xs md:text-sm text-muted-foreground">
            Comprehensive photography and creative services tailored to capture your vision 
            with artistic excellence.
          </p>
        </div>

        {/* Services Grid - Alternating Layout */}
        <div className="space-y-10 md:space-y-16 lg:space-y-20">
          {services.map((service, index) => (
            <div
              key={index}
              data-service-item
              data-index={index}
              className={`flex flex-col gap-4 md:gap-8 lg:gap-12 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } ${visibleItems.includes(index) ? "opacity-100" : "opacity-0"} transition-all duration-700`}
              style={{
                transform: visibleItems.includes(index) ? "translateY(0)" : "translateY(30px)",
              }}
            >
              {/* Image */}
              <div className="flex-1 relative group">
                <div className="relative aspect-[16/10] md:aspect-[4/3] lg:aspect-[3/2] overflow-hidden rounded-2xl md:rounded-3xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  
                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-background shadow-lg">
                    {service.price}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20">
                    <service.icon className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />
                  </div>
                  <h3 className="font-[var(--font-heading)] text-lg md:text-xl lg:text-2xl font-bold text-foreground">
                    {service.title}
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4 md:mb-5">
                  {service.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                  {service.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-1.5 md:gap-2">
                      <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-amber-400" />
                      <span className="text-[10px] md:text-xs text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={`https://wa.me/254725297393?text=Hi, I'm interested in your ${service.title} service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 md:gap-2 text-amber-400 text-xs md:text-sm font-medium transition-colors hover:text-amber-300"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
