"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getServices, getPortfolioByCategories, urlFor } from "@/lib/sanity";

// Fallback thumbnails — Unsplash for categories without portfolio photos
const FALLBACK_SERVICES = [
  {
    title: "Wedding Photography",
    subtitle: "Full-day coverage, edited gallery",
    portfolioCategory: "weddings",
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Portraits",
    subtitle: "Studio & outdoor sessions",
    portfolioCategory: "portraits",
    thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Events",
    subtitle: "Corporate, social & celebrations",
    portfolioCategory: "events",
    thumb: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Studio Sessions",
    subtitle: "Professional & creative shoots",
    portfolioCategory: "studio",
    thumb: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Graphic Design",
    subtitle: "Logos, branding & print",
    portfolioCategory: null,
    thumb: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Camera Sales",
    subtitle: "Equipment, gear & accessories",
    portfolioCategory: null,
    thumb: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=120&h=160&fit=crop&q=80",
  },
];

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

interface PortfolioThumb {
  _id: string;
  category: string;
  image: any;
  imageUrl?: string;
}

// Tilt directions per row — alternating for visual rhythm
const TILTS = [2, -2, 3, -3, 2, -2];

export function Services() {
  const [services, setServices]         = useState<Service[]>([]);
  const [visible, setVisible]           = useState<Set<number>>(new Set());
  const [loading, setLoading]           = useState(true);
  const [hovered, setHovered]           = useState<number | null>(null);
  const [portfolioThumbs, setPortfolioThumbs] = useState<Record<string, string>>({});
  const sectionRef                      = useRef<HTMLElement>(null);

  useEffect(() => {
    getServices()
      .then((d) => setServices(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch portfolio photos for each relevant category
  useEffect(() => {
    const cats = FALLBACK_SERVICES.map((s) => s.portfolioCategory).filter(Boolean) as string[];
    getPortfolioByCategories(cats)
      .then((items: PortfolioThumb[]) => {
        const map: Record<string, string> = {};
        items.forEach((item) => {
          if (!map[item.category]) {
            const src = item.image?.asset?._ref
              ? urlFor(item.image).width(120).height(160).fit("crop").auto("format").quality(80).url()
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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = parseInt(e.target.getAttribute("data-index") || "0");
            setVisible((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll("[data-svc]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <section id="services" className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="mb-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">What We Do</p>
          <h2 className="font-[var(--font-heading)] text-2xl md:text-4xl font-bold">Our Services</h2>
        </div>
        <div className="border-t border-white/8 space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 border-b border-white/6 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const renderRow = (
    title: string,
    subtitle: string,
    thumbSrc: string,
    tiltDeg: number,
    i: number,
    href: string
  ) => {
    const isHot = hovered === i;
    const isVis = visible.has(i);
    const num   = String(i + 1).padStart(2, "0");

    return (
      <a
        key={i}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-svc
        data-index={i}
        onMouseEnter={() => setHovered(i)}
        onMouseLeave={() => setHovered(null)}
        className="group flex items-center gap-4 border-b border-white/8 py-4 md:py-5 transition-all duration-200"
        style={{
          opacity:    isVis ? 1 : 0,
          transform:  isVis ? "translateX(0)" : "translateX(-12px)",
          transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
          paddingLeft: isHot ? "8px" : "0",
        }}
      >
        {/* Number */}
        <span
          className="font-mono text-[10px] font-semibold tabular-nums w-5 flex-shrink-0 transition-colors duration-200"
          style={{ color: isHot ? "#fbbf24" : "rgba(255,255,255,0.18)" }}
        >
          {num}
        </span>

        {/* Title + subtitle + arrow inline */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="min-w-0">
            <p
              className="font-[var(--font-heading)] text-[15px] md:text-lg font-semibold leading-none mb-1 transition-colors duration-200 truncate"
              style={{ color: isHot ? "#ffffff" : "rgba(255,255,255,0.82)" }}
            >
              {title}
            </p>
            <p
              className="text-[11px] transition-colors duration-200"
              style={{ color: isHot ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)" }}
            >
              {subtitle}
            </p>
          </div>
          {/* Arrow sits right after the text, pointing up-right toward the image */}
          <ArrowUpRight
            className="h-4 w-4 flex-shrink-0 transition-all duration-200 mt-0.5"
            style={{
              color: isHot ? "#fbbf24" : "rgba(255,255,255,0.18)",
              transform: isHot ? "translate(2px,-2px)" : "translate(0,0)",
            }}
          />
        </div>

        {/* Tilted thumbnail */}
        <div
          className="relative flex-shrink-0 rounded-lg overflow-hidden shadow-lg transition-all duration-300"
          style={{
            width:     isHot ? "54px" : "46px",
            height:    isHot ? "70px" : "60px",
            transform: `rotate(${tiltDeg}deg) ${isHot ? "scale(1.08)" : "scale(1)"}`,
            transition: "width 0.3s, height 0.3s, transform 0.3s",
          }}
        >
          <Image
            src={thumbSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="60px"
          />
          {/* Amber tint on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.3), transparent)",
              opacity: isHot ? 1 : 0,
            }}
          />
        </div>
      </a>
    );
  };

  // ── Fallback rows ────────────────────────────────────────────────────────
  if (services.length === 0) {
    return (
      <section id="services" ref={sectionRef} className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="mb-10 md:mb-14">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">What We Do</p>
          <h2 className="font-[var(--font-heading)] text-2xl md:text-4xl font-bold text-foreground">Our Services</h2>
        </div>

        <div className="border-t border-white/8">
          {FALLBACK_SERVICES.map((svc, i) => {
            // Use portfolio photo if available, else Unsplash fallback
            const thumb = svc.portfolioCategory && portfolioThumbs[svc.portfolioCategory]
              ? portfolioThumbs[svc.portfolioCategory]
              : svc.thumb;
            return renderRow(
              svc.title,
              svc.subtitle,
              thumb,
              TILTS[i],
              i,
              `https://wa.me/254725297393?text=Hi, I'm interested in ${svc.title}`
            );
          })}
        </div>

        <div className="mt-8">
          <a
            href="https://wa.me/254725297393?text=Hi, I'd like to book a session"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/8 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all duration-200 hover:bg-amber-400/15"
          >
            Book a Session via WhatsApp
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    );
  }

  // ── CMS rows ─────────────────────────────────────────────────────────────
  return (
    <section id="services" ref={sectionRef} className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="mb-10 md:mb-14">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">What We Do</p>
        <h2 className="font-[var(--font-heading)] text-2xl md:text-4xl font-bold text-foreground">Our Services</h2>
      </div>

      <div className="border-t border-white/8">
        {services.map((service, i) => {
          const imgSrc = service.image?.asset?._ref
            ? urlFor(service.image).width(120).height(160).fit("crop").auto("format").quality(80).url()
            : service.imageUrl || FALLBACK_SERVICES[i]?.thumb || "";
          return renderRow(
            service.title,
            service.subtitle,
            imgSrc,
            TILTS[i] || 2,
            i,
            `https://wa.me/254725297393?text=Hi, I'm interested in ${service.title}`
          );
        })}
      </div>

      <div className="mt-8">
        <a
          href="https://wa.me/254725297393?text=Hi, I'd like to book a session"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/8 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all duration-200 hover:bg-amber-400/15"
        >
          Book a Session via WhatsApp
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
