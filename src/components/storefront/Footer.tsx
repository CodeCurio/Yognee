"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, ArrowRight, ShieldCheck, Sparkles, Award, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Welcome to Yoginee Divine Circle!", "Thank you for subscribing to daily horoscope insights & exclusive offers.");
    setEmail("");
  };

  return (
    <footer className="bg-background-dark text-foreground-primary border-t border-border pt-16 pb-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amethyst/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-10">
        {/* Value Propositions / Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-border/60">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-background-card/50 border border-border/40">
            <div className="p-3 rounded-full bg-gold/15 text-gold">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-light">100% Certified Gemstones</h4>
              <p className="text-[11px] text-foreground-muted">Government approved gem lab certified</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-background-card/50 border border-border/40">
            <div className="p-3 rounded-full bg-gold/15 text-gold">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-light">Ritual Energization (Puja)</h4>
              <p className="text-[11px] text-foreground-muted">Vedic mantras energized before dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-background-card/50 border border-border/40">
            <div className="p-3 rounded-full bg-gold/15 text-gold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-light">Expert Astrologer Guidance</h4>
              <p className="text-[11px] text-foreground-muted">1-on-1 personalized tele-consultations</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-background-card/50 border border-border/40">
            <div className="p-3 rounded-full bg-gold/15 text-gold">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-light">Express Insured Delivery</h4>
              <p className="text-[11px] text-foreground-muted">Pan-India & worldwide tracked shipping</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/yoginee-logo.png" alt="Yoginee Astrology Logo" className="h-12 w-auto" />
            </Link>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed max-w-sm">
              Empowering your life path with authentic Vedic Astrology insights, certified natural gemstones, consecrated Rudraksha beads, and sacred geometry Yantras.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-light mb-2">
                Subscribe for Daily Cosmic Guidance & Special Offers
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-background-card border border-border rounded-lg px-3.5 py-2.5 text-xs text-foreground-primary focus:outline-none focus:border-gold placeholder:text-foreground-muted"
                />
                <button
                  type="submit"
                  className="bg-gold-gradient text-background-primary px-4 py-2.5 rounded-lg hover:scale-105 transition-all font-bold text-xs flex items-center justify-center shadow-md"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">
              Astro Products
            </h4>
            <ul className="space-y-2.5 text-xs text-foreground-secondary">
              <li><Link href="/products?category=gemstones" className="hover:text-gold transition-colors">Certified Gemstones (Ratna)</Link></li>
              <li><Link href="/products?category=rudraksha" className="hover:text-gold transition-colors">Nepal Rudraksha Malas</Link></li>
              <li><Link href="/products?category=yantras" className="hover:text-gold transition-colors">Energized 3D Yantras</Link></li>
              <li><Link href="/products?category=crystals" className="hover:text-gold transition-colors">Healing Crystals & Pyramids</Link></li>
              <li><Link href="/products?category=reports" className="hover:text-gold transition-colors">Janam Kundli Reports</Link></li>
            </ul>
          </div>

          {/* Col 3: Services & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">
              Services & Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-foreground-secondary">
              <li><Link href="/consultations" className="hover:text-gold transition-colors">Book Astrologer Consultation</Link></li>
              <li><Link href="/chart-calculator" className="hover:text-gold transition-colors">Free Birth Chart Generator</Link></li>
              <li><Link href="/#zodiac-widget" className="hover:text-gold transition-colors">Daily Rashi Horoscope</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About Yoginee Vedic Science</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Astro Experts</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">
              Connect With Us
            </h4>
            <div className="space-y-2 text-xs text-foreground-muted mb-6">
              <p>📍 Yoginee Spiritual Care Center</p>
              <p>✉️ care@yoginee.com</p>
              <p>📞 +91 (800) 789-YOGI</p>
            </div>

            <div className="flex items-center gap-3 text-gold-light">
              <a href="#" className="p-2 rounded-full bg-background-card border border-border hover:border-gold hover:text-gold transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background-card border border-border hover:border-gold hover:text-gold transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background-card border border-border hover:border-gold hover:text-gold transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background-card border border-border hover:border-gold hover:text-gold transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-foreground-muted">
          <p>© {new Date().getFullYear()} Yoginee. Sacred Vedic Astrology & Genuine Gemstones. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="bg-background-card border border-border px-2.5 py-1 rounded text-[10px] font-bold text-gold-light">RAZORPAY SECURE</span>
            <span className="bg-background-card border border-border px-2.5 py-1 rounded text-[10px] font-bold text-gold-light">100% GENUINE GUARANTEE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

