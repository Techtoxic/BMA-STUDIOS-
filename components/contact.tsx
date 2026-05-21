"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, ArrowUpRight } from "lucide-react";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const DETAILS = [
  {
    icon: <Phone className="h-4 w-4" strokeWidth={1.5} />,
    label: "Call us",
    value: "+254 725 297393",
    href: "tel:+254725297393",
  },
  {
    icon: <Mail className="h-4 w-4" strokeWidth={1.5} />,
    label: "Email us",
    value: "info@bma.co.ke",
    href: "mailto:info@bma.co.ke",
  },
  {
    icon: <MapPin className="h-4 w-4" strokeWidth={1.5} />,
    label: "Visit us",
    value: "Mahiga Building, opposite Safaricom customer care shop, Nyeri Town",
    href: "https://maps.google.com/?q=Nyeri+Town+Kenya",
  },
  {
    icon: <Clock className="h-4 w-4" strokeWidth={1.5} />,
    label: "Open hours",
    value: "Mon – Sat · 8 AM – 6 PM",
    href: null,
  },
];

const QUICK = ["Wedding", "Portrait", "Event", "Studio", "Design"];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hello BMA Photography!\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nService: ${form.service}\nMessage: ${form.message}`
    );
    window.open(`https://wa.me/254725297393?text=${msg}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-10 sm:py-16 bg-background overflow-hidden">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">

        {/* ── Section label ── */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-amber-400" />
          <span className="text-xs uppercase tracking-widest text-amber-400">Contact</span>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT — info panel */}
          <div>
            <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] mb-2">
              Get In <span className="text-amber-400">Touch</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
              Ready to book a session or have a question? We respond fast on WhatsApp.
            </p>

            {/* Contact details */}
            <div className="space-y-5 mb-8">
              {DETAILS.map((d) =>
                d.href ? (
                  <a
                    key={d.label}
                    href={d.href}
                    target={d.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 group-hover:bg-amber-400 group-hover:text-black transition-all duration-200">
                      {d.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{d.label}</p>
                      <p className="text-sm text-foreground group-hover:text-amber-400 transition-colors leading-snug">{d.value}</p>
                    </div>
                  </a>
                ) : (
                  <div key={d.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      {d.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">{d.label}</p>
                      <p className="text-sm text-foreground">{d.value}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/254725297393"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-400 active:scale-95"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* RIGHT — form */}
          <div className="relative">
            {/* Subtle background card */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-6 sm:p-8">
              <p className="text-xs uppercase tracking-widest text-amber-400 mb-5">Send a message</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 text-xs bg-background border border-white/10 rounded-lg focus:border-amber-400 focus:outline-none transition-colors placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 text-xs bg-background border border-white/10 rounded-lg focus:border-amber-400 focus:outline-none transition-colors placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Phone</label>
                    <input
                      type="tel"
                      placeholder="+254 ..."
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-background border border-white/10 rounded-lg focus:border-amber-400 focus:outline-none transition-colors placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-1">Service</label>
                    <select
                      value={form.service}
                      onChange={e => setForm({ ...form, service: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 text-xs bg-background border border-white/10 rounded-lg focus:border-amber-400 focus:outline-none transition-colors text-muted-foreground"
                    >
                      <option value="">Select...</option>
                      {QUICK.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1">Message</label>
                  <textarea
                    placeholder="Tell us about your project or date..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2.5 text-xs bg-background border border-white/10 rounded-lg focus:border-amber-400 focus:outline-none transition-colors resize-none placeholder:text-muted-foreground"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 active:scale-[0.98] transition-all duration-200"
                >
                  {sent ? "✓ Sent to WhatsApp!" : <><Send className="h-3.5 w-3.5" /> Send Message</>}
                </button>
              </form>

              {/* Quick booking chips */}
              <div className="mt-5 pt-5 border-t border-white/8">
                <p className="text-[10px] text-muted-foreground mb-2.5 uppercase tracking-widest">Quick booking</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK.map(svc => (
                    <a
                      key={svc}
                      href={`https://wa.me/254725297393?text=Hi, I'm interested in ${svc} photography.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-[10px] border border-white/10 rounded-full text-muted-foreground hover:border-amber-400/60 hover:text-amber-400 transition-colors"
                    >
                      {svc}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
