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
    <div className="relative w-full h-[calc(100vh-110px)] min-h-[580px] max-h-[820px] overflow-hidden bg-[#14001F] border-b border-gold/30">
      {/* Slide Image with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSlide.image_url}
            alt={currentSlide.heading}
            className="w-full h-full object-cover object-[85%_center] sm:object-right md:object-[80%_center]"
          />
          {/* Overlay Gradient: Text readable on left, image crisp on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#14001F] via-[#1F002C]/85 sm:via-[#1F002C]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14001F] via-transparent to-transparent opacity-80" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative max-w-[1440px] h-full mx-auto px-6 sm:px-12 flex flex-col justify-center text-foreground-primary z-10">
        <div className="max-w-xl sm:max-w-2xl pt-6">
          {/* Subheading Tag */}
          <motion.div
            key={`sub-${currentSlide.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="inline-flex items-center gap-2 bg-[#2B003B]/90 border border-gold/40 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-gold-light mb-4 shadow-lg backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold animate-spin" style={{ animationDuration: "8s" }} />
            <span>{currentSlide.subheading}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            key={`head-${currentSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] mb-6 text-white tracking-tight text-shadow"
          >
            {currentSlide.heading}
          </motion.h1>

          {/* CTA Buttons */}
          <motion.div
            key={`cta-${currentSlide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3.5"
          >
            <Link href={currentSlide.cta_link}>
              <button className="bg-gold-gradient text-background-primary px-7 py-3.5 rounded-lg font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-gold hover:scale-105">
                {currentSlide.cta_text} →
              </button>
            </Link>
            <Link href="/chart-calculator">
              <button className="bg-[#2B003B]/80 text-gold-light border border-gold/40 hover:border-gold hover:bg-[#2B003B] px-6 py-3.5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md">
                Free Kundli Check
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Controls & Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-6 sm:left-12 right-6 sm:right-12 z-20 flex items-center justify-between">
          {/* Slide Dots */}
          <div className="flex items-center gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: idx === currentIndex ? "40px" : "14px" }}
                aria-label={`Slide ${idx + 1}`}
              >
                <div
                  className={`w-full h-full ${
                    idx === currentIndex ? "bg-gold-gradient shadow-gold" : "bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Prev/Next Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="p-2.5 rounded-full bg-[#1A0027]/80 text-gold border border-gold/40 hover:bg-[#2B003B] hover:text-white transition-all shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="p-2.5 rounded-full bg-[#1A0027]/80 text-gold border border-gold/40 hover:bg-[#2B003B] hover:text-white transition-all shadow-md"
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
