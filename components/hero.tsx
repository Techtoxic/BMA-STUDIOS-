"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronDown, MapPin, Phone, Clock, Camera } from "lucide-react";

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
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      </div>

      {/* Video Controls - Top Right */}
      <div className="absolute top-24 right-4 sm:right-6 z-20 flex gap-2">
        <button
          onClick={togglePlay}
          className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground transition-all hover:bg-amber-400/20 hover:text-amber-400"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
        </button>
        <button
          onClick={toggleMute}
          className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground transition-all hover:bg-amber-400/20 hover:text-amber-400"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
        </button>
      </div>

      {/* Main Content - Left Aligned, Distributed */}
      <div className="relative z-10 flex-1 flex items-start sm:items-center pt-24 sm:pt-0">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
            
            {/* Left Side - Main Headline */}
            <div className="lg:flex-1 lg:max-w-2xl">
              <h1 
                className="opacity-0 animate-slide-in-left font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 sm:mb-6"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="text-foreground">Capturing Your</span>
                <br />
                <span className="gradient-text">Precious Moments</span>
              </h1>

              {/* Typing Effect */}
              <div 
                className="opacity-0 animate-slide-in-left delay-200 mb-4 sm:mb-6 flex items-center flex-wrap"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="text-xs sm:text-sm md:text-base text-muted-foreground">We specialize in</span>
                <span className="text-xs sm:text-sm md:text-base text-amber-400 font-semibold ml-1.5">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </div>

              <p 
                className="opacity-0 animate-slide-in-left delay-300 mb-6 sm:mb-8 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed"
                style={{ animationFillMode: "forwards" }}
              >
                Professional photography services in Nyeri, Kenya. Transform your special 
                moments into timeless memories with artistic excellence.
              </p>

              {/* CTA Buttons - Toned Down */}
              <div 
                className="opacity-0 animate-slide-in-left delay-400 flex flex-wrap items-center gap-3"
                style={{ animationFillMode: "forwards" }}
              >
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-400/10 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-amber-400 transition-all duration-300 hover:bg-amber-400/20 hover:border-amber-400"
                >
                  <span>Explore Services</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
                <a
                  href="tel:+254725297393"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/5"
                >
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* Right Side - Description Card */}
            <div 
              className="hidden lg:block lg:flex-1 lg:max-w-sm opacity-0 animate-slide-in-right delay-500"
              style={{ animationFillMode: "forwards" }}
            >
              <div className="border-l-2 border-amber-400/30 pl-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  From wedding celebrations to professional portraits, we bring your vision to life with expert craftsmanship.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-amber-400"></span>
                  <span>Est. 2014</span>
                  <span className="h-1 w-1 rounded-full bg-amber-400"></span>
                  <span>Nyeri, Kenya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Stats Left, Studio Name Right */}
      <div className="relative z-10 mb-16 sm:mb-6">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
            
            {/* Left - Stats (No Cards, Small Font) */}
            <div 
              className="opacity-0 animate-fade-in delay-600"
              style={{ animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-3 sm:gap-4 text-xs">
                <div>
                  <span className="font-semibold text-amber-400">5000+</span>
                  <span className="text-muted-foreground ml-1">Photos</span>
                </div>
                <span className="text-muted-foreground/40">|</span>
                <div>
                  <span className="font-semibold text-amber-400">500+</span>
                  <span className="text-muted-foreground ml-1">Clients</span>
                </div>
                <span className="text-muted-foreground/40">|</span>
                <div>
                  <span className="font-semibold text-amber-400">10+</span>
                  <span className="text-muted-foreground ml-1">Years</span>
                </div>
                <span className="text-muted-foreground/40">|</span>
                <div>
                  <span className="font-semibold text-amber-400">4.9</span>
                  <span className="text-muted-foreground ml-1">Rating</span>
                </div>
              </div>
            </div>

            {/* Right - Studio Name & Location */}
            <div 
              className="opacity-0 animate-fade-in delay-700"
              style={{ animationFillMode: "forwards" }}
            >
              <div className="flex flex-col sm:items-end gap-1">
                <div className="flex items-center gap-1.5 text-xs text-foreground">
                  <Camera className="h-3 w-3 text-amber-400" />
                  <span className="font-medium">BMA Photography Studio</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 text-amber-400/70" />
                    <span>Nyeri Town</span>
                  </div>
                  <span className="text-muted-foreground/40">|</span>
                  <div className="flex items-center gap-1">
                    <Phone className="h-2.5 w-2.5 text-amber-400/70" />
                    <span>+254 725 297393</span>
                  </div>
                  <span className="text-muted-foreground/40">|</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5 text-amber-400/70" />
                    <span>Mon-Sat 8AM-6PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile to save space */}
      <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <a href="#services" className="flex flex-col items-center gap-0.5 text-muted-foreground/60 hover:text-amber-400 transition-colors">
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
