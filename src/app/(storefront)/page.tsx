"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroCarousel } from "@/components/storefront/HeroCarousel";
import { TrustBadges } from "@/components/storefront/TrustBadges";
import { ProductCard } from "@/components/storefront/ProductCard";
import { QuickViewModal } from "@/components/storefront/QuickViewModal";
import { ZodiacHoroscopeWidget } from "@/components/storefront/ZodiacHoroscopeWidget";
import { BirthChartPreviewModal } from "@/components/storefront/BirthChartPreviewModal";
import { ConsultationSection } from "@/components/storefront/ConsultationSection";
import { YOGINEE_PRODUCTS, MAIN_BRACELET_CATEGORIES } from "@/lib/astrologyData";
import { Product } from "@/types";
import { ArrowRight, Sparkles, ShieldCheck, Award, Star, Quote } from "lucide-react";

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  const bestSellers = YOGINEE_PRODUCTS.slice(0, 4);
  const gemstones = YOGINEE_PRODUCTS.filter((p) => p.category_id === "cat-prosperity" || p.category_id === "cat-navgraha" || p.category_id === "cat-protection");

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Banner Carousel */}
      <HeroCarousel />

      {/* 2. Trust Marquee */}
      <TrustBadges />

      {/* 3. Shop by Bracelet Category Horizontal Scroll */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold block mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Sacred Energy Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground-primary">
              Explore by <span className="text-gold-gradient">Bracelet Category</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-widest text-gold hover:text-white transition-colors flex items-center gap-1 mt-4 md:mt-0"
          >
            Explore All Bracelets <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {MAIN_BRACELET_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-80 min-w-[260px] sm:min-w-[300px] rounded-xl overflow-hidden shadow-card hover:shadow-gold flex-shrink-0 snap-start bg-background-card border border-border/60 hover:border-gold/60 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image_url || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80"}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-foreground-primary">
                <h3 className="font-serif text-xl font-bold mb-1 text-gold-light group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed">{cat.description}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gold mt-3 group-hover:translate-x-1 transition-transform">
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Daily Rashi Horoscope Widget */}
      <ZodiacHoroscopeWidget />

      {/* 5. Featured Best Sellers Grid */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold block mb-1">
              Top Rated Remedies
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground-primary">
              Best Selling <span className="text-gold-gradient">Vedic Items</span>
            </h2>
          </div>
          <Link
            href="/products?sort=popular"
            className="text-xs font-bold uppercase tracking-widest text-gold hover:text-white transition-colors flex items-center gap-1"
          >
            View All Best Sellers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {bestSellers.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 6. Birth Chart Calculator Callout Banner */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-background-dark via-background-card to-background-dark border border-border p-8 sm:p-12 shadow-gold glass-card text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-widest border border-border">
              <Award className="h-3.5 w-3.5 text-gold" /> Free Vedic Janam Kundli Tool
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-foreground-primary">
              Curious About Your <span className="text-gold-gradient">Planetary Positions & Remedies?</span>
            </h3>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              Generate your instant Kundli preview report online. Identify your Ruling Planet, Ascendant (Lagna), and suitable gemstones.
            </p>
          </div>

          <button
            onClick={() => setIsChartModalOpen(true)}
            className="bg-gold-gradient text-background-primary px-8 py-3.5 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-widest shadow-gold hover:scale-105 transition-all flex-shrink-0"
          >
            Generate Free Kundli ✨
          </button>
        </div>
      </section>

      {/* 7. Astrology Consultations Showcase Section */}
      <ConsultationSection />

      {/* 8. Certified Gemstones & Rudraksha Collection */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold block mb-1">
            Purity & Consecration Guaranteed
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground-primary">
            Lab Certified <span className="text-gold-gradient">Gemstones & Rudraksha</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground-secondary mt-2">
            Every gemstone and bead at Yoginee undergoes rigorous lab testing and ritualistic Pran-Pratishtha energization.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {gemstones.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 9. Client Testimonials */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12">
        <div className="relative rounded-2xl bg-background-card/80 border border-border p-8 sm:p-12 shadow-gold glass-card">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-1">
              Devotee Experiences
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground-primary">
              Trusted by 50,000+ Seeking <span className="text-gold-gradient">Cosmic Guidance</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The Yellow Sapphire I ordered from Yoginee transformed my business clarity within 40 days. The lab report and video energization gave me immense trust.",
                author: "Rajesh K., Mumbai",
                role: "Verified Gemstone Buyer",
                rating: 5,
              },
              {
                quote: "My 45-minute consultation with Yoginee Acharya decoded why my career had stalled. The simple remedies and 5 Mukhi Mala restored my peace of mind.",
                author: "Priya V., Bengaluru",
                role: "Consultation Client",
                rating: 5,
              },
              {
                quote: "The 3D Sri Yantra for my home temple is heavy, pure, and radiates immense positive aura. Truly authentic spiritual quality!",
                author: "Amitab M., New Delhi",
                role: "Yantra Customer",
                rating: 5,
              },
            ].map((t, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-background-dark/80 border border-border/60 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-gold mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-gold/30 mb-2" />
                  <p className="text-xs sm:text-sm text-foreground-secondary italic leading-relaxed mb-4">
                    &quot;{t.quote}&quot;
                  </p>
                </div>
                <div className="pt-3 border-t border-border/40">
                  <h4 className="font-serif font-bold text-sm text-gold-light">{t.author}</h4>
                  <span className="text-[10px] text-foreground-muted">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Birth Chart Modal */}
      <BirthChartPreviewModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
      />
    </div>
  );
}

