"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { QuickViewModal } from "@/components/storefront/QuickViewModal";
import { YOGINEE_PRODUCTS, MAIN_BRACELET_CATEGORIES, BRACELET_SUB_CATEGORIES } from "@/lib/astrologyData";
import { Product } from "@/types";
import { X, SlidersHorizontal, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function ProductListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentTag = searchParams.get("tag") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  useEffect(() => {
    let filtered = [...YOGINEE_PRODUCTS];

    if (currentCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.slug === currentCategory || p.category_id === `cat-${currentCategory}`
      );
    }

    if (currentTag) {
      filtered = filtered.filter((p) =>
        p.tags?.some((t) => t.toLowerCase().includes(currentTag.toLowerCase())) ||
        p.title.toLowerCase().includes(currentTag.toLowerCase())
      );
    }

    filtered = filtered.filter((p) => (p.sale_price ?? p.price) <= maxPrice);

    if (currentSort === "price-low") {
      filtered.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    } else if (currentSort === "price-high") {
      filtered.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    }

    setProducts(filtered);
  }, [currentCategory, currentSort, currentTag, maxPrice]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
    setMaxPrice(10000);
  };

  const activeCategoryObj = MAIN_BRACELET_CATEGORIES.find((c) => c.slug === currentCategory);
  const subCategoriesList = currentCategory !== "all" ? BRACELET_SUB_CATEGORIES[currentCategory] : null;

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-10">
      {/* Header & Title */}
      <div className="pb-6 mb-8 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold block mb-1.5 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-gold" /> Energized Bracelet Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground-primary capitalize">
          {activeCategoryObj ? activeCategoryObj.name : "All Sacred Energy Bracelets"}
        </h1>
        <p className="text-xs sm:text-sm text-foreground-secondary mt-2 max-w-2xl leading-relaxed">
          {activeCategoryObj
            ? activeCategoryObj.description
            : "Govt. Lab Certified Gemstones, Original Nepal Rudraksha, Navgraha & Zodiac birthstone bracelets consecrated with Vedic mantras."}
        </p>
      </div>

      {/* Filter Bar & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-border/50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-background-card border border-border rounded-lg text-xs font-bold uppercase tracking-wider text-gold-light"
          >
            <SlidersHorizontal className="h-4 w-4 text-gold" /> Filter Categories
          </button>

          <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            Showing {products.length} Bracelets
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider hidden sm:inline">
            Sort By:
          </span>
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="bg-background-card border border-border rounded-lg px-3 py-2 text-xs font-bold text-gold-light focus:outline-none focus:border-gold cursor-pointer"
          >
            <option value="newest">Featured & Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Subcategory Pills Bar (if category selected) */}
      {subCategoriesList && subCategoriesList.length > 0 && (
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">
            Specific {activeCategoryObj?.name} Types:
          </span>
          <div className="flex flex-wrap gap-2">
            {subCategoriesList.map((sub) => {
              const tagValue = sub.split(" ")[0];
              const isSelected = currentTag.toLowerCase() === tagValue.toLowerCase();
              return (
                <button
                  key={sub}
                  onClick={() => updateParam("tag", isSelected ? "" : tagValue)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    isSelected
                      ? "bg-gold-gradient text-background-primary border-gold shadow-md"
                      : "bg-background-dark/80 text-foreground-secondary border-border/60 hover:border-gold/60"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {(currentCategory !== "all" || maxPrice < 10000 || currentTag) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-foreground-muted font-bold uppercase tracking-wider mr-1">
            Active Filters:
          </span>
          {currentCategory !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-background-card border border-border rounded-full text-xs font-medium text-gold-light">
              Category: {activeCategoryObj?.name || currentCategory}
              <button onClick={() => updateParam("category", "all")} className="hover:text-red-400">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          {currentTag && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-background-card border border-border rounded-full text-xs font-medium text-gold-light">
              Tag: {currentTag}
              <button onClick={() => updateParam("tag", "")} className="hover:text-red-400">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          {maxPrice < 10000 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-background-card border border-border rounded-full text-xs font-medium text-gold-light">
              Max Price: {formatCurrency(maxPrice)}
              <button onClick={() => setMaxPrice(10000)} className="hover:text-red-400">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-gold underline font-bold ml-2 hover:text-white"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main PLP Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 p-5 rounded-xl bg-background-card/70 border border-border glass-card">
          {/* Main Bracelet Categories */}
          <div>
            <h3 className="font-serif text-base font-bold text-gold-light mb-3 pb-2 border-b border-border/60">
              Bracelet Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => updateParam("category", "all")}
                  className={`w-full text-left font-medium transition-colors ${
                    currentCategory === "all" ? "text-gold font-bold" : "text-foreground-secondary hover:text-white"
                  }`}
                >
                  All Bracelets
                </button>
              </li>
              {MAIN_BRACELET_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => updateParam("category", cat.slug)}
                    className={`w-full text-left font-medium transition-colors flex items-center justify-between ${
                      currentCategory === cat.slug ? "text-gold font-bold" : "text-foreground-secondary hover:text-white"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-foreground-muted">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Slider */}
          <div>
            <h3 className="font-serif text-base font-bold text-gold-light mb-3 pb-2 border-b border-border/60">
              Max Price Limit
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
              <div className="flex justify-between text-xs font-semibold text-foreground-muted">
                <span>₹1,000</span>
                <span>Up to {formatCurrency(maxPrice)}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-background-card rounded-xl border border-border p-8 shadow-card">
              <h3 className="font-serif text-xl font-bold text-gold-light mb-2">No Bracelets Match Selected Filter</h3>
              <p className="text-xs text-foreground-muted mb-6">
                Try clearing active subcategory tags or category filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-gold-gradient text-background-primary px-6 py-2.5 rounded-lg font-bold text-xs uppercase"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function ProductListingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gold">Loading Bracelet Catalog...</div>}>
      <ProductListingContent />
    </Suspense>
  );
}
