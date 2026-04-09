"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, ArrowRight } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "+254 725 297393",
    href: "tel:+254725297393",
    color: "from-amber-400 to-amber-600",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+254 725 297393",
    href: "https://wa.me/254725297393",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@bmaphotography.co.ke",
    href: "mailto:info@bmaphotography.co.ke",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Sat: 8AM - 6PM",
    href: null,
    color: "from-purple-500 to-purple-600",
  },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Hi BMA Photography!

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${formData.service}

Message: ${formData.message}`;
    window.open(`https://wa.me/254725297393?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-400">
            Get In Touch
          </p>
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Contact <span className="gradient-text">Us</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Ready to capture your special moments? Reach out to us today and let&apos;s create 
            something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info & Map */}
          <div 
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div>
              <h3 className="font-[var(--font-heading)] text-2xl font-bold text-foreground mb-6">
                Let&apos;s Create Something Amazing Together
              </h3>
              <p className="text-muted-foreground mb-8">
                Whether you need wedding photography, studio portraits, or creative photoshoots, 
                we&apos;re here to bring your vision to life.
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const Content = (
                  <div className="group flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 transition-all duration-300 hover:bg-secondary">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${info.color} transition-transform duration-300 group-hover:scale-110`}>
                      <info.icon className="h-5 w-5 text-background" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{info.label}</p>
                      <p className="font-medium text-foreground text-sm">{info.value}</p>
                    </div>
                  </div>
                );

                return info.href ? (
                  <a key={index} href={info.href} target={info.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {Content}
                  </a>
                ) : (
                  <div key={index}>{Content}</div>
                );
              })}
            </div>

            {/* Google Map */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[16/10]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.75772090833!2d36.89442!3d-0.4245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1828860e8be6fd6f%3A0xf98b0b7b8b3c2a9d!2sNyeri%2C%20Kenya!5e0!3m2!1sen!2s!4v1699000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-125 opacity-80"
                title="BMA Photography Studio Location"
              />
              <div className="absolute inset-0 pointer-events-none border border-border rounded-3xl" />
              
              {/* Map Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-background/90 backdrop-blur-sm flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
                  <MapPin className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">BMA Photography Studio</p>
                  <p className="text-xs text-muted-foreground">Nyeri Town, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div 
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative rounded-3xl bg-secondary/30 p-6 lg:p-10 border border-border/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
              
              <h3 className="font-[var(--font-heading)] text-xl font-bold text-foreground mb-2">
                Send Us a Message
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="sr-only">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Your Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="sr-only">Your Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Your Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="sr-only">Select Service</label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all appearance-none"
                    >
                      <option value="">Select Service</option>
                      <option value="Wedding Photography">Wedding Photography</option>
                      <option value="Studio Portraits">Studio Portraits</option>
                      <option value="Creative Photoshoots">Creative Photoshoots</option>
                      <option value="Photo Mounting">Photo Mounting</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Editing Training">Editing Training</option>
                      <option value="Camera Equipment">Camera Equipment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="sr-only">Your Message</label>
                  <textarea
                    id="message"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-4 text-sm font-semibold text-background transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02]"
                >
                  <Send className="h-4 w-4" />
                  <span>Send via WhatsApp</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
