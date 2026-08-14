"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, PhoneCall, Calendar, CheckCircle2, UserCheck } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export const ConsultationSection: React.FC = () => {
  const toast = useToast();
  const [selectedService, setSelectedService] = useState("Vedic Astrology");
  const [selectedSlot, setSelectedSlot] = useState("Today, 4:00 PM");

  const services = [
    {
      title: "Vedic Astrology",
      desc: "Accurate insights & Janampatri analysis rooted in ancient Vedic scriptures.",
      icon: "☸️",
    },
    {
      title: "Palm Reading",
      desc: "Decode your life roadmap, career lines & destiny through palmistry analysis.",
      icon: "✋",
    },
    {
      title: "Crystal Guidance",
      desc: "Harness crystal frequencies to balance chakras and clear negative auric energy.",
      icon: "🔮",
    },
    {
      title: "Spiritual Healing",
      desc: "Align your body, mind & spirit through energized mantras and pranic cleansing.",
      icon: "🧘‍♂️",
    },
  ];

  const slots = ["Today, 4:00 PM", "Today, 6:30 PM", "Tomorrow, 11:00 AM", "Tomorrow, 3:00 PM"];

  const handleBook = () => {
    toast.success("Consultation Booking Initiated!", `Your appointment for ${selectedService} (${selectedSlot}) has been reserved. Our Acharya will contact you.`);
  };

  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-12 py-10">
      <div className="relative rounded-2xl overflow-hidden border border-border bg-background-card/80 p-8 sm:p-14 shadow-gold glass-card">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/banner1.png" alt="Astrology Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-primary to-background-dark" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Services */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-widest border border-border">
              <Sparkles className="h-3.5 w-3.5" /> Direct Astrologer Guidance
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-foreground-primary">
              Book 1-on-1 Consultation with <span className="text-gold-gradient">Vedic Acharyas</span>
            </h2>

            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed max-w-xl">
              Get personalized clarity on career choices, marriage compatibility, financial growth, and planetary remedies through confidential live video/audio phone sessions.
            </p>

            {/* 4 Core Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {services.map((item) => (
                <div
                  key={item.title}
                  onClick={() => setSelectedService(item.title)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    selectedService === item.title
                      ? "bg-background-dark border-gold shadow-gold text-white"
                      : "bg-background-dark/50 border-border/60 hover:border-gold/40 text-foreground-secondary"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-serif font-bold text-sm text-gold-light">{item.title}</h3>
                  </div>
                  <p className="text-[11px] text-foreground-muted leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Booking Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-xl bg-background-dark/95 border border-border shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">INSTANT BOOKING</span>
                  <h4 className="font-serif text-lg font-bold text-foreground-primary">{selectedService} Session</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-foreground-muted line-through">₹3,999</span>
                  <span className="block text-lg font-extrabold text-gold-light">₹2,499</span>
                </div>
              </div>

              {/* Slot Selector */}
              <div>
                <label className="block text-xs font-semibold text-gold-light mb-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gold" /> Select Available Time Slot:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        selectedSlot === slot
                          ? "bg-gold-gradient text-background-primary font-bold border-gold shadow-md"
                          : "bg-background-card text-foreground-secondary border-border/50 hover:border-gold/50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2 pt-1 text-xs text-foreground-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                  <span>45 Minutes Private Video / Tele-Call</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                  <span>Includes Free 50-Page Horoscope Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-gold" />
                  <span>100% Confidential & Certified Acharya</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleBook}
                className="w-full bg-gold-gradient text-background-primary py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold hover:scale-[1.02] transition-all"
              >
                <PhoneCall className="h-4 w-4" /> Book Session for {selectedSlot.split(",")[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
