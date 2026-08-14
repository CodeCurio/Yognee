"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Star, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useAuth();
  const inWishlist = isInWishlist(product.id);

  const primaryImage = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80";
  const secondaryImage = product.images?.[1]?.image_url || primaryImage;

  const discountPercent = calculateDiscount(product.price, product.sale_price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    addItem(product, undefined, 1, undefined, rect, primaryImage);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-xl bg-background-card/80 p-3 border border-border hover:border-gold/50 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden glass-card-hover"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
        {product.tags?.includes("Best Seller") && (
          <span className="bg-gold-gradient text-background-primary px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
            ★ BEST SELLER
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-amethyst text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <motion.button
        whileTap={{ scale: 1.2 }}
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-20 rounded-full bg-background-dark/70 backdrop-blur-md p-2 text-foreground-secondary hover:text-gold border border-border/50 shadow-md transition-colors focus:outline-none"
        aria-label="Add to Wishlist"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            inWishlist ? "fill-gold text-gold" : ""
          }`}
        />
      </motion.button>

      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-background-dark mb-3.5 border border-border/30">
        <motion.img
          src={primaryImage}
          alt={product.title}
          animate={{ scale: isHovered ? 1.06 : 1, opacity: isHovered && secondaryImage !== primaryImage ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {secondaryImage !== primaryImage && (
          <motion.img
            src={secondaryImage}
            alt={`${product.title} secondary`}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Quick View Trigger Overlay */}
        {onQuickView && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-dark/90 backdrop-blur-md text-gold-light border border-border px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-1.5 hover:border-gold transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </motion.button>
        )}

        {/* Quick Add Button Slide-up */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-2.5 left-2.5 right-2.5 z-10"
        >
          <button
            onClick={handleAddToCart}
            className="w-full bg-gold-gradient text-background-primary py-2 px-3 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg hover:scale-[1.02]"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
          </button>
        </motion.div>
      </Link>

      {/* Info Container */}
      <div className="flex-1 flex flex-col justify-between px-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block mb-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {product.category?.name || "VEDIC REMEDY"}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-sm font-bold text-foreground-primary group-hover:text-gold transition-colors line-clamp-2 leading-tight">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Rating */}
        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-sm text-gold-light">
              {formatCurrency(product.sale_price ?? product.price)}
            </span>
            {product.sale_price && (
              <span className="text-[11px] text-foreground-muted line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-gold text-xs font-bold bg-background-dark/60 px-2 py-0.5 rounded border border-border/30">
            <Star className="h-3 w-3 fill-gold" />
            <span>{product.avg_rating || "4.9"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

