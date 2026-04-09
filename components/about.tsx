"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Award, Clock, Heart, Sparkles, Target, Zap, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Award, title: "10+ Years", desc: "Experience" },
  { icon: Clock, title: "Quick Turnaround", desc: "Fast delivery" },
  { icon: Heart, title: "Passionate", desc: "Dedicated team" },
  { icon: Sparkles, title: "Creative", desc: "Unique vision" },
  { icon: Target, title: "Detail", desc: "Precision work" },
  { icon: Zap, title: "Modern Gear", desc: "Latest tech" },
];

const achievements = [
  "500+ Weddings",
  "1000+ Portraits",
  "50+ Corporate Clients",
  "Award-Winning",
];

export function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-12 md:py-20 lg:py-28 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div 
            className={`relative transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Main Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] md:aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
                  alt="BMA Photography Studio"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Floating Stats Box */}
              <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 rounded-xl md:rounded-2xl bg-background/90 backdrop-blur-sm border border-border p-3 md:p-5 shadow-xl">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600">
                    <Award className="h-5 w-5 md:h-7 md:w-7 text-background" />
                  </div>
                  <div>
                    <p className="font-[var(--font-heading)] text-xl md:text-2xl font-bold text-foreground">10+</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">Years Excellence</p>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-3xl border-2 border-amber-400/30 -z-10" />
            </div>

            {/* Secondary Image */}
            <div className="absolute top-4 -left-2 md:top-8 md:-left-6 w-20 md:w-32 aspect-square overflow-hidden rounded-xl md:rounded-2xl border-2 md:border-4 border-background shadow-xl hidden sm:block">
              <Image
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80"
                alt="Camera equipment"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content Side */}
          <div 
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <p className="mb-2 md:mb-3 text-xs md:text-sm font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] text-amber-400">
              About Us
            </p>
            <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
              BMA Photography
              <br />
              <span className="gradient-text">Studio</span>
            </h2>

            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
              Located in Nyeri, Kenya, BMA Photography Studio has been capturing 
              life&apos;s precious moments for over a decade with passion and excellence.
            </p>

            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
              From intimate weddings to professional headshots, we bring creativity and 
              expertise to every project. Our fully equipped studio ensures your vision becomes reality.
            </p>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-1.5 md:gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-400 shrink-0" />
                  <span className="text-[10px] md:text-xs text-foreground/80">{achievement}</span>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group p-2 md:p-3 rounded-xl md:rounded-2xl bg-secondary/50 transition-all duration-300 hover:bg-secondary"
                >
                  <div className="flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 mb-1.5 md:mb-2 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-foreground text-[10px] md:text-xs mb-0.5">{feature.title}</h4>
                  <p className="text-[8px] md:text-[10px] text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
