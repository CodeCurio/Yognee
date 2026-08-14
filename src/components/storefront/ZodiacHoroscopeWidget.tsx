"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, ShieldCheck, ArrowRight } from "lucide-react";
import { RASHI_LIST } from "@/lib/astrologyData";
import Link from "next/link";

export const ZodiacHoroscopeWidget: React.FC = () => {
  const [selectedRashi, setSelectedRashi] = useState(RASHI_LIST[8]); // Default Sagittarius (Dhanu - Jupiter)

  return (
    <section id="zodiac-widget" className="max-w-[1440px] mx-auto px-6 sm:px-12 py-10">
      <div className="relative rounded-2xl p-6 sm:p-10 border border-border bg-gradient-to-b from-background-card/90 via-background-secondary/80 to-background-card/90 backdrop-blur-xl shadow-gold overflow-hidden">
        {/* Subtle celestial background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amethyst/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-widest mb-3 border border-border">
              <Compass className="h-3.5 w-3.5" /> Planetary Alignment Tool
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground-primary">
              Select Your <span className="text-gold-gradient">Rashi (Zodiac Sign)</span>
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-2">
              Discover today&apos;s cosmic planetary guidance, ruling deity, and recommended lucky gemstone.
            </p>
          </div>

          {/* Rashi Selector Horizontal Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 mb-8">
            {RASHI_LIST.map((rashi) => {
              const isSelected = selectedRashi.name === rashi.name;
              return (
                <button
                  key={rashi.name}
                  onClick={() => setSelectedRashi(rashi)}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 border ${
                    isSelected
                      ? "bg-gold-gradient text-background-primary border-gold font-bold shadow-gold scale-105"
                      : "bg-background-dark/70 text-foreground-secondary border-border/60 hover:border-gold/50 hover:text-foreground-primary"
                  }`}
                >
                  <span className="text-xl mb-1">{rashi.icon}</span>
                  <span className="text-[11px] font-semibold tracking-tight line-clamp-1">{rashi.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Rashi Guidance Box */}
          <motion.div
            key={selectedRashi.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-background-dark/80 border border-border/80"
          >
            {/* Left: Summary */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedRashi.icon}</span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-gold-light">{selectedRashi.name}</h3>
                  <div className="flex gap-4 text-xs text-foreground-muted font-medium mt-0.5">
                    <span>Ruler: <strong className="text-gold">{selectedRashi.ruler}</strong></span>
                    <span>Element: <strong className="text-foreground-secondary">{selectedRashi.element}</strong></span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed pt-1">
                {selectedRashi.desc}
              </p>
            </div>

            {/* Right: Recommendation */}
            <div className="flex flex-col justify-between p-4 rounded-lg bg-background-card border border-border/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold block mb-1">
                  RECOMMENDED REMEDY
                </span>
                <h4 className="font-serif font-bold text-sm text-foreground-primary">
                  {selectedRashi.gemstone}
                </h4>
                <p className="text-[11px] text-foreground-muted mt-1">
                  Energized for {selectedRashi.ruler} alignment.
                </p>
              </div>

              <Link
                href={`/products?category=gemstones`}
                className="mt-4 inline-flex items-center justify-between text-xs font-bold text-gold hover:text-white transition-colors"
              >
                <span>Browse {selectedRashi.gemstone}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
