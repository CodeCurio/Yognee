"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    coupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const toast = useToast();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast.error("Invalid or expired coupon code");
      } else {
        if (subtotal < data.min_order_amount) {
          toast.error(
            `Coupon requires a minimum order of ${formatCurrency(data.min_order_amount)}`
          );
        } else {
          applyCoupon(data);
          toast.success(`Coupon ${data.code} applied successfully!`);
          setCouponCode("");
        }
      }
    } catch (e) {
      toast.error("Failed to validate coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const estimatedShipping = subtotal > 250 || subtotal === 0 ? 0 : 25;
  const estimatedTax = Math.round(subtotal * 0.085);
  const finalTotal = Math.max(0, subtotal - discountAmount + estimatedShipping + estimatedTax);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-foreground-primary" />
                <h2 className="font-serif text-xl font-bold text-foreground-primary">
                  Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-neutral-400 hover:text-foreground-primary rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6 text-neutral-400">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground-primary mb-2">
                  Your bag is empty
                </h3>
                <p className="text-sm text-foreground-secondary mb-8 max-w-xs">
                  Discover our curated luxury timepieces, leather goods, and cashmere coats.
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  variant="primary"
                  shimmer
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05 },
                      },
                    }}
                    className="space-y-4"
                  >
                    <AnimatePresence mode="popLayout">
                      {items.map((item) => {
                        const price = item.variant?.price ?? (item.product.sale_price ?? item.product.price);
                        const img = item.product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80";

                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="flex gap-4 p-3 rounded-lg border border-neutral-100 bg-neutral-50/50"
                          >
                            {/* Product Image */}
                            <div className="w-20 h-24 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-serif text-sm font-semibold text-foreground-primary line-clamp-1">
                                    {item.product.title}
                                  </h4>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-neutral-400 hover:text-destructive transition-colors p-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>

                                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                  <p className="text-xs text-neutral-500 mt-0.5">
                                    {Object.entries(item.selectedOptions)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(" | ")}
                                  </p>
                                )}
                                <p className="text-sm font-semibold text-foreground-primary mt-1">
                                  {formatCurrency(price)}
                                </p>
                              </div>

                              {/* Quantity adjuster */}
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center border border-neutral-200 rounded bg-white">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 text-neutral-600 hover:bg-neutral-100"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="px-3 text-xs font-semibold text-foreground-primary">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 text-neutral-600 hover:bg-neutral-100"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <span className="text-xs text-neutral-400 font-medium ml-auto">
                                  Total: {formatCurrency(price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Footer / Summary */}
                <div className="p-6 border-t border-neutral-100 bg-white space-y-4">
                  {/* Coupon Input */}
                  {coupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-2.5 rounded-md text-xs font-medium border border-emerald-200">
                      <div className="flex items-center gap-1.5">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span>Code <strong>{coupon.code}</strong> applied (-{formatCurrency(discountAmount)})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-emerald-600 underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Promo or Coupon Code"
                        className="flex-1 px-3 py-2 text-xs border border-neutral-200 rounded-md uppercase tracking-wider focus:outline-none focus:border-accent"
                      />
                      <button
                        type="submit"
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-foreground-secondary pt-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground-primary">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-semibold text-foreground-primary">
                        {estimatedShipping === 0 ? "Complimentary" : formatCurrency(estimatedShipping)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span className="font-semibold text-foreground-primary">
                        {formatCurrency(estimatedTax)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200 text-base font-bold text-foreground-primary">
                      <span>Total</span>
                      <span className="font-serif text-xl">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="block"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      shimmer
                      className="w-full gap-2 shadow-lg"
                    >
                      Proceed to Checkout <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
