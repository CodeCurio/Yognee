"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Clock, MapPin, User, CheckCircle2, Award } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function ChartCalculatorPage() {
  const toast = useToast();
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    gender: "Male",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dateOfBirth) {
      toast.error("Please fill in your name and date of birth.");
      return;
    }
    setStep("result");
    toast.success("Kundli Generated!", "Your personalized horoscope report is ready.");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-widest border border-border">
            <Sparkles className="h-3.5 w-3.5" /> Free Vedic Janam Kundli Tool
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground-primary">
            Instant Birth Chart & <span className="text-gold-gradient">Remedy Calculator</span>
          </h1>
          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
            Enter your exact birth credentials below to calculate your Ascendant (Lagna), Sun/Moon planetary positions, and recommended gemstones.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-background-card/80 border border-border shadow-gold glass-card">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gold-light mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-foreground-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-background-dark border border-border rounded-lg pl-10 pr-4 py-3 text-xs text-foreground-primary focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gold-light mb-1.5">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-foreground-muted" />
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-background-dark border border-border rounded-lg pl-10 pr-4 py-3 text-xs text-foreground-primary focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gold-light mb-1.5">Time of Birth (Approx)</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 h-4 w-4 text-foreground-muted" />
                    <input
                      type="time"
                      value={formData.timeOfBirth}
                      onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                      className="w-full bg-background-dark border border-border rounded-lg pl-10 pr-4 py-3 text-xs text-foreground-primary focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gold-light mb-1.5">City / Place of Birth</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-foreground-muted" />
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan, India"
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                    className="w-full bg-background-dark border border-border rounded-lg pl-10 pr-4 py-3 text-xs text-foreground-primary focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gold-gradient text-background-primary py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-gold hover:scale-[1.01] transition-all"
              >
                Generate Kundli Analysis ✨
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center sm:text-left">
              <div className="p-6 rounded-xl bg-background-dark border border-border space-y-2">
                <span className="text-4xl">☸️</span>
                <h3 className="font-serif font-bold text-2xl text-gold-light">
                  Janam Kundli for {formData.fullName}
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Birth Date: {formData.dateOfBirth} | Location: {formData.placeOfBirth || "India"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background-dark/80 border border-border/60">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider">ASCENDANT (LAGNA)</span>
                  <h4 className="font-serif font-bold text-lg text-white">Sagittarius (Dhanu)</h4>
                  <p className="text-xs text-foreground-muted">Governed by Jupiter (Guru)</p>
                </div>

                <div className="p-4 rounded-xl bg-background-dark/80 border border-border/60">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider">MOON SIGN (RASHI)</span>
                  <h4 className="font-serif font-bold text-lg text-white">Leo (Simha)</h4>
                  <p className="text-xs text-foreground-muted">Governed by Sun (Surya)</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-sm text-gold-light">Key Astronomical Remedies:</h4>
                <div className="p-3 rounded-lg bg-background-dark/60 border border-border/40 text-xs text-foreground-secondary flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" />
                  <span>Primary Gemstone: <strong>Yellow Sapphire (Pukhraj 4.25 Ratti)</strong> for wisdom & success.</span>
                </div>
                <div className="p-3 rounded-lg bg-background-dark/60 border border-border/40 text-xs text-foreground-secondary flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" />
                  <span>Sacred Rudraksha: <strong>5 Mukhi Nepal Rudraksha Mala</strong> for focus & inner peace.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setStep("form")}
                  className="px-6 py-3 rounded-lg bg-background-dark border border-border text-foreground-secondary font-semibold text-xs hover:text-white"
                >
                  Recalculate Another
                </button>
                <a
                  href="/products?category=gemstones"
                  className="flex-1 text-center bg-gold-gradient text-background-primary py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-gold"
                >
                  Explore Certified Gemstones →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
