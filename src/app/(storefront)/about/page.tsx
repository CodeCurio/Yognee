"use client";

import React from "react";
import { Sparkles, ShieldCheck, Gem, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 space-y-16">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
          Our Heritage & Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground-primary">
          Architectural Precision & Tuscan Craftsmanship
        </h1>
        <p className="text-base text-foreground-secondary leading-relaxed pt-4">
          AURA Atelier was founded to bridge high-end mechanical horology, vegetable-tanned Tuscan leatherwork, and unstructured Milanese tailoring under one refined roof.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-card space-y-4">
          <div className="p-3 w-fit rounded-lg bg-blue-50 text-accent">
            <Gem className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-bold">Uncompromising Materials</h3>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            Grade 5 titanium alloy, 100% Loro Piana cashmere, and vegetable-tanned Italian hides sourced directly from certified tanneries.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-card space-y-4">
          <div className="p-3 w-fit rounded-lg bg-blue-50 text-accent">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-bold">Master Assembly</h3>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            Each timepiece undergoes 200+ hours of hand regulation in Florence to guarantee Swiss-certified chronometric precision.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-card space-y-4">
          <div className="p-3 w-fit rounded-lg bg-blue-50 text-accent">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-bold">Bespoke Longevity</h3>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            Our products are accompanied by lifetime restoration guarantees and serial certification numbers.
          </p>
        </div>
      </div>
    </div>
  );
}
