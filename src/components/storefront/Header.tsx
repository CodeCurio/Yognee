"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, Sparkles, PhoneCall, ChevronDown, Compass, Shield, Flame, Gem } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { MAIN_BRACELET_CATEGORIES, BRACELET_SUB_CATEGORIES, RASHI_LIST } from "@/lib/astrologyData";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAuth }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, wishlist } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#12001C] text-foreground-primary text-xs py-2 px-4 border-b border-gold/30 shadow-md">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2 text-gold-light font-medium text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" />
            <span>100% Govt Lab Certified Energy Bracelets & Vedic Remedies</span>
          </div>

          <div className="mx-auto md:mx-0 flex items-center gap-2 text-[11px] font-bold tracking-wider text-white">
            <span className="bg-gold/25 text-gold px-2 py-0.5 rounded border border-gold/50 text-[10px]">PROMO</span>
            <span>Use Code <strong className="text-gold">COSMIC10</strong> for 10% OFF</span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px] text-foreground-secondary">
            <Link href="/chart-calculator" className="hover:text-gold transition-colors flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-gold" /> Free Kundli Tool
            </Link>
            <span className="text-border">|</span>
            <a href="tel:+918007899644" className="hover:text-gold transition-colors flex items-center gap-1 font-semibold text-gold-light">
              <PhoneCall className="h-3.5 w-3.5 text-gold" /> +91 (800) 789-YOGI
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Refined Luxury Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#1C0028] border-b border-gold/40 shadow-[0_10px_35px_rgba(0,0,0,0.9)] py-2.5"
            : "bg-[#1F002C] border-b border-gold/25 py-3.5"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          
          {/* LEFT: Official Logo Display */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#2B003B] border border-border text-gold hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center py-1 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/yoginee-logo.png"
                alt="Yoginee Astrology"
                className="h-11 sm:h-13 lg:h-14 w-auto object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              />
            </Link>
          </div>

          {/* CENTER: Clean Spacious Nav Hubs */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            
            {/* Hub 1: Bracelet Collections Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown("collections")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/products"
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeDropdown === "collections"
                    ? "text-gold bg-[#2B003B] border border-gold/40 shadow-md"
                    : "text-foreground-primary hover:text-gold hover:bg-[#2B003B]/60"
                }`}
              >
                <span>📿 Bracelet Collections</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === "collections" ? "rotate-180 text-gold" : "text-foreground-muted"}`} />
              </Link>

              {/* 100% Solid Opaque Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === "collections" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-[320px] bg-[#1D002A] border-2 border-gold/50 rounded-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50"
                  >
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-gold pb-2 mb-2 border-b border-gold/30">
                      Explore Energy Bracelets
                    </div>
                    <ul className="space-y-1">
                      {MAIN_BRACELET_CATEGORIES.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            href={`/products?category=${cat.slug}`}
                            className="text-xs font-semibold text-foreground-primary hover:text-gold transition-colors flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#2F0042] border border-transparent hover:border-gold/20"
                          >
                            <span>{cat.name}</span>
                            <span className="text-[10px] text-gold font-bold">→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-2 border-t border-gold/30 text-center">
                      <Link
                        href="/products"
                        className="w-full inline-block py-2 bg-gold-gradient text-background-primary rounded-lg font-bold text-xs uppercase tracking-wider shadow-gold"
                      >
                        View All Bracelets →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hub 2: Zodiac Signs Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown("zodiac")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/products?category=zodiac"
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeDropdown === "zodiac"
                    ? "text-gold bg-[#2B003B] border border-gold/40 shadow-md"
                    : "text-foreground-primary hover:text-gold hover:bg-[#2B003B]/60"
                }`}
              >
                <span>🔮 Zodiac (Rashi)</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === "zodiac" ? "rotate-180 text-gold" : "text-foreground-muted"}`} />
              </Link>

              {/* 100% Solid Opaque Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === "zodiac" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[340px] bg-[#1D002A] border-2 border-gold/50 rounded-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50"
                  >
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-gold pb-2 mb-2 border-b border-gold/30">
                      12 Rashi Birthstone Bracelets
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {RASHI_LIST.map((rashi) => (
                        <Link
                          key={rashi.name}
                          href={`/products?category=zodiac&tag=${encodeURIComponent(rashi.name.split(" ")[0])}`}
                          className="text-xs font-medium text-foreground-primary hover:text-gold py-1.5 px-2 rounded hover:bg-[#2F0042] flex items-center gap-1.5"
                        >
                          <span className="text-sm">{rashi.icon}</span>
                          <span className="truncate">{rashi.name.split(" ")[0]}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hub 3: Vedic Tools & Services */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown("remedies")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeDropdown === "remedies"
                    ? "text-gold bg-[#2B003B] border border-gold/40 shadow-md"
                    : "text-foreground-primary hover:text-gold hover:bg-[#2B003B]/60"
                }`}
              >
                <span>🕉️ Vedic Tools</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === "remedies" ? "rotate-180 text-gold" : "text-foreground-muted"}`} />
              </button>

              {/* 100% Solid Opaque Dropdown Menu */}
              <AnimatePresence>
                {activeDropdown === "remedies" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-[280px] bg-[#1D002A] border-2 border-gold/50 rounded-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50"
                  >
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-gold pb-2 mb-2 border-b border-gold/30">
                      Vedic Astrology Services
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/chart-calculator"
                          className="text-xs font-semibold text-foreground-primary hover:text-gold transition-colors flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#2F0042]"
                        >
                          <span>🧭 Free Birth Chart (Kundli)</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/consultations"
                          className="text-xs font-semibold text-foreground-primary hover:text-gold transition-colors flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#2F0042]"
                        >
                          <span>📞 1-on-1 Astrologer Session</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/#zodiac-widget"
                          className="text-xs font-semibold text-foreground-primary hover:text-gold transition-colors flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#2F0042]"
                        >
                          <span>🔮 Daily Rashi Horoscope</span>
                        </Link>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hub 4: Direct Consultation Link */}
            <Link
              href="/consultations"
              className="px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider text-gold bg-gold/15 border border-gold/40 hover:bg-gold/25 transition-all flex items-center gap-1.5"
            >
              <span>📞 Consultation</span>
            </Link>
          </nav>

          {/* RIGHT: Action Icons & Gold CTA */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-lg bg-[#2B003B] border border-border text-foreground-primary hover:text-gold hover:border-gold/50 transition-all flex items-center gap-1.5"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-gold" />
              <span className="hidden xl:inline text-xs font-semibold text-foreground-muted">Search</span>
            </button>

            {/* Wishlist */}
            <Link
              href={user ? "/account?tab=wishlist" : "#"}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  onOpenAuth();
                }
              }}
              className="relative p-2.5 rounded-lg bg-[#2B003B] border border-border text-foreground-primary hover:text-gold transition-all hidden sm:flex items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4 text-foreground-secondary hover:text-gold" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-background-dark text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            <button
              onClick={user ? () => (window.location.href = "/account") : onOpenAuth}
              className="p-2.5 rounded-lg bg-[#2B003B] border border-border text-foreground-primary hover:text-gold transition-all"
              aria-label="User Account"
            >
              <UserIcon className="h-4 w-4 text-foreground-secondary hover:text-gold" />
            </button>

            {/* Cart Trigger */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-gold/20 border border-gold/50 text-gold hover:bg-gold/30 transition-all flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider">Cart</span>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={itemCount}
                  className="h-5 w-5 rounded-full bg-gold-gradient text-background-dark text-[11px] font-extrabold flex items-center justify-center shadow-gold"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Book Session CTA */}
            <Link
              href="/consultations"
              className="hidden sm:flex items-center gap-1.5 bg-gold-gradient text-background-primary px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-gold hover:scale-105 transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Book Session</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xs sm:max-w-sm bg-[#160022] h-full p-6 flex flex-col justify-between overflow-y-auto border-r border-gold/40 shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/yoginee-logo.png"
                    alt="Yoginee Logo"
                    className="h-10 w-auto object-contain"
                  />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-[#2B003B] text-foreground-muted hover:text-gold border border-border"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest px-2 block mb-2">
                    Bracelet Collections
                  </span>
                  {MAIN_BRACELET_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-foreground-primary hover:text-gold transition-colors py-2.5 px-3 rounded-lg hover:bg-[#2F0042] flex items-center justify-between border-b border-border/30"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gold font-mono">→</span>
                    </Link>
                  ))}

                  <div className="pt-4">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest px-2 block mb-2">
                      Vedic Services
                    </span>
                    <Link
                      href="/consultations"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-gold hover:text-white transition-colors py-2.5 px-3 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-between"
                    >
                      <span>📞 Book Astrologer Session</span>
                      <span className="text-xs">→</span>
                    </Link>
                    <Link
                      href="/chart-calculator"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-foreground-secondary hover:text-gold transition-colors py-2.5 px-3 rounded-lg flex items-center justify-between mt-1"
                    >
                      <span>🧭 Free Birth Chart (Kundli) Tool</span>
                      <span className="text-xs">→</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/80">
                <Link
                  href="/consultations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 bg-gold-gradient text-background-primary rounded-lg font-bold text-xs uppercase tracking-wider shadow-gold"
                >
                  📞 Speak with Astrologer Now
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
