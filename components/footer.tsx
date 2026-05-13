"use client";

import Link from "next/link";
import { Camera, Phone, Mail, MapPin, ArrowUp } from "lucide-react";

const services = ["Wedding", "Portrait", "Events", "Design", "Training", "Equipment"];
const links = ["Home", "Services", "Portfolio", "Products", "About", "Contact"];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-border py-4 sm:py-4">
      <div className="mx-auto max-w-[1600px] w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Single Row Layout */}
        <div className="flex flex-col gap-2 sm:gap-3">
          
          {/* Row 1: Logo, Services, Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-2 gap-y-2 text-xs sm:text-[9px]">
            {/* Logo */}
            <Link href="#home" className="flex items-center gap-1 text-foreground hover:text-amber-400 transition-colors">
              <Camera className="h-3 w-3 sm:h-3 sm:w-3 text-amber-400" strokeWidth={1.5} />
              <span className="font-semibold text-xs sm:text-[10px]">BMA Photography</span>
            </Link>

            <span className="text-border hidden md:inline">|</span>

            {/* Services */}
            <div className="hidden md:flex items-center gap-1 text-muted-foreground">
              <span className="text-foreground">Services:</span>
              {services.map((service, index) => (
                <span key={index} className="flex items-center">
                  <a href="#services" className="hover:text-amber-400 transition-colors">{service}</a>
                  {index < services.length - 1 && <span className="mx-0.5 text-border">|</span>}
                </span>
              ))}
            </div>

            <span className="text-border hidden lg:inline">|</span>

            {/* Links */}
            <div className="flex items-center gap-1 text-muted-foreground">
              {links.map((link, index) => (
                <span key={index} className="flex items-center">
                  <Link href={`#${link.toLowerCase()}`} className="hover:text-amber-400 transition-colors">{link}</Link>
                  {index < links.length - 1 && <span className="mx-0.5 text-border">|</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Row 2: Contact, Copyright, Back to Top */}
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-2 gap-y-2 text-xs sm:text-[8px] text-muted-foreground">
            {/* Contact */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <a href="tel:+254725297393" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                <Phone className="h-3 w-3 sm:h-2.5 sm:w-2.5 text-amber-400" strokeWidth={1.5} />
                <span>+254 725 297393</span>
              </a>
              <span className="text-border">|</span>
              <a href="mailto:info@bma.co.ke" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                <Mail className="h-3 w-3 sm:h-2.5 sm:w-2.5 text-amber-400" strokeWidth={1.5} />
                <span>info@bma.co.ke</span>
              </a>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 sm:h-2.5 sm:w-2.5 text-amber-400" strokeWidth={1.5} />
                <span>Nyeri, Kenya</span>
              </span>
            </div>

            {/* Copyright & Top */}
            <div className="flex items-center gap-2">
              <span>© 2024 BMA Photography</span>
              <span className="text-border">|</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 hover:text-amber-400 transition-colors"
              >
                <span>Top</span>
                <ArrowUp className="h-3 w-3 sm:h-2.5 sm:w-2.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
