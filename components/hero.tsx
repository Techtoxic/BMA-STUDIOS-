"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Phone, Clock, Camera } from "lucide-react";
import { getHero, urlFor } from "@/lib/sanity";

const typewriterTexts = [
  "Wedding Photography",
  "Studio Portraits",
  "Creative Photoshoots",
  "Graphic Design",
  "Photo Editing",
  "Camera Sales",
];

interface HeroData {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  phone?: string;
  backgroundImage?: any;
  backgroundImageUrl?: string;
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  useEffect(() => {
    async function fetchHero() {
      try {
        const data = await getHero();
        if (data) setHeroData(data);
      } catch (error) {
        console.error("Failed to fetch hero:", error);
      }
    }
    fetchHero();
  }, []);

  // Typing effect
  useEffect(() => {
    const currentFullText = typewriterTexts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: heroData?.backgroundImage?.asset?._ref || heroData?.backgroundImage?.asset?._id
              ? `url('${urlFor(heroData.backgroundImage).width(1920).height(1080).fit('crop').auto('format').quality(80).url()}')`
              : heroData?.backgroundImageUrl
                ? `url('${heroData.backgroundImageUrl}')`
                : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Main Content Area - Push down on desktop */}
        <div className="pt-44 sm:pt-56 lg:pt-60 pb-4">
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
              
              {/* Left Side - Main Headline */}
              <div className="lg:flex-1 lg:max-w-2xl">
                <h1 
                  className="opacity-0 animate-slide-in-left font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-8 sm:mb-6"
                  style={{ animationFillMode: "forwards" }}
                >
                  <span className="text-foreground">Capturing Your</span>
                  <br />
                  <span className="gradient-text">Precious Moments</span>
                </h1>

                {/* Typing Effect */}
                <div 
                  className="opacity-0 animate-slide-in-left delay-200 mb-5 sm:mb-4 flex items-center flex-wrap"
                  style={{ animationFillMode: "forwards" }}
                >
                  <span className="text-sm sm:text-base text-muted-foreground">We specialize in </span>
                  <span className="text-sm sm:text-base text-amber-400 font-semibold ml-1">
                    {displayText}
                    <span className="animate-pulse">|</span>
                  </span>
                </div>

                <p 
                  className="opacity-0 animate-slide-in-left delay-300 mb-10 sm:mb-8 max-w-lg text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed"
                  style={{ animationFillMode: "forwards" }}
                >
                  Professional photography services in Nyeri, Kenya. Transform your special 
                  moments into timeless memories with artistic excellence.
                </p>

                {/* CTA Buttons */}
                <div 
                  className="opacity-0 animate-slide-in-left delay-400 flex flex-wrap items-center gap-5 sm:gap-4"
                  style={{ animationFillMode: "forwards" }}
                >
                  <a
                    href="#services"
                    className="inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-400/10 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all duration-300 hover:bg-amber-400/20 hover:border-amber-400"
                  >
                    <span>Explore Services</span>
                    <ChevronDown className="h-4 w-4" />
                  </a>
                  <a
                    href="tel:+254725297393"
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/5"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Now</span>
                  </a>
                </div>

                {/* Mobile Only - Service Tags to fill space */}
                <div className="sm:hidden mt-10 opacity-0 animate-fade-in delay-500" style={{ animationFillMode: "forwards" }}>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs text-amber-400">Weddings</span>
                    <span className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs text-amber-400">Portraits</span>
                    <span className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs text-amber-400">Events</span>
                    <span className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs text-amber-400">Studio</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Professional photography & videography services. We capture your most precious moments with artistic excellence.
                  </p>
                </div>
              </div>

              {/* Right Side - Description Card (Desktop Only) */}
              <div 
                className="hidden lg:block lg:flex-1 lg:max-w-md opacity-0 animate-slide-in-right delay-500"
                style={{ animationFillMode: "forwards" }}
              >
                <div className="border-l-2 border-amber-400/30 pl-8">
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">
                    From wedding celebrations to professional portraits, we bring your vision to life with expert craftsmanship.
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                    <span>Est. 2014</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                    <span>Nyeri, Kenya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Up on mobile, down on desktop */}
        <div className="pt-4 sm:pt-16 pb-4 sm:pb-6">
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-6">
              
              {/* Left - Stats */}
              <div 
                className="opacity-0 animate-fade-in delay-600"
                style={{ animationFillMode: "forwards" }}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base">
                  <div>
                    <span className="font-semibold text-amber-400">5000+</span>
                    <span className="text-muted-foreground ml-1">Photos</span>
                  </div>
                  <span className="text-muted-foreground/40">|</span>
                  <div>
                    <span className="font-semibold text-amber-400">500+</span>
                    <span className="text-muted-foreground ml-1">Clients</span>
                  </div>
                  <span className="text-muted-foreground/40">|</span>
                  <div>
                    <span className="font-semibold text-amber-400">10+</span>
                    <span className="text-muted-foreground ml-1">Years</span>
                  </div>
                  <span className="text-muted-foreground/40">|</span>
                  <div>
                    <span className="font-semibold text-amber-400">4.9</span>
                    <span className="text-muted-foreground ml-1">Rating</span>
                  </div>
                </div>
              </div>

              {/* Right - Studio Info */}
              <div 
                className="opacity-0 animate-fade-in delay-700"
                style={{ animationFillMode: "forwards" }}
              >
                <div className="flex flex-col sm:items-end gap-0.5">
                  <div className="flex items-center gap-1.5 text-sm sm:text-base text-foreground">
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                    <span className="font-medium">BMA Photography Studio</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-400/70" />
                      <span>Nyeri Town</span>
                    </div>
                    <span className="text-muted-foreground/40">|</span>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-amber-400/70" />
                      <span>+254 725 297393</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
