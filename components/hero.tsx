"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronDown, MapPin, Phone, Clock } from "lucide-react";

const locations = [
  { icon: MapPin, text: "Nyeri Town, Kenya" },
  { icon: Phone, text: "+254 725 297393" },
  { icon: Clock, text: "Mon - Sat: 8AM - 6PM" },
];

const typewriterTexts = [
  "Wedding Photography",
  "Studio Portraits",
  "Creative Photoshoots",
  "Graphic Design",
  "Photo Editing",
  "Camera Sales",
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  // Typing effect
  useEffect(() => {
    const currentFullText = typewriterTexts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-pictures-in-a-studio-34421-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Top Location Bar */}
      <div className="relative z-10 mt-20 lg:mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div 
            className="opacity-0 animate-fade-in flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-10"
            style={{ animationFillMode: "forwards", animationDelay: "0.5s" }}
          >
            {locations.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="h-4 w-4 text-amber-400" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Controls - Top Right */}
      <div className="absolute top-24 right-6 z-20 flex gap-2">
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground transition-all hover:bg-amber-400 hover:text-background"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          onClick={toggleMute}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground transition-all hover:bg-amber-400 hover:text-background"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Content - Bottom Left */}
      <div className="relative z-10 flex-1 flex items-end pb-32 lg:pb-40">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            {/* Left Column - Main Text */}
            <div className="text-left">
              <div className="opacity-0 animate-slide-in-left" style={{ animationFillMode: "forwards" }}>
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-400">
                  BMA Photography Studio
                </p>
              </div>
              
              <h1 
                className="opacity-0 animate-slide-in-left delay-200 mb-6 font-[var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1]"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="text-foreground block">Capturing Your</span>
                <span className="gradient-text block">Precious Moments</span>
              </h1>

              {/* Typing Effect */}
              <div 
                className="opacity-0 animate-slide-in-left delay-300 mb-8 h-12 flex items-center"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="text-lg sm:text-xl text-muted-foreground">We specialize in </span>
                <span className="text-lg sm:text-xl text-amber-400 font-semibold ml-2">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </div>

              <p 
                className="opacity-0 animate-slide-in-left delay-400 mb-10 max-w-lg text-base text-muted-foreground leading-relaxed"
                style={{ animationFillMode: "forwards" }}
              >
                Professional photography services in Nyeri, Kenya. Transform your special 
                moments into timeless memories with artistic excellence and creativity.
              </p>

              <div 
                className="opacity-0 animate-slide-in-left delay-500 flex flex-col sm:flex-row items-start gap-4"
                style={{ animationFillMode: "forwards" }}
              >
                <a
                  href="#services"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-4 text-sm font-semibold text-background transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
                >
                  <span>Explore Services</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                </a>
                <a
                  href="tel:+254725297393"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400/50 px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div 
              className="opacity-0 animate-slide-in-right delay-600 lg:text-right"
              style={{ animationFillMode: "forwards" }}
            >
              <div className="grid grid-cols-2 gap-6 lg:gap-8">
                <div className="text-left lg:text-right p-4 rounded-2xl bg-background/20 backdrop-blur-sm border border-foreground/10">
                  <p className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-amber-400">5000+</p>
                  <p className="text-sm text-muted-foreground mt-1">Photos Captured</p>
                </div>
                <div className="text-left lg:text-right p-4 rounded-2xl bg-background/20 backdrop-blur-sm border border-foreground/10">
                  <p className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-amber-400">500+</p>
                  <p className="text-sm text-muted-foreground mt-1">Happy Clients</p>
                </div>
                <div className="text-left lg:text-right p-4 rounded-2xl bg-background/20 backdrop-blur-sm border border-foreground/10">
                  <p className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-amber-400">10+</p>
                  <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
                </div>
                <div className="text-left lg:text-right p-4 rounded-2xl bg-background/20 backdrop-blur-sm border border-foreground/10">
                  <p className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-amber-400">4.9</p>
                  <p className="text-sm text-muted-foreground mt-1">Client Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a href="#services" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-amber-400 transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
