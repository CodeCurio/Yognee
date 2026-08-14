"use client";

import React, { useState } from "react";
import { ConsultationSection } from "@/components/storefront/ConsultationSection";
import { Sparkles, Award, ShieldCheck, Video, Phone, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ConsultationsPage() {
  return (
    <div className="space-y-12 pb-20 pt-6">
      {/* Page Header */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 text-center max-w-3xl">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-widest border border-border mb-3">
          <Sparkles className="h-3.5 w-3.5" /> 1-on-1 Confidential Sessions
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground-primary">
          Vedic Astrology & <span className="text-gold-gradient">Spiritual Guidance</span>
        </h1>
        <p className="text-xs sm:text-sm text-foreground-secondary mt-3 leading-relaxed">
          Book direct consultations with senior Acharyas and Vedic scholars. Receive accurate planetary analysis, Dasha roadmaps, and personalized gemstone/puja remedies.
        </p>
      </div>

      {/* Main Interactive Booking Section */}
      <ConsultationSection />

      {/* Process Walkthrough */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground-primary">
            How Your <span className="text-gold-gradient">Consultation Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-background-card/80 border border-border text-center space-y-3 glass-card">
            <div className="w-12 h-12 rounded-full bg-gold/15 text-gold font-bold text-xl flex items-center justify-center mx-auto border border-border">
              1
            </div>
            <h3 className="font-serif font-bold text-base text-gold-light">Reserve Preferred Slot</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Choose your consultation category (Vedic, Palmistry, Crystals, or Healing) and select a convenient time slot.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-background-card/80 border border-border text-center space-y-3 glass-card">
            <div className="w-12 h-12 rounded-full bg-gold/15 text-gold font-bold text-xl flex items-center justify-center mx-auto border border-border">
              2
            </div>
            <h3 className="font-serif font-bold text-base text-gold-light">Kundli Preparation</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Our Vedic Acharya prepares your detailed birth chart (Janampatri) and planetary Dasha positions beforehand.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-background-card/80 border border-border text-center space-y-3 glass-card">
            <div className="w-12 h-12 rounded-full bg-gold/15 text-gold font-bold text-xl flex items-center justify-center mx-auto border border-border">
              3
            </div>
            <h3 className="font-serif font-bold text-base text-gold-light">Private 45-Min Call</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Connect via confidential video/phone session. Discuss life questions, career roadmap, and receive 100% genuine remedies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
