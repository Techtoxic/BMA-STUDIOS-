"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Hello BMA Photography!%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AService: ${formData.service}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/254725297393?text=${whatsappMessage}`, "_blank");
  };

  return (
    <section id="contact" className="py-6 sm:py-12 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 sm:w-8 bg-amber-400" />
            <span className="text-xs uppercase tracking-widest text-amber-400">Contact</span>
          </div>
          <h2 className="text-xl sm:text-xl lg:text-2xl font-[var(--font-heading)] font-bold text-foreground">
            Get In Touch
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Contact Info & Map */}
          <div>
            {/* Quick Contact */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-[10px] text-muted-foreground">
              <a href="tel:+254725297393" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                <Phone className="h-3 w-3 sm:h-3 sm:w-3 text-amber-400" strokeWidth={1.5} />
                <span>+254 725 297393</span>
              </a>
              <span className="text-border">|</span>
              <a href="mailto:info@bmaphotography.co.ke" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                <Mail className="h-3 w-3 sm:h-3 sm:w-3 text-amber-400" strokeWidth={1.5} />
                <span>info@bma.co.ke</span>
              </a>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-3 sm:w-3 text-amber-400" strokeWidth={1.5} />
                <span>Mon-Sat 8AM-6PM</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-1 mb-3 sm:mb-4 text-xs sm:text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3 sm:h-3 sm:w-3 text-amber-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <span>Kimathi Street, Nyeri Town, Kenya</span>
            </div>

            {/* Map */}
            <div className="relative overflow-hidden rounded-lg h-40 sm:h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.262554889675!2d36.94!3d-0.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182862e1c8c0c3d9%3A0x4c8c0c8e8c8e8c8e!2sNyeri%2C%20Kenya!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-125 opacity-80"
              />
              <div className="absolute inset-0 pointer-events-none border border-border rounded-md sm:rounded-lg" />
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/254725297393"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 sm:mt-3 flex items-center justify-center gap-1.5 py-2 sm:py-2 text-xs border border-green-500/50 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300"
            >
              <MessageCircle className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" strokeWidth={1.5} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 sm:py-2 text-xs sm:text-[10px] bg-background border border-border rounded-lg focus:border-amber-400 focus:outline-none transition-colors placeholder:text-muted-foreground"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 sm:py-2 text-xs sm:text-[10px] bg-background border border-border rounded-lg focus:border-amber-400 focus:outline-none transition-colors placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-2">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 sm:py-2 text-xs sm:text-[10px] bg-background border border-border rounded-lg focus:border-amber-400 focus:outline-none transition-colors placeholder:text-muted-foreground"
                />
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  required
                  className="w-full px-3 py-2 sm:py-2 text-xs sm:text-[10px] bg-background border border-border rounded-lg focus:border-amber-400 focus:outline-none transition-colors text-muted-foreground"
                >
                  <option value="">Select Service</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Event">Event</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Training">Training</option>
                </select>
              </div>

              <textarea
                placeholder="Your Message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 sm:py-2 text-xs sm:text-[10px] bg-background border border-border rounded-lg focus:border-amber-400 focus:outline-none transition-colors resize-none placeholder:text-muted-foreground"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2 text-xs border border-amber-400/50 text-amber-400 rounded-lg hover:bg-amber-400 hover:text-background transition-all duration-300"
              >
                <Send className="h-3 w-3 sm:h-3 sm:w-3" strokeWidth={1.5} />
                <span>Send Message</span>
              </button>
            </form>

            {/* Quick Services */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
              <p className="text-xs sm:text-[10px] text-muted-foreground mb-2">Quick booking:</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-1.5">
                {["Wedding", "Portrait", "Event", "Commercial"].map((service) => (
                  <a
                    key={service}
                    href={`https://wa.me/254725297393?text=Hi, I'm interested in ${service} photography.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 sm:px-1.5 py-1 sm:py-0.5 text-xs sm:text-[8px] border border-border rounded-full text-muted-foreground hover:border-amber-400 hover:text-amber-400 transition-colors"
                  >
                    {service}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
