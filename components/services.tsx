"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { getServices, urlFor } from "@/lib/sanity";

// ── Hardcoded services — shown when CMS has no data ──────────────────────────
const FALLBACK_SERVICES = [
  { title: "Wedding Photography", subtitle: "Full-day coverage, edited gallery" },
  { title: "Portraits",           subtitle: "Studio & outdoor sessions" },
  { title: "Events",              subtitle: "Corporate, social & celebrations" },
  { title: "Studio Sessions",     subtitle: "Professional & creative shoots" },
  { title: "Graphic Design",      subtitle: "Logos, branding & print" },
  { title: "Camera Sales",        subtitle: "Equipment, gear & accessories" },
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
  const [services, setServices]     = useState<Service[]>([]);
  const [visible, setVisible]       = useState<Set<number>>(new Set());
  const [loading, setLoading]       = useState(true);
  const [hovered, setHovered]       = useState<number | null>(null);
  const sectionRef                  = useRef<HTMLElement>(null);

  useEffect(() => {
    getServices()
      .then((d) => setServices(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Staggered reveal on scroll
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
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-svc]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const SectionHeader = () => (
    <div className="mb-10 md:mb-14">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
        What We Do
      </p>
      <h2 className="font-[var(--font-heading)] text-2xl md:text-4xl font-bold text-foreground">
        Our Services
      </h2>
    </div>
  );

  if (loading) {
    return (
      <section id="services" className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
        <SectionHeader />
        <div className="space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 border-b border-white/6 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // ── Fallback — editorial numbered list ─────────────────────────────────────
  if (services.length === 0) {
    return (
      <section id="services" ref={sectionRef} className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
        <SectionHeader />

        <div className="border-t border-white/8">
          {FALLBACK_SERVICES.map((svc, i) => {
            const isHovered = hovered === i;
            const isVisible = visible.has(i);
            const num = String(i + 1).padStart(2, "0");

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
                className="group flex items-center justify-between border-b border-white/8 py-5 md:py-6 transition-all duration-200"
                style={{
                  opacity:   isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.45s ease ${i * 0.06}s, transform 0.45s ease ${i * 0.06}s`,
                  paddingLeft: isHovered ? "12px" : "0",
                }}
              >
                {/* Left — number + text */}
                <div className="flex items-center gap-5 md:gap-7">
                  {/* Number */}
                  <span
                    className="font-mono text-[11px] font-semibold tabular-nums transition-colors duration-200"
                    style={{ color: isHovered ? "#fbbf24" : "rgba(255,255,255,0.2)" }}
                  >
                    {num}
                  </span>

                  {/* Text */}
                  <div>
                    <p
                      className="font-[var(--font-heading)] text-base md:text-xl font-semibold leading-none mb-1 transition-colors duration-200"
                      style={{ color: isHovered ? "#ffffff" : "rgba(255,255,255,0.85)" }}
                    >
                      {svc.title}
                    </p>
                    <p className="text-[11px] md:text-xs text-white/35 transition-colors duration-200"
                      style={{ color: isHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)" }}>
                      {svc.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right — arrow */}
                <ArrowUpRight
                  className="h-4 w-4 flex-shrink-0 transition-all duration-200"
                  style={{
                    color: isHovered ? "#fbbf24" : "rgba(255,255,255,0.15)",
                    transform: isHovered ? "translate(2px,-2px)" : "translate(0,0)",
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
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/8 px-5 py-2.5 text-sm font-medium text-amber-400 transition-all duration-200 hover:bg-amber-400/15 hover:border-amber-400/70"
          >
            Book a Session via WhatsApp
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    );
  }

  // ── CMS data — image grid ────────────────────────────────────────────────
  return (
    <section id="services" ref={sectionRef} className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
      <SectionHeader />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {services.map((service, index) => (
          <div
            key={service._id}
            data-svc
            data-index={index}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
              service.orientation === "portrait" ? "md:row-span-2" : ""
            }`}
            style={{
              opacity: visible.has(index) ? 1 : 0,
              transform: visible.has(index) ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`,
            }}
          >
            <div className={`relative w-full ${
              service.orientation === "portrait"
                ? "aspect-[3/4] md:aspect-[2/3]"
                : "aspect-[4/3] md:aspect-[3/2]"
            }`}>
              <Image
                src={
                  service.image?.asset?._ref
                    ? urlFor(service.image).width(600).height(service.orientation === "portrait" ? 800 : 400).fit("crop").auto("format").quality(80).url()
                    : service.imageUrl || service.image
                }
                alt={service.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                <h3 className="font-[var(--font-heading)] text-xs md:text-sm font-semibold text-white leading-tight">
                  {service.title}
                </h3>
                <p className="text-[9px] md:text-[10px] text-white/60 mt-0.5">{service.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
