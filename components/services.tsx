"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Heart, User, Sparkles, Image as ImageIcon,
  Palette, ShoppingBag, ArrowRight,
} from "lucide-react";
import { getServices, urlFor } from "@/lib/sanity";

// ── Fallback services — shown when CMS has no data ──────────────────────────
const FALLBACK_SERVICES = [
  {
    title: "Wedding Photography",
    subtitle: "Full-day coverage",
    icon: Heart,
    gradient: "from-rose-500/20 to-rose-900/5",
    accent: "#f43f5e",
  },
  {
    title: "Portraits",
    subtitle: "Studio & outdoor",
    icon: User,
    gradient: "from-sky-500/20 to-sky-900/5",
    accent: "#38bdf8",
  },
  {
    title: "Events",
    subtitle: "Corporate & social",
    icon: Sparkles,
    gradient: "from-violet-500/20 to-violet-900/5",
    accent: "#a78bfa",
  },
  {
    title: "Studio Sessions",
    subtitle: "Professional shoots",
    icon: ImageIcon,
    gradient: "from-amber-500/20 to-amber-900/5",
    accent: "#fbbf24",
  },
  {
    title: "Graphic Design",
    subtitle: "Logos & branding",
    icon: Palette,
    gradient: "from-emerald-500/20 to-emerald-900/5",
    accent: "#34d399",
  },
  {
    title: "Camera Sales",
    subtitle: "Equipment & gear",
    icon: ShoppingBag,
    gradient: "from-orange-500/20 to-orange-900/5",
    accent: "#fb923c",
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

const iconMap: { [key: string]: React.ElementType } = {
  Heart, User, Sparkles, ImageIcon, Palette, ShoppingBag, ArrowRight,
};

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch {}
      finally { setLoading(false); }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleItems((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.1 }
    );
    const items = document.querySelectorAll("[data-service-item]");
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [services, loading]);

  // ── Section header ───────────────────────────────────────────────────────
  const SectionHeader = () => (
    <div className="mb-8 md:mb-12">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
        What We Do
      </p>
      <h2 className="font-[var(--font-heading)] text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
        Our Services
      </h2>
    </div>
  );

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <section id="services" className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
        <SectionHeader />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white/5 animate-pulse aspect-square" />
          ))}
        </div>
      </section>
    );
  }

  // ── Fallback — beautiful hardcoded cards ─────────────────────────────────
  if (services.length === 0) {
    return (
      <section id="services" ref={sectionRef} className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
        <SectionHeader />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {FALLBACK_SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            const visible = visibleItems.has(i);
            return (
              <a
                key={i}
                href={`https://wa.me/254725297393?text=Hi, I'm interested in ${svc.title}`}
                target="_blank"
                rel="noopener noreferrer"
                data-service-item
                data-index={i}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/8 bg-white/4 p-5 md:p-6 overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/8 active:scale-[0.98]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s, background 0.2s, border 0.2s`,
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
                }}
              >
                {/* Accent glow */}
                <div
                  className="absolute top-0 right-0 h-20 w-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ background: svc.accent, transform: "translate(30%, -30%)" }}
                />

                {/* Icon */}
                <div
                  className="mb-10 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${svc.accent}18`, border: `1px solid ${svc.accent}30` }}
                >
                  <Icon className="h-5 w-5" style={{ color: svc.accent }} strokeWidth={1.5} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-[var(--font-heading)] text-sm md:text-base font-semibold text-white leading-tight mb-1">
                    {svc.title}
                  </h3>
                  <p className="text-[11px] text-white/40">{svc.subtitle}</p>
                </div>

                {/* Arrow — appears on hover */}
                <ArrowRight
                  className="absolute bottom-4 right-4 h-4 w-4 text-white/20 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200"
                />
              </a>
            );
          })}
        </div>
      </section>
    );
  }

  // ── CMS data — image grid ────────────────────────────────────────────────
  return (
    <section id="services" ref={sectionRef} className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 xl:px-20">
      <SectionHeader />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon] || Sparkles;
          return (
            <div
              key={service._id}
              data-service-item
              data-index={index}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                service.orientation === "portrait" ? "md:row-span-2" : ""
              }`}
              style={{
                opacity: visibleItems.has(index) ? 1 : 0,
                transform: visibleItems.has(index) ? "translateY(0)" : "translateY(20px)",
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                  <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-amber-400 mb-1 md:mb-2" strokeWidth={1.5} />
                  <h3 className="font-[var(--font-heading)] text-xs md:text-sm font-semibold text-white leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-white/60 mt-0.5">{service.subtitle}</p>
                  <div className="flex items-center justify-between mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[9px] font-medium text-amber-400">{service.price}</span>
                    <a
                      href={`https://wa.me/254725297393?text=Hi, I'm interested in ${service.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[9px] text-white hover:text-amber-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Book <ArrowRight className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
