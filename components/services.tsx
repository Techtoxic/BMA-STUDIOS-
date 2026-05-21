"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getServices, getPortfolioByCategories, urlFor } from "@/lib/sanity";

const FALLBACK_SERVICES = [
  {
    title: "Wedding Photography",
    subtitle: "Full-day coverage, edited gallery",
    portfolioCategory: "wedding",
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=400&fit=crop&q=80",
  },
  {
    title: "Portraits",
    subtitle: "Studio & outdoor sessions",
    portfolioCategory: "portrait",
    thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop&q=80",
  },
  {
    title: "Events",
    subtitle: "Corporate, social & celebrations",
    portfolioCategory: "event",
    thumb: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=400&fit=crop&q=80",
  },
  {
    title: "Studio Sessions",
    subtitle: "Professional & creative shoots",
    portfolioCategory: "studio",
    thumb: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&h=400&fit=crop&q=80",
  },
  {
    title: "Graphic Design",
    subtitle: "Logos, branding & print",
    portfolioCategory: null,
    thumb: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=400&fit=crop&q=80",
  },
  {
    title: "Camera Sales",
    subtitle: "Equipment, gear & accessories",
    portfolioCategory: null,
    thumb: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=300&h=400&fit=crop&q=80",
  },
];

// Tilt alternates per row
const TILTS = [2, -2, 3, -3, 2, -2];

interface Service {
  _id: string;
  title: string;
  subtitle: string;
  price: string;
  image: any;
  imageUrl?: string;
}

interface PortfolioThumb {
  _id: string;
  category: string;
  image: any;
  imageUrl?: string;
}

export function Services() {
  const [services, setServices]               = useState<Service[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [hovered, setHovered]                 = useState<number | null>(null);
  const [visible, setVisible]                 = useState<Set<number>>(new Set());
  const [portfolioThumbs, setPortfolioThumbs] = useState<Record<string, string>>({});
  const sectionRef                            = useRef<HTMLElement>(null);

  useEffect(() => {
    getServices().then(setServices).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const cats = FALLBACK_SERVICES.map(s => s.portfolioCategory).filter(Boolean) as string[];
    getPortfolioByCategories(cats)
      .then((items: PortfolioThumb[]) => {
        const map: Record<string, string> = {};
        items.forEach(item => {
          if (!map[item.category]) {
            const src = item.image?.asset?._ref
              ? urlFor(item.image).width(300).height(400).fit("crop").auto("format").quality(80).url()
              : item.imageUrl || "";
            if (src) map[item.category] = src;
          }
        });
        setPortfolioThumbs(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = parseInt(e.target.getAttribute("data-index") || "0");
          setVisible(prev => new Set([...prev, idx]));
        }
      }),
      { threshold: 0.08 }
    );
    document.querySelectorAll("[data-svc]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <section id="services" className="py-12 md:py-16 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="mb-8 md:mb-12">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">What We Do</p>
          <h2 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      </section>
    );
  }

  const rows = services.length > 0
    ? services.map((s, i) => ({
        title: s.title,
        subtitle: s.subtitle,
        thumb: s.image?.asset?._ref
          ? urlFor(s.image).width(300).height(400).fit("crop").auto("format").quality(80).url()
          : s.imageUrl || FALLBACK_SERVICES[i]?.thumb || "",
        portfolioCategory: FALLBACK_SERVICES[i]?.portfolioCategory ?? null,
      }))
    : FALLBACK_SERVICES.map(s => ({
        ...s,
        thumb: s.portfolioCategory && portfolioThumbs[s.portfolioCategory]
          ? portfolioThumbs[s.portfolioCategory]
          : s.thumb,
      }));

  return (
    <section id="services" ref={sectionRef} className="py-12 md:py-16 px-6 sm:px-10 lg:px-16 xl:px-20">

      {/* Header */}
      <div className="mb-8 md:mb-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">What We Do</p>
        <h2 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold text-foreground">Our Services</h2>
      </div>

      {/* ── Mobile: list rows ──────────────────────────────────────────── */}
      <div className="md:hidden border-t border-white/8">
        {rows.map((svc, i) => {
          const isHot = hovered === i;
          const isVis = visible.has(i);
          const num   = String(i + 1).padStart(2, "0");
          return (
            <a
              key={i}
              href={`https://wa.me/254725297393?text=Hi, I'm interested in ${svc.title}`}
              target="_blank" rel="noopener noreferrer"
              data-svc data-index={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center gap-4 border-b border-white/8 py-4 transition-all duration-200"
              style={{
                opacity: isVis ? 1 : 0,
                transform: isVis ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
                paddingLeft: isHot ? "8px" : "0",
              }}
            >
              <span className="font-mono text-[10px] font-semibold tabular-nums w-5 flex-shrink-0"
                style={{ color: isHot ? "#fbbf24" : "rgba(255,255,255,0.18)" }}>
                {num}
              </span>
              {/* Text + inline arrow */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <div className="min-w-0">
                  <p className="font-[var(--font-heading)] text-[15px] font-semibold leading-none mb-1 truncate transition-colors duration-200"
                    style={{ color: isHot ? "#fff" : "rgba(255,255,255,0.82)" }}>
                    {svc.title}
                  </p>
                  <p className="text-[11px] transition-colors duration-200"
                    style={{ color: isHot ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)" }}>
                    {svc.subtitle}
                  </p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: isHot ? "#fbbf24" : "rgba(255,255,255,0.18)",
                           transform: isHot ? "translate(2px,-2px)" : "none" }} />
              </div>
              {/* Tilted thumbnail */}
              <div className="relative flex-shrink-0 rounded-lg overflow-hidden shadow-lg"
                style={{
                  width: isHot ? "54px" : "46px",
                  height: isHot ? "70px" : "60px",
                  transform: `rotate(${TILTS[i]}deg) ${isHot ? "scale(1.08)" : "scale(1)"}`,
                  transition: "width 0.3s, height 0.3s, transform 0.3s",
                }}>
                <Image src={svc.thumb} alt={svc.title} fill className="object-cover" sizes="60px" />
                <div className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.3),transparent)", opacity: isHot ? 1 : 0 }} />
              </div>
            </a>
          );
        })}
      </div>

      {/* ── Desktop: 2-column card grid ────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {rows.map((svc, i) => {
          const isHot = hovered === i;
          const isVis = visible.has(i);
          const num   = String(i + 1).padStart(2, "00");
          return (
            <a
              key={i}
              href={`https://wa.me/254725297393?text=Hi, I'm interested in ${svc.title}`}
              target="_blank" rel="noopener noreferrer"
              data-svc data-index={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative overflow-hidden rounded-xl border border-white/6 bg-white/3 transition-all duration-300 hover:border-amber-400/30 hover:bg-white/5"
              style={{
                opacity: isVis ? 1 : 0,
                transform: isVis ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s, border-color 0.3s, background 0.3s`,
              }}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Number */}
                <span className="font-mono text-[11px] font-semibold tabular-nums self-start pt-0.5 transition-colors duration-200"
                  style={{ color: isHot ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>
                  {num}
                </span>

                {/* Text + arrow */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="font-[var(--font-heading)] text-[15px] lg:text-base font-semibold leading-none transition-colors duration-200 truncate"
                      style={{ color: isHot ? "#fff" : "rgba(255,255,255,0.85)" }}>
                      {svc.title}
                    </p>
                    <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0 transition-all duration-200"
                      style={{ color: isHot ? "#fbbf24" : "rgba(255,255,255,0.2)",
                               transform: isHot ? "translate(2px,-2px)" : "none" }} />
                  </div>
                  <p className="text-[11px] transition-colors duration-200"
                    style={{ color: isHot ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)" }}>
                    {svc.subtitle}
                  </p>
                </div>

                {/* Tilted thumbnail */}
                <div className="relative flex-shrink-0 rounded-lg overflow-hidden shadow-xl"
                  style={{
                    width: "56px",
                    height: "72px",
                    transform: `rotate(${TILTS[i]}deg) ${isHot ? "scale(1.1)" : "scale(1)"}`,
                    transition: "transform 0.3s ease",
                  }}>
                  <Image src={svc.thumb} alt={svc.title} fill className="object-cover" sizes="70px" />
                  <div className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.3),transparent)", opacity: isHot ? 1 : 0 }} />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Book CTA */}
      <div className="mt-8">
        <a
          href="https://wa.me/254725297393?text=Hi, I'd like to book a session"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/8 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all duration-200 hover:bg-amber-400/15"
        >
          Book a Session via WhatsApp
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
