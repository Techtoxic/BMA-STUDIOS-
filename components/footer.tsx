"use client";

import Link from "next/link";
import { Camera, Phone, Mail, MapPin, Instagram, Facebook, Twitter, ArrowUp } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Products", href: "#products" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const services = [
  "Weddings",
  "Portraits",
  "Photoshoots",
  "Mounting",
  "Graphic Design",
  "Training",
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-secondary/50 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 pb-6 md:pb-8 border-b border-border">
          {/* Brand */}
          <Link href="#home" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 transition-transform duration-300 group-hover:scale-110">
              <Camera className="h-4 w-4 md:h-5 md:w-5 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="font-[var(--font-heading)] text-base md:text-lg font-bold tracking-wider text-foreground">BMA</span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] text-amber-400">Photography</span>
            </div>
          </Link>

          {/* Quick Links - Horizontal with Dividers */}
          <nav className="flex flex-wrap items-center gap-1 text-xs md:text-sm">
            {quickLinks.map((link, index) => (
              <span key={link.name} className="flex items-center">
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-amber-400 transition-colors px-2 py-1"
                >
                  {link.name}
                </Link>
                {index < quickLinks.length - 1 && (
                  <span className="text-border">|</span>
                )}
              </span>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/50 text-muted-foreground transition-all duration-300 hover:bg-amber-400 hover:text-background"
                aria-label={social.label}
              >
                <social.icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Info Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 md:pt-8">
          {/* Contact Info - Horizontal */}
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <a href="tel:+254725297393" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors px-2 py-1">
              <Phone className="h-3 w-3 text-amber-400" />
              <span>+254 725 297393</span>
            </a>
            <span className="text-border">|</span>
            <a href="mailto:info@bmaphotography.co.ke" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors px-2 py-1">
              <Mail className="h-3 w-3 text-amber-400" />
              <span>info@bmaphotography.co.ke</span>
            </a>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5 px-2 py-1">
              <MapPin className="h-3 w-3 text-amber-400" />
              <span>Nyeri Town, Kenya</span>
            </span>
          </div>

          {/* Services - Horizontal */}
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <span className="text-foreground/70 mr-1">Services:</span>
            {services.map((service, index) => (
              <span key={service} className="flex items-center">
                <span className="px-1">{service}</span>
                {index < services.length - 1 && (
                  <span className="text-border">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-6 border-t border-border">
          <p className="text-[10px] md:text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BMA Photography Studio. All rights reserved.
          </p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground transition-colors hover:text-amber-400 group"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-background/50 transition-all group-hover:bg-amber-400 group-hover:text-background">
              <ArrowUp className="h-3 w-3" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
