"use client";

import Image from "next/image";
import { Award, Users, Camera, Clock, Target, Sparkles } from "lucide-react";

const features = [
  { icon: Award, label: "Award Winning" },
  { icon: Users, label: "Expert Team" },
  { icon: Camera, label: "Latest Gear" },
  { icon: Clock, label: "On Time" },
  { icon: Target, label: "Precision" },
  { icon: Sparkles, label: "Creative" },
];

export function About() {
  return (
    <section id="about" className="py-6 sm:py-12 bg-background">
      <div className="mx-auto max-w-[1600px] w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 sm:w-8 bg-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400">About Us</span>
          </div>
          <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
            Our Story
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Images - Masonry Style */}
          <div className="columns-2 gap-2 sm:gap-2">
            <div className="mb-2 sm:mb-2 break-inside-avoid">
              <div className="relative overflow-hidden rounded-lg sm:rounded-lg group">
                <Image
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=500&fit=crop"
                  alt="Photographer at work"
                  width={300}
                  height={400}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="mb-2 sm:mb-2 break-inside-avoid">
              <div className="relative overflow-hidden rounded-lg sm:rounded-lg group">
                <Image
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop"
                  alt="Camera equipment"
                  width={300}
                  height={200}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="mb-2 sm:mb-2 break-inside-avoid">
              <div className="relative overflow-hidden rounded-lg sm:rounded-lg group">
                <Image
                  src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop"
                  alt="Studio setup"
                  width={300}
                  height={200}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="mb-2 sm:mb-2 break-inside-avoid">
              <div className="relative overflow-hidden rounded-lg sm:rounded-lg group">
                <Image
                  src="https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400&h=400&fit=crop"
                  alt="Photo editing"
                  width={300}
                  height={300}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              Founded in 2014, BMA Photography Studio has been capturing life&apos;s most precious moments 
              in Nyeri and across Kenya. Our passion for photography drives us to deliver exceptional 
              quality in every frame.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">
              With state-of-the-art equipment and a team of skilled photographers, we specialize in 
              wedding photography, portraits, commercial shoots, and creative projects.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <feature.icon className="h-4 w-4 sm:h-4 sm:w-4 mx-auto mb-1 text-amber-400 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  <p className="text-xs sm:text-[10px] font-medium text-foreground">{feature.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-4 sm:mt-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs sm:text-xs text-muted-foreground hover:text-amber-400 transition-colors"
              >
                <span>Learn more about us</span>
                <span className="text-amber-400">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
