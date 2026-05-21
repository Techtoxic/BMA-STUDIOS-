"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { getHero, urlFor } from "@/lib/sanity";
import { useIsMobile } from "@/hooks/use-mobile";

const MOBILE_BG =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";

const STATS = [
  { number: "5000+", label: "Photos" },
  { number: "500+",  label: "Clients" },
  { number: "10+",   label: "Years" },
  { number: "4.9★",  label: "Rating" },
];

interface HeroData {
  backgroundImage?: any;
  backgroundImageUrl?: string;
}

export function Hero() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchHero() {
      try {
        const data = await getHero();
        if (data) setHeroData(data);
      } catch {}
    }
    fetchHero();
  }, []);

  const desktopBg =
    heroData?.backgroundImage?.asset?._ref || heroData?.backgroundImage?.asset?._id
      ? `url('${urlFor(heroData.backgroundImage).width(1920).height(1080).fit("crop").auto("format").quality(80).url()}')`
      : heroData?.backgroundImageUrl
      ? `url('${heroData.backgroundImageUrl}')`
      : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";

  const backgroundImage = isMobile ? `url('${MOBILE_BG}')` : desktopBg;

  return (
    <section
      id="home"
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage }}
        />
        {/* Dark gradient — heavier at bottom so text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        {/* Left fade so headline reads cleanly */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      </div>

      {/* ── Content — sits at lower-middle, not pinned to very bottom ── */}
      <div className="relative z-10 mt-auto px-6 pb-10 sm:px-10 lg:px-16 xl:px-20 pt-20">

        {/* Location badge */}
        <div
          className="opacity-0 animate-fade-in mb-5"
          style={{ animationFillMode: "forwards" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-amber-400">
            <MapPin className="h-3 w-3" />
            Nyeri, Kenya
          </span>
        </div>

        {/* Headline */}
        <h1
          className="opacity-0 animate-slide-in-left font-[var(--font-heading)] text-[2rem] leading-[1.1] font-bold sm:text-5xl lg:text-7xl mb-4"
          style={{ animationFillMode: "forwards" }}
        >
          <span className="text-white">Capturing Your</span>
          <br />
          <span className="gradient-text">Precious Moments</span>
        </h1>

        {/* Tagline */}
        <p
          className="opacity-0 animate-slide-in-left delay-200 text-sm text-white/60 mb-8 max-w-xs sm:max-w-sm leading-relaxed"
          style={{ animationFillMode: "forwards" }}
        >
          Weddings · Portraits · Events · Studio Sessions
        </p>

        {/* CTA row */}
        <div
          className="opacity-0 animate-slide-in-left delay-300 flex flex-wrap items-center gap-3 mb-10"
          style={{ animationFillMode: "forwards" }}
        >
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/15 hover:text-white active:scale-95"
          >
            Our Services
          </a>
          <a
            href="tel:+254725297393"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20 active:scale-95"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </div>

        {/* Stats row — compact, separated by thin lines */}
        <div
          className="opacity-0 animate-fade-in delay-500 flex items-center gap-0"
          style={{ animationFillMode: "forwards" }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col pr-4">
                <span className="text-base font-bold text-amber-400 leading-none">{s.number}</span>
                <span className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wide">{s.label}</span>
              </div>
              {i < STATS.length - 1 && (
                <div className="h-6 w-px bg-white/15 mr-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
