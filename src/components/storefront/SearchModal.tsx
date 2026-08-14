"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, History, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aura_recent_searches");
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Debounced search querying Supabase products
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const supabase = createClient();
      const searchTerm = `%${query.trim()}%`;

      const { data } = await supabase
        .from("products")
        .select("*, images:product_images(*), category:categories(*)")
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .eq("status", "active")
        .limit(6);

      setResults((data as Product[]) || []);
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
  };

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("aura_recent_searches", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      saveRecentSearch(query);
      onClose();
      window.location.href = `/products/${results[selectedIndex].slug}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          {/* Top Bar */}
          <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-6 flex items-center justify-between border-b border-neutral-100">
            <span className="font-serif text-xl font-bold text-foreground-primary">
              Search Atelier
            </span>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-foreground-primary rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="max-w-4xl w-full mx-auto px-6 pt-12 pb-6">
            <div className="relative flex items-center border-b-2 border-foreground-primary pb-4">
              <Search className="h-7 w-7 text-neutral-400 mr-4 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search timepieces, leather goods, coats, keywords..."
                className="w-full font-serif text-2xl sm:text-3xl text-foreground-primary placeholder:text-neutral-300 focus:outline-none bg-transparent"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-neutral-400 hover:text-foreground-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Results / History Container */}
          <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-6 pb-16">
            {isLoading ? (
              <div className="py-12 text-center text-sm text-neutral-400">
                Searching collection...
              </div>
            ) : query.trim() ? (
              results.length > 0 ? (
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                    Matching Products ({results.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((product, idx) => {
                      const img = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80";
                      const isSelected = idx === selectedIndex;

                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            saveRecentSearch(query);
                            onClose();
                          }}
                          className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-accent bg-blue-50/50 shadow-sm"
                              : "border-neutral-100 hover:border-neutral-300 bg-neutral-50/50"
                          }`}
                        >
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-sm font-semibold text-foreground-primary truncate">
                              {product.title}
                            </h4>
                            <p className="text-xs text-neutral-400">{product.category?.name}</p>
                            <p className="text-xs font-bold text-foreground-primary mt-1">
                              {formatCurrency(product.sale_price ?? product.price)}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-neutral-500">
                  No products found for "{query}". Try searching for "Timepiece", "Leather", or "Coat".
                </div>
              )
            ) : (
              <div className="space-y-8 pt-4">
                {recentSearches.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-3">
                      Recent Searches
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSelectSearch(term)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-xs text-foreground-primary hover:bg-neutral-200 transition-colors"
                        >
                          <History className="h-3 w-3 text-neutral-400" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-3">
                    Popular Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Timepieces", "Leather Goods", "Outerwear", "Sunglasses", "Signet Rings"].map(
                      (cat) => (
                        <button
                          key={cat}
                          onClick={() => handleSelectSearch(cat)}
                          className="px-4 py-2 rounded-lg border border-neutral-200 text-xs font-medium text-foreground-primary hover:border-foreground-primary transition-colors"
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
