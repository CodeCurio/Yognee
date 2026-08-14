"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Calendar, Clock, MapPin, User, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface BirthChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BirthChartPreviewModal: React.FC<BirthChartModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dateOfBirth) {
      toast.error("Please fill in your name and birth date.");
      return;
    }
    setStep("result");
    toast.success("Kundli Calculated!", "Your Vedic planetary chart preview is generated below.");
  };

  const handleReset = () => {
    setStep("form");
    setFormData({ fullName: "", dateOfBirth: "", timeOfBirth: "", placeOfBirth: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-background-dark border border-border rounded-2xl p-6 sm:p-8 shadow-gold relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-foreground-muted hover:text-gold transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full border border-border">
                <Sparkles className="h-3 w-3" /> Vedic Astrology Kundli Calculator
              </span>
              <h3 className="font-serif text-2xl font-bold text-foreground-primary mt-2">
                Free Janam Kundli Check
              </h3>
            </div>

            {step === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-light mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-background-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-foreground-primary focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gold-light mb-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
                      <input
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full bg-background-card border border-border rounded-lg pl-9 pr-3 py-2.5 text-xs text-foreground-primary focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gold-light mb-1">Time of Birth</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
                      <input
                        type="time"
                        value={formData.timeOfBirth}
                        onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                        className="w-full bg-background-card border border-border rounded-lg pl-9 pr-3 py-2.5 text-xs text-foreground-primary focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-light mb-1">City / Place of Birth</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, Mumbai, Jaipur"
                      value={formData.placeOfBirth}
                      onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                      className="w-full bg-background-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-xs text-foreground-primary focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-gold-gradient text-background-primary py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-gold hover:scale-[1.02] transition-all"
                >
                  Generate Kundli Analysis ✨
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background-card border border-border text-center space-y-2">
                  <span className="text-3xl">☸️</span>
                  <h4 className="font-serif font-bold text-lg text-gold-light">
                    Janampatri Analysis for {formData.fullName}
                  </h4>
                  <p className="text-xs text-foreground-secondary">
                    Ascendant (Lagna): <strong className="text-gold">Sagittarius (Dhanu)</strong> | Moon Sign: <strong className="text-gold">Leo (Simha)</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-foreground-secondary p-2.5 rounded-lg bg-background-dark/80 border border-border/40">
                    <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" />
                    <span>Benefic Planet: <strong>Jupiter (Guru) in 1st House</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-secondary p-2.5 rounded-lg bg-background-dark/80 border border-border/40">
                    <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" />
                    <span>Recommended Gemstone: <strong>Yellow Sapphire (Pukhraj)</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-secondary p-2.5 rounded-lg bg-background-dark/80 border border-border/40">
                    <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0" />
                    <span>Spiritual Remedy: <strong>5 Mukhi Nepal Rudraksha & Sri Yantra</strong></span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-background-card border border-border text-foreground-secondary py-2.5 rounded-lg font-semibold text-xs hover:text-white"
                  >
                    Calculate Another
                  </button>
                  <a
                    href="/products?category=gemstones"
                    className="flex-1 text-center bg-gold-gradient text-background-primary py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md"
                  >
                    View Recommended Remedies
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
