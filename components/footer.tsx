"use client";

import Link from "next/link";
import { Camera, Phone, Mail, MapPin, ArrowUp } from "lucide-react";

const NAV   = ["Home", "Services", "Portfolio", "Products", "About", "Contact"];
const SVCS  = ["Wedding", "Portrait", "Events", "Design", "Training", "Equipment"];

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const SOCIALS = [
  { label: "WhatsApp", href: "https://wa.me/254725297393",                              icon: <WhatsAppIcon />, hover: "hover:text-green-400 hover:border-green-400/50" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100006118214886", icon: <FacebookIcon />, hover: "hover:text-blue-400  hover:border-blue-400/50"  },
  { label: "LinkedIn", href: "#",                                                        icon: <LinkedInIcon />, hover: "hover:text-sky-400   hover:border-sky-400/50"   },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-background border-t border-white/6">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-7 pb-4">

        {/* ── Top row: logo + social ── */}
        <div className="flex items-center justify-between mb-6">
          <Link href="#home" className="flex items-center gap-1.5 group">
            <Camera className="h-4 w-4 text-amber-400" strokeWidth={1.5} />
            <span className="font-semibold text-sm text-foreground group-hover:text-amber-400 transition-colors">
              BMA Photography
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.label}
                className={`flex items-center justify-center h-8 w-8 rounded-full border border-white/12 text-muted-foreground transition-all duration-200 ${s.hover}`}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Three columns side by side ── */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-[11px]">

          {/* Navigation */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-amber-400 mb-2.5">Navigation</p>
            <ul className="space-y-1.5">
              {NAV.map(item => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-amber-400 transition-colors leading-none">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-amber-400 mb-2.5">Services</p>
            <ul className="space-y-1.5">
              {SVCS.map(svc => (
                <li key={svc}>
                  <a href="#services"
                    className="text-muted-foreground hover:text-amber-400 transition-colors leading-none">
                    {svc}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Find us */}
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-amber-400 mb-2.5">Find Us</p>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:+254725297393"
                  className="flex items-start gap-1.5 text-muted-foreground hover:text-amber-400 transition-colors">
                  <Phone className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>+254 725 297393</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@bma.co.ke"
                  className="flex items-start gap-1.5 text-muted-foreground hover:text-amber-400 transition-colors">
                  <Mail className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>info@bma.co.ke</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-1.5 text-muted-foreground">
                  <MapPin className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>Mahiga Building, opp. Safaricom care, Nyeri</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/6 pt-3 flex items-center justify-between gap-2">
          <p className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} BMA Photography
          </p>
          <button onClick={scrollToTop}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 transition-colors">
            Back to top <ArrowUp className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
