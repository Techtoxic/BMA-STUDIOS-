"use client";

import Link from "next/link";
import { Camera, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube, ArrowUp } from "lucide-react";

const services = ["Wedding", "Portraits", "Photoshoots", "Mounting", "Design", "Training"];
const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Products", href: "#products" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-20 bg-secondary/50 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Compact Footer - All in one row on desktop, stacked compact on mobile */}
        <div className="flex flex-col gap-3 md:gap-4">
          
          {/* Row 1: Logo, Services, Quick Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-3 gap-y-2 text-[10px] md:text-[11px]">
            {/* Logo */}
            <Link href="#home" className="flex items-center gap-1.5 text-foreground hover:text-amber-400 transition-colors">
              <Camera className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-400" />
              <span className="font-semibold text-xs md:text-sm">BMA Photography</span>
            </Link>

            {/* Divider */}
            <span className="text-border hidden md:inline">|</span>

            {/* Services inline - hidden on mobile */}
            <div className="hidden md:flex items-center gap-1 text-muted-foreground">
              <span className="text-foreground font-medium">Services:</span>
              {services.map((service, index) => (
                <span key={index} className="flex items-center">
                  <a href="#services" className="hover:text-amber-400 transition-colors">{service}</a>
                  {index < services.length - 1 && <span className="mx-1 text-border">|</span>}
                </span>
              ))}
            </div>

            {/* Divider */}
            <span className="text-border hidden lg:inline">|</span>

            {/* Quick Links inline - show fewer on mobile */}
            <div className="flex items-center gap-1 text-muted-foreground">
              {quickLinks.slice(0, 4).map((link, index) => (
                <span key={index} className="flex items-center">
                  <Link href={link.href} className="hover:text-amber-400 transition-colors">{link.name}</Link>
                  {index < 3 && <span className="mx-1 text-border">|</span>}
                </span>
              ))}
              <span className="hidden md:flex items-center">
                {quickLinks.slice(4).map((link, index) => (
                  <span key={index} className="flex items-center">
                    <span className="mx-1 text-border">|</span>
                    <Link href={link.href} className="hover:text-amber-400 transition-colors">{link.name}</Link>
                  </span>
                ))}
              </span>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-border" />

          {/* Row 2: Contact, Social, Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-3 gap-y-2 text-[9px] md:text-[10px] text-muted-foreground">
            {/* Contact Info inline */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <a href="tel:+254725297393" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                <Phone className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-400" />
                <span>+254 725 297393</span>
              </a>
              <span className="text-border">|</span>
              <a href="mailto:info@bmaphotography.co.ke" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                <Mail className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-400" />
                <span>info@bma.co.ke</span>
              </a>
              <span className="text-border hidden md:inline">|</span>
              <span className="hidden md:flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-400" />
                <span>Nyeri, Kenya</span>
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-amber-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                </a>
              ))}
              <span className="text-border">|</span>
              <a
                href="https://wa.me/254725297393"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                WhatsApp
              </a>
            </div>

            {/* Copyright & Back to Top */}
            <div className="flex items-center gap-2">
              <span>&copy; {new Date().getFullYear()} BMA</span>
              <span className="text-border">|</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 hover:text-amber-400 transition-colors"
                aria-label="Back to top"
              >
                <span>Top</span>
                <ArrowUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
