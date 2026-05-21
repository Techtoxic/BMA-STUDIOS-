"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getServices, urlFor } from "@/lib/sanity";

// Real photography thumbnails from Unsplash — swapped for actual BMA shots once CMS has data
const FALLBACK_SERVICES = [
  {
    title: "Wedding Photography",
    subtitle: "Full-day coverage, edited gallery",
    thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Portraits",
    subtitle: "Studio & outdoor sessions",
    thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Events",
    subtitle: "Corporate, social & celebrations",
    thumb: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Studio Sessions",
    subtitle: "Professional & creative shoots",
    thumb: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Graphic Design",
    subtitle: "Logos, branding & print",
    thumb: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=120&h=160&fit=crop&q=80",
  },
  {
    title: "Camera Sales",
    subtitle: "Equipment, gear & accessories",
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

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [visible, setVisible]   = useState<Set<number>>(new Set());
  const [loading, setLoading]   = useState(true);
  const [hovered, setHovered]   = useState<number | null>(null);
  const sectionRef              = useRef<HTMLElement>(null);

  useEffect(() => {
    getServices()
      .then((d) => setServices(d))
      .catch(() => {})
      .finally(() => setLoading(false));
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

  // ── Fallback — editorial rows with photo thumbnails ─────────────────────
  if (services.length === 0) {
    return (
      <section id="services" ref={sectionRef} className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            What We Do
          </p>
          <h2 className="font-[var(--font-heading)] text-2xl md:text-4xl font-bold text-foreground">
            Our Services
          </h2>
        </div>

        {/* List */}
        <div className="border-t border-white/8">
          {FALLBACK_SERVICES.map((svc, i) => {
            const isHot = hovered === i;
            const isVis = visible.has(i);
            const num   = String(i + 1).padStart(2, "0");

            return (
              <a
                key={i}
                href={`https://wa.me/254725297393?text=Hi, I'm interested in ${svc.title}`}
                target="_blank"
                rel="noopener noreferrer"
                data-svc
                data-index={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group flex items-center justify-between gap-4 border-b border-white/8 py-4 md:py-5 transition-all duration-200"
                style={{
                  opacity:   isVis ? 1 : 0,
                  transform: isVis ? "translateX(0)" : "translateX(-12px)",
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

                {/* Title + subtitle */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-[var(--font-heading)] text-[15px] md:text-lg font-semibold leading-none mb-1 transition-colors duration-200 truncate"
                    style={{ color: isHot ? "#ffffff" : "rgba(255,255,255,0.82)" }}
                  >
                    {svc.title}
                  </p>
                  <p
                    className="text-[11px] transition-colors duration-200"
                    style={{ color: isHot ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)" }}
                  >
                    {svc.subtitle}
                  </p>
                </div>

                {/* Thumbnail — reveals on hover (desktop), always shown on mobile */}
                <div
                  className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300"
                  style={{
                    width: isHot ? "52px" : "44px",
                    height: isHot ? "68px" : "58px",
                    opacity: 1,
                  }}
                >
                  <Image
                    src={svc.thumb}
                    alt={svc.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="60px"
                  />
                  {/* Amber tint on hover */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, rgba(251,191,36,0.25), transparent)",
                      opacity: isHot ? 1 : 0,
                    }}
                  />
                </div>

                {/* Arrow */}
                <ArrowUpRight
                  className="h-4 w-4 flex-shrink-0 transition-all duration-200"
                  style={{
                    color: isHot ? "#fbbf24" : "rgba(255,255,255,0.12)",
                    transform: isHot ? "translate(2px,-2px)" : "translate(0,0)",
                  }}
                />
              </a>
            );
          })}
        </div>

        {/* Book CTA */}
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

  // ── CMS data — same editorial rows, real images ─────────────────────────
  return (
    <section id="services" ref={sectionRef} className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
      <div className="mb-10 md:mb-14">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">What We Do</p>
        <h2 className="font-[var(--font-heading)] text-2xl md:text-4xl font-bold text-foreground">Our Services</h2>
      </div>

      <div className="border-t border-white/8">
        {services.map((service, i) => {
          const isHot = hovered === i;
          const isVis = visible.has(i);
          const num   = String(i + 1).padStart(2, "0");
          const imgSrc = service.image?.asset?._ref
            ? urlFor(service.image).width(120).height(160).fit("crop").auto("format").quality(80).url()
            : service.imageUrl;

          return (
            <a
              key={service._id}
              href={`https://wa.me/254725297393?text=Hi, I'm interested in ${service.title}`}
              target="_blank"
              rel="noopener noreferrer"
              data-svc
              data-index={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group flex items-center justify-between gap-4 border-b border-white/8 py-4 md:py-5 transition-all duration-200"
              style={{
                opacity:   isVis ? 1 : 0,
                transform: isVis ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
                paddingLeft: isHot ? "8px" : "0",
              }}
            >
              <span className="font-mono text-[10px] font-semibold tabular-nums w-5 flex-shrink-0 transition-colors duration-200"
                style={{ color: isHot ? "#fbbf24" : "rgba(255,255,255,0.18)" }}>
                {num}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-[var(--font-heading)] text-[15px] md:text-lg font-semibold leading-none mb-1 transition-colors duration-200 truncate"
                  style={{ color: isHot ? "#ffffff" : "rgba(255,255,255,0.82)" }}>
                  {service.title}
                </p>
                <p className="text-[11px] transition-colors duration-200"
                  style={{ color: isHot ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)" }}>
                  {service.subtitle}
                </p>
              </div>
              {imgSrc && (
                <div className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300"
                  style={{ width: isHot ? "52px" : "44px", height: isHot ? "68px" : "58px" }}>
                  <Image src={imgSrc} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="60px" />
                  <div className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.25),transparent)", opacity: isHot ? 1 : 0 }} />
                </div>
              )}
              <ArrowUpRight className="h-4 w-4 flex-shrink-0 transition-all duration-200"
                style={{ color: isHot ? "#fbbf24" : "rgba(255,255,255,0.12)", transform: isHot ? "translate(2px,-2px)" : "translate(0,0)" }} />
            </a>
          );
        })}
      </div>
      <div className="mt-8">
        <a href="https://wa.me/254725297393?text=Hi, I'd like to book a session" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/8 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all duration-200 hover:bg-amber-400/15">
          Book a Session via WhatsApp
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
