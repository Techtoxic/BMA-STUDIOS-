"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Award, Clock, Heart, Sparkles, Target, Zap, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Award, title: "10+ Years Experience", desc: "A decade of capturing precious moments" },
  { icon: Clock, title: "Quick Turnaround", desc: "Fast delivery without compromising quality" },
  { icon: Heart, title: "Passionate Team", desc: "Dedicated photographers who love their craft" },
  { icon: Sparkles, title: "Creative Vision", desc: "Unique perspectives for every project" },
  { icon: Target, title: "Attention to Detail", desc: "Every shot is carefully crafted" },
  { icon: Zap, title: "Modern Equipment", desc: "Latest cameras and professional lighting" },
];

const achievements = [
  "500+ Weddings Covered",
  "1000+ Portrait Sessions",
  "50+ Corporate Clients",
  "Award-Winning Photography",
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div 
            className={`relative transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Main Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
                  alt="BMA Photography Studio"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>

              {/* Floating Stats Box */}
              <div className="absolute -bottom-8 -right-4 lg:-right-8 rounded-2xl bg-background/90 backdrop-blur-sm border border-border p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600">
                    <Award className="h-8 w-8 text-background" />
                  </div>
                  <div>
                    <p className="font-[var(--font-heading)] text-3xl font-bold text-foreground">10+</p>
                    <p className="text-sm text-muted-foreground">Years of Excellence</p>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl border-2 border-amber-400/30 -z-10" />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-amber-400/10 -z-10 blur-2xl" />
            </div>

            {/* Secondary Image */}
            <div className="absolute top-8 -left-4 lg:-left-8 w-32 lg:w-40 aspect-square overflow-hidden rounded-2xl border-4 border-background shadow-xl hidden md:block">
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
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-400">
              About Us
            </p>
            <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              BMA Photography
              <br />
              <span className="gradient-text">Studio</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Located in the heart of Nyeri, Kenya, BMA Photography Studio has been capturing 
              life&apos;s most precious moments for over a decade. Our passion for photography 
              drives us to deliver exceptional quality in every shot.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              From intimate weddings to professional headshots, we bring creativity, technical 
              expertise, and a personal touch to every project. Our fully equipped studio and 
              experienced team ensure that your vision becomes reality.
            </p>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                  <span className="text-sm text-foreground/80">{achievement}</span>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group p-4 rounded-2xl bg-secondary/50 transition-all duration-300 hover:bg-secondary"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 mb-3 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
