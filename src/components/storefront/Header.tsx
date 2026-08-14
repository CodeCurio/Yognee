"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, Sparkles, PhoneCall, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { MAIN_BRACELET_CATEGORIES, BRACELET_SUB_CATEGORIES } from "@/lib/astrologyData";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAuth }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, profile, wishlist } = useAuth();
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

  const navItems = [
    { name: "Zodiac", slug: "zodiac" },
    { name: "Gemstones", slug: "gemstones" },
    { name: "Navgraha", slug: "navgraha" },
    { name: "Protection", slug: "protection" },
    { name: "Abundance", slug: "prosperity" },
    { name: "Chakras", slug: "chakras" },
    { name: "Rudraksha", slug: "rudraksha" },
    { name: "Consultations", slug: "consultations", isCustom: true, href: "/consultations" },
  ];

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-background-dark via-background-secondary to-background-dark text-gold-light text-[11px] sm:text-xs py-2 px-4 text-center font-medium tracking-wider uppercase flex items-center justify-center gap-2 border-b border-border/60 shadow-sm select-none">
        <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" />
        <span>100% Govt Lab Certified Gemstone & Energy Bracelets | Use Code <strong className="text-gold font-bold">COSMIC10</strong> for 10% Off</span>
        <Link href="/consultations" className="underline hover:text-white transition-colors ml-2 hidden sm:inline text-gold">
          Book Astrologer →
        </Link>
      </div>

      {/* 2. Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "h-[72px] bg-background-dark/95 backdrop-blur-md shadow-gold border-b border-border/80"
            : "h-[85px] bg-background-primary/95 backdrop-blur-sm border-b border-border/40"
        }`}
      >
        <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Trigger & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 text-foreground-primary hover:text-gold transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center gap-2 group py-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/yoginee-logo.png"
                alt="Yoginee Astrology"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Bar with Dropdowns */}
          <nav className="hidden xl:flex items-center gap-1.5 h-full">
            {navItems.map((item) => {
              const subItems = BRACELET_SUB_CATEGORIES[item.slug];
              const isHovered = activeDropdown === item.slug;

              return (
                <div
                  key={item.name}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(item.slug)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href || `/products?category=${item.slug}`}
                    className={`px-3 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-1 rounded-md ${
                      isHovered
                        ? "text-gold bg-background-card/80"
                        : "text-foreground-primary hover:text-gold"
                    }`}
                  >
                    <span>{item.name}</span>
                    {subItems && <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isHovered ? "rotate-180 text-gold" : "text-foreground-muted"}`} />}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {subItems && (
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-[80%] left-0 min-w-[260px] bg-background-dark border border-border rounded-xl p-4 shadow-gold backdrop-blur-xl z-50 glass-card"
                        >
                          <div className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2.5 pb-1.5 border-b border-border/50">
                            {item.name} Collection
                          </div>
                          <ul className="space-y-1.5 max-h-[320px] overflow-y-auto scrollbar-none">
                            {subItems.map((sub) => (
                              <li key={sub}>
                                <Link
                                  href={`/products?category=${item.slug}&tag=${encodeURIComponent(sub.split(" ")[0])}`}
                                  className="text-xs font-medium text-foreground-secondary hover:text-gold transition-colors block py-1 px-2 rounded hover:bg-background-card/60"
                                >
                                  {sub}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 pt-2 border-t border-border/40 text-center">
                            <Link
                              href={`/products?category=${item.slug}`}
                              className="text-[11px] font-bold text-gold hover:text-white uppercase tracking-wider block"
                            >
                              Explore All {item.name} →
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

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Call Consultation CTA */}
            <Link
              href="/consultations"
              className="hidden lg:flex items-center gap-1.5 bg-gold-gradient text-background-primary px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md hover:scale-105"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Consultation</span>
            </Link>

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-foreground-primary hover:text-gold transition-colors"
              aria-label="Search store"
            >
              <Search className="h-5 w-5" />
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
              className="relative p-2 text-foreground-primary hover:text-gold transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-gold text-background-dark text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            <button
              onClick={user ? () => (window.location.href = "/account") : onOpenAuth}
              className="p-2 text-foreground-primary hover:text-gold transition-colors"
              aria-label="Account"
            >
              <UserIcon className="h-5 w-5" />
            </button>

            {/* Cart Button */}
            <motion.button
              id="header-cart-button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gold-light hover:text-white transition-colors flex items-center"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={itemCount}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold-gradient text-background-dark text-[11px] font-extrabold flex items-center justify-center shadow-md"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-xs sm:max-w-sm bg-background-dark h-full p-6 flex flex-col justify-between overflow-y-auto border-r border-border"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/yoginee-logo.png" alt="Yoginee Logo" className="h-9 w-auto" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-foreground-muted hover:text-gold"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="mt-6 flex flex-col gap-3">
                  {MAIN_BRACELET_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-foreground-primary hover:text-gold transition-colors py-2 border-b border-border/40 flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gold">→</span>
                    </Link>
                  ))}
                  <Link
                    href="/consultations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-bold text-gold hover:text-white transition-colors py-2 flex items-center justify-between"
                  >
                    <span>Astrology Consultations</span>
                    <span className="text-xs">📞</span>
                  </Link>
                </nav>
              </div>

              <div className="pt-6 border-t border-border space-y-3">
                <Link
                  href="/consultations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 bg-gold-gradient text-background-primary rounded-lg font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  📞 Book Astrology Consultation
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
