"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronDown, Award, Users, Camera, Star } from "lucide-react";

const stats = [
  { icon: Camera, value: "5000+", label: "Photos Taken" },
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: Award, value: "10+", label: "Years Experience" },
  { icon: Star, value: "4.9", label: "Client Rating" },
];

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-32 right-6 z-20 flex flex-col gap-2">
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

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-amber-400">
            Welcome to BMA Photography Studio
          </p>
        </div>
        
        <h1 
          className="opacity-0 animate-fade-in-up delay-200 mb-6 font-[var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          style={{ animationFillMode: "forwards" }}
        >
          <span className="text-foreground">Capturing Your</span>
          <br />
          <span className="gradient-text">Precious Moments</span>
        </h1>

        <p 
          className="opacity-0 animate-fade-in-up delay-300 mx-auto mb-10 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          style={{ animationFillMode: "forwards" }}
        >
          Professional photography services in Nyeri, Kenya. From weddings to portraits, 
          we transform your special moments into timeless memories with artistic excellence.
        </p>

        <div 
          className="opacity-0 animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationFillMode: "forwards" }}
        >
          <a
            href="#services"
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-4 text-sm font-semibold text-background transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
          >
            <span>Explore Our Services</span>
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400/50 px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10"
          >
            View Portfolio
          </a>
        </div>

        {/* Stats */}
        <div 
          className="opacity-0 animate-fade-in-up delay-500 mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12"
          style={{ animationFillMode: "forwards" }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="group text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50 transition-all duration-300 group-hover:bg-amber-400/20 group-hover:scale-110">
                <stat.icon className="h-6 w-6 text-amber-400" />
              </div>
              <p className="font-[var(--font-heading)] text-2xl sm:text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a href="#services" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-amber-400 transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
