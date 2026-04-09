"use client";

import Link from "next/link";
import { Camera, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube, ArrowUp, Heart } from "lucide-react";

const services = [
  { name: "Wedding Photography", price: "From KSH 45,000" },
  { name: "Studio Portraits", price: "From KSH 3,500" },
  { name: "Creative Photoshoots", price: "From KSH 8,000" },
  { name: "Photo Mounting", price: "From KSH 1,500" },
  { name: "Graphic Design", price: "From KSH 2,500" },
  { name: "Editing Training", price: "From KSH 15,000" },
];

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
    <footer className="relative bg-secondary/50 border-t border-border overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="#home" className="flex items-center gap-3 mb-6 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 transition-transform duration-300 group-hover:scale-110">
                  <Camera className="h-6 w-6 text-background" />
                </div>
                <div className="flex flex-col">
                  <span className="font-[var(--font-heading)] text-xl font-bold tracking-wider text-foreground">
                    BMA
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400">
                    Photography
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Professional photography services in Nyeri, Kenya. Capturing life&apos;s most 
                precious moments with artistic excellence since 2014.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/50 text-muted-foreground transition-all duration-300 hover:bg-amber-400 hover:text-background hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold text-foreground mb-6 text-lg">
                Our Services
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a
                      href="#services"
                      className="group flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-amber-400"
                    >
                      <span>{service.name}</span>
                      <span className="text-xs opacity-60 group-hover:opacity-100">{service.price}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold text-foreground mb-6 text-lg">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-amber-400 flex items-center gap-2 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold text-foreground mb-6 text-lg">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="tel:+254725297393"
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-amber-400 group"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/50 transition-colors group-hover:bg-amber-400/20">
                      <Phone className="h-4 w-4 text-amber-400" />
                    </div>
                    +254 725 297393
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@bmaphotography.co.ke"
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-amber-400 group"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/50 transition-colors group-hover:bg-amber-400/20">
                      <Mail className="h-4 w-4 text-amber-400" />
                    </div>
                    info@bmaphotography.co.ke
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/50">
                      <MapPin className="h-4 w-4 text-amber-400" />
                    </div>
                    Nyeri Town, Kenya
                  </div>
                </li>
              </ul>

              {/* CTA */}
              <a
                href="https://wa.me/254725297393"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-5 py-2.5 text-sm font-semibold text-background transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span>&copy; {new Date().getFullYear()} BMA Photography Studio.</span>
              <span className="hidden sm:inline">Made with</span>
              <Heart className="h-3 w-3 text-amber-400 hidden sm:inline" />
              <span className="hidden sm:inline">in Nyeri, Kenya</span>
            </p>
            
            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-amber-400 group"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/50 transition-all group-hover:bg-amber-400 group-hover:text-background">
                <ArrowUp className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
