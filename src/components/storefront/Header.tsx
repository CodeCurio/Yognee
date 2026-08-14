"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, Sparkles, PhoneCall, ChevronDown, Compass, Shield, Flame, Gem } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { MAIN_BRACELET_CATEGORIES, BRACELET_SUB_CATEGORIES } from "@/lib/astrologyData";

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

  const navLinks = [
    { name: "Gemstones", slug: "gemstones", icon: "💎" },
    { name: "Zodiac", slug: "zodiac", icon: "♈" },
    { name: "Navgraha", slug: "navgraha", icon: "🪐" },
    { name: "Protection", slug: "protection", icon: "🧿" },
    { name: "Abundance", slug: "prosperity", icon: "💰" },
    { name: "Rudraksha", slug: "rudraksha", icon: "🕉️" },
    { name: "Chakras", slug: "chakras", icon: "🌈" },
    { name: "Consultations", slug: "consultations", href: "/consultations", icon: "📞", isHighlight: true },
  ];

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#14001F] via-[#2B003B] to-[#14001F] text-foreground-primary text-xs py-2 px-4 border-b border-gold/30 shadow-md">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-2 text-gold-light font-medium text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" />
            <span>100% Certified Natural Energy Bracelets & Vedic Remedies</span>
          </div>

          <div className="mx-auto md:mx-0 flex items-center gap-2 text-[11px] font-bold tracking-wider text-white">
            <span className="bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/40">PROMO</span>
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

      {/* 2. Main Luxury Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#1A0027]/95 backdrop-blur-md border-b border-gold/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3"
            : "bg-[#1F002C]/90 backdrop-blur-sm border-b border-gold/20 py-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-6">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2.5 rounded-lg bg-background-card/80 border border-border text-gold hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Main Brand Logo - High Resolution Display */}
            <Link href="/" className="flex items-center group py-1">
              <div className="relative flex items-center">
                {/* Logo Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/yoginee-logo.png"
                  alt="Yoginee Astrology & Spiritual Products"
                  className="h-12 sm:h-14 lg:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links with Hover Mega-Menus */}
          <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const subItems = BRACELET_SUB_CATEGORIES[item.slug];
              const isHovered = activeDropdown === item.slug;

              return (
                <div
                  key={item.name}
                  className="relative py-2"
                  onMouseEnter={() => setActiveDropdown(item.slug)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href || `/products?category=${item.slug}`}
                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                      item.isHighlight
                        ? "text-gold bg-gold/15 border border-gold/40 hover:bg-gold/25"
                        : isHovered
                        ? "text-gold bg-background-card/90 border border-gold/30 shadow-md"
                        : "text-foreground-primary hover:text-gold hover:bg-background-card/40"
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.name}</span>
                    {subItems && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isHovered ? "rotate-180 text-gold" : "text-foreground-muted"
                        }`}
                      />
                    )}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {subItems && (
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 min-w-[280px] bg-[#170024] border border-gold/40 rounded-xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 glass-card"
                        >
                          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border/80">
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold flex items-center gap-1.5">
                              <Sparkles className="h-3 w-3 text-gold" /> {item.name} Bracelets
                            </span>
                            <span className="text-[10px] text-foreground-muted font-mono">{subItems.length} items</span>
                          </div>

                          <ul className="space-y-1 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                            {subItems.map((sub) => (
                              <li key={sub}>
                                <Link
                                  href={`/products?category=${item.slug}&tag=${encodeURIComponent(sub.split(" ")[0])}`}
                                  className="text-xs font-medium text-foreground-secondary hover:text-gold transition-colors flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-background-card/90 group/sub"
                                >
                                  <span>{sub}</span>
                                  <span className="text-[10px] text-gold/0 group-hover/sub:text-gold transition-all">→</span>
                                </Link>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-4 pt-3 border-t border-border/60 text-center">
                            <Link
                              href={`/products?category=${item.slug}`}
                              className="w-full inline-block py-2 bg-gold-gradient text-background-primary rounded-lg font-bold text-[11px] uppercase tracking-wider shadow-gold hover:scale-[1.02] transition-transform"
                            >
                              View All {item.name} Collection →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons & Consultation CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-lg bg-background-card/60 border border-border/80 text-foreground-primary hover:text-gold hover:border-gold/50 transition-all flex items-center gap-2 group"
              aria-label="Search Store"
            >
              <Search className="h-4 w-4 text-gold group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-xs text-foreground-muted group-hover:text-foreground-primary">Search...</span>
            </button>

            {/* Wishlist Button */}
            <Link
              href={user ? "/account?tab=wishlist" : "#"}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  onOpenAuth();
                }
              }}
              className="relative p-2.5 rounded-lg bg-background-card/60 border border-border/80 text-foreground-primary hover:text-gold hover:border-gold/50 transition-all hidden sm:flex items-center justify-center"
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
              className="p-2.5 rounded-lg bg-background-card/60 border border-border/80 text-foreground-primary hover:text-gold hover:border-gold/50 transition-all"
              aria-label="User Account"
            >
              <UserIcon className="h-4 w-4 text-foreground-secondary hover:text-gold" />
            </button>

            {/* Cart Drawer Trigger */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 transition-all flex items-center gap-2"
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

            {/* Direct Consultation Gold CTA */}
            <Link
              href="/consultations"
              className="hidden lg:flex items-center gap-2 bg-gold-gradient text-background-primary px-4 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-gold hover:scale-105 transition-all ml-1"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Book Session</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
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
                    className="p-2 rounded-lg bg-background-card text-foreground-muted hover:text-gold border border-border"
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
                      className="text-sm font-bold text-foreground-primary hover:text-gold transition-colors py-2.5 px-3 rounded-lg hover:bg-background-card/80 flex items-center justify-between border-b border-border/30"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gold font-mono">→</span>
                    </Link>
                  ))}

                  <div className="pt-4">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest px-2 block mb-2">
                      Astrology Tools & Services
                    </span>
                    <Link
                      href="/consultations"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-gold hover:text-white transition-colors py-2.5 px-3 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-between"
                    >
                      <span>📞 Book Astrologer Consultation</span>
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

              <div className="pt-6 border-t border-border/80 space-y-3">
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
