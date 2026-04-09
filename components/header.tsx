"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, MapPin, Camera } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Products", href: "#products" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-2 group">
            <Camera className="h-5 w-5 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
            <div className="flex items-baseline gap-1">
              <span className="font-[var(--font-heading)] text-lg font-semibold tracking-wide text-foreground">
                BMA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Photography
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-foreground/80 transition-colors hover:text-amber-400 group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Contact Info - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>Nyeri, Kenya</span>
            </div>
            <a
              href="tel:+254725297393"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-amber-400"
            >
              <Phone className="h-4 w-4 text-amber-400" />
              <span>+254 725 297393</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-amber-400 hover:text-background"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-t border-border transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <nav className="flex flex-col px-4 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center py-3 text-lg font-medium text-foreground border-b border-border/50 transition-colors hover:text-amber-400"
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>Nyeri, Kenya</span>
            </div>
            <a
              href="tel:+254725297393"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Phone className="h-4 w-4 text-amber-400" />
              <span>+254 725 297393</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
