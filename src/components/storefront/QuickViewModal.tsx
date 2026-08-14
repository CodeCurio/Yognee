"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();

  if (!product) return null;

  const primaryImage = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80";
  const discountPercent = calculateDiscount(product.price, product.sale_price);

  const handleAddToCart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    addItem(product, undefined, quantity, undefined, rect, primaryImage);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2 bg-background-dark text-foreground-primary">
        {/* Left: Image */}
        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-background-card border border-border relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Info & Controls */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> {product.category?.name || "AUTHENTIC VEDIC REMEDY"}
            </span>
            <h2 className="font-serif text-2xl font-bold text-foreground-primary mb-3">
              {product.title}
            </h2>

            {/* Price & Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-2xl text-gold-light">
                  {formatCurrency(product.sale_price ?? product.price)}
                </span>
                {product.sale_price && (
                  <span className="text-sm text-foreground-muted line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-white bg-amethyst px-2.5 py-0.5 rounded-full">
                  -{discountPercent}% OFF
                </span>
              )}
              <div className="flex items-center gap-1 text-gold text-xs font-bold ml-auto bg-background-card px-2.5 py-1 rounded border border-border">
                <Star className="h-3.5 w-3.5 fill-gold" />
                <span>{product.avg_rating || "4.9"} ({product.review_count || 18})</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed mb-6 line-clamp-3">
              {product.description || "Consecrated and lab certified for planetary alignment and spiritual protection."}
            </p>

            <div className="space-y-2 mb-6 text-xs text-gold-light bg-background-card/60 p-3 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" />
                <span>100% Original Govt Approved Lab Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span>Pran-Pratishtha Energization Puja Included</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-light mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-border rounded-lg bg-background-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-foreground-secondary hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-gold-light">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-foreground-secondary hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gold-gradient text-background-primary py-3 rounded-lg font-extrabold text-xs uppercase tracking-wider shadow-gold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs font-semibold uppercase tracking-widest text-foreground-muted hover:text-gold transition-colors flex items-center justify-center gap-1"
            >
              View Full Item Details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

