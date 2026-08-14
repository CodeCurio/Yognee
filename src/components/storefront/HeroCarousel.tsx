"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSlide } from "@/types";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { YOGINEE_HERO_SLIDES } from "@/lib/astrologyData";

export const HeroCarousel: React.FC = () => {
  const [slides] = useState<HeroSlide[]>(YOGINEE_HERO_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate slides every 6s
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="relative w-full h-[75vh] min-h-[520px] max-h-[720px] overflow-hidden bg-background-dark border-b border-border/50">
      {/* Slide Image with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSlide.image_url}
            alt={currentSlide.heading}
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay Gradient with Royal Purple Tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/95 via-background-primary/75 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-background-dark/20 to-background-dark/90" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative max-w-[1440px] h-full mx-auto px-6 sm:px-12 flex flex-col justify-center text-foreground-primary z-10">
        <div className="max-w-2xl">
          {/* Subheading Tag */}
          <motion.div
            key={`sub-${currentSlide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-background-card/80 border border-border px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-gold-light mb-5 backdrop-blur-md shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold animate-spin" style={{ animationDuration: "8s" }} />
            <span>{currentSlide.subheading}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            key={`head-${currentSlide.id}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] mb-8 text-white tracking-tight"
          >
            {currentSlide.heading}
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            key={`cta-${currentSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-wrap gap-4"
          >
            <Link href={currentSlide.cta_link}>
              <button className="bg-gold-gradient text-background-primary px-8 py-3.5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-widest transition-all shadow-gold hover:scale-105">
                {currentSlide.cta_text} →
              </button>
            </Link>
            <Link href="/chart-calculator">
              <button className="bg-background-card/70 backdrop-blur-md text-gold-light border border-border hover:border-gold px-6 py-3.5 rounded-lg font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all">
                Free Kundli Check 🔮
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Controls & Progress Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-6 sm:left-12 right-6 sm:right-12 z-20 flex items-center justify-between">
          {/* Progress Indicators */}
          <div className="flex items-center gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: idx === currentIndex ? "36px" : "14px" }}
              >
                <div
                  className={`w-full h-full ${
                    idx === currentIndex ? "bg-gold-gradient" : "bg-white/30"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Prev/Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="p-2.5 rounded-full bg-background-dark/70 text-gold-light border border-border hover:bg-background-card backdrop-blur-md transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="p-2.5 rounded-full bg-background-dark/70 text-gold-light border border-border hover:bg-background-card backdrop-blur-md transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

