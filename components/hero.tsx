"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronDown, MapPin, Phone, Clock, Camera, Award, Users } from "lucide-react";

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

const stats = [
  { icon: Camera, value: "5000+", label: "Photos" },
  { icon: Users, value: "500+", label: "Clients" },
  { icon: Award, value: "10+", label: "Years" },
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
    <section id="home" className="relative h-screen flex flex-col overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      </div>

      {/* Video Controls - Top Right */}
      <div className="absolute top-20 right-4 md:right-6 z-20 flex gap-2">
        <button
          onClick={togglePlay}
          className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground transition-all hover:bg-amber-400 hover:text-background"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="h-3 w-3 md:h-4 md:w-4" /> : <Play className="h-3 w-3 md:h-4 md:w-4" />}
        </button>
        <button
          onClick={toggleMute}
          className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground transition-all hover:bg-amber-400 hover:text-background"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="h-3 w-3 md:h-4 md:w-4" /> : <Volume2 className="h-3 w-3 md:h-4 md:w-4" />}
        </button>
      </div>

      {/* Main Content - Full Height Distribution */}
      <div className="relative z-10 flex-1 flex flex-col justify-between pt-20 md:pt-24">
        {/* Top Section - Location Info */}
        <div className="px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div 
              className="opacity-0 animate-fade-in flex flex-wrap items-center gap-3 md:gap-6"
              style={{ animationFillMode: "forwards", animationDelay: "0.3s" }}
            >
              {locations.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 md:gap-2 text-muted-foreground">
                  <item.icon className="h-3 w-3 md:h-4 md:w-4 text-amber-400" />
                  <span className="text-xs md:text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section - Main Headline */}
        <div className="flex-1 flex items-center px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl w-full">
            <div className="max-w-3xl">
              <div className="opacity-0 animate-slide-in-left" style={{ animationFillMode: "forwards", animationDelay: "0.1s" }}>
                <p className="mb-2 md:mb-3 text-xs md:text-sm font-medium uppercase tracking-[0.2em] md:tracking-[0.3em] text-amber-400">
                  BMA Photography Studio
                </p>
              </div>
              
              <h1 
                className="opacity-0 animate-slide-in-left delay-200 mb-3 md:mb-4 font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="text-foreground">Capturing Your</span>
                <br />
                <span className="gradient-text">Precious Moments</span>
              </h1>

              {/* Typing Effect */}
              <div 
                className="opacity-0 animate-slide-in-left delay-300 mb-4 md:mb-6 h-8 md:h-10 flex items-center"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="text-sm md:text-base lg:text-lg text-muted-foreground">We specialize in </span>
                <span className="text-sm md:text-base lg:text-lg text-amber-400 font-semibold ml-1.5">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </div>

              <p 
                className="opacity-0 animate-slide-in-left delay-400 mb-6 md:mb-8 max-w-md text-xs md:text-sm text-muted-foreground leading-relaxed"
                style={{ animationFillMode: "forwards" }}
              >
                Professional photography services in Nyeri, Kenya. Transform your special 
                moments into timeless memories.
              </p>

              <div 
                className="opacity-0 animate-slide-in-left delay-500 flex flex-wrap items-center gap-3"
                style={{ animationFillMode: "forwards" }}
              >
                <a
                  href="#services"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-background transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105"
                >
                  <span>Explore Services</span>
                  <ChevronDown className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-y-0.5" />
                </a>
                <a
                  href="tel:+254725297393"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-foreground transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10"
                >
                  <Phone className="h-3 w-3 md:h-4 md:w-4" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Stats & Scroll */}
        <div className="px-4 md:px-6 lg:px-8 pb-6 md:pb-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              {/* Stats Row */}
              <div 
                className="opacity-0 animate-slide-in-left delay-600 flex items-center gap-4 md:gap-6"
                style={{ animationFillMode: "forwards" }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3">
                    <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-amber-400/20">
                      <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-[var(--font-heading)] text-lg md:text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                    {index < stats.length - 1 && (
                      <div className="h-8 w-px bg-border ml-2 md:ml-4" />
                    )}
                  </div>
                ))}
              </div>

              {/* Scroll Indicator */}
              <a 
                href="#services" 
                className="opacity-0 animate-fade-in delay-700 hidden md:flex flex-col items-center gap-1 text-muted-foreground hover:text-amber-400 transition-colors"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
