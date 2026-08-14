"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, coupon, discountAmount } = useCart();

  const estimatedShipping = subtotal > 250 || subtotal === 0 ? 0 : 25;
  const estimatedTax = Math.round(subtotal * 0.085);
  const finalTotal = Math.max(0, subtotal - discountAmount + estimatedShipping + estimatedTax);

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6 text-neutral-400">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-3">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-foreground-secondary mb-8 max-w-md mx-auto">
          Explore our fine timepieces, Tuscan leather weekender duffels, and Italian cashmere outerwear.
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg" shimmer>
            Explore Collections
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12">
      <h1 className="font-serif text-4xl font-bold mb-8">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.variant?.price ?? (item.product.sale_price ?? item.product.price);
            const img = item.product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80";

            return (
              <div
                key={item.id}
                className="flex gap-6 p-4 rounded-xl border border-neutral-100 bg-white shadow-card"
              >
                <div className="w-28 h-36 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={item.product.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg font-bold text-foreground-primary">
                        {item.product.title}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {item.selectedOptions && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {Object.entries(item.selectedOptions)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" | ")}
                      </p>
                    )}

                    <p className="font-bold text-foreground-primary mt-2">
                      {formatCurrency(price)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-neutral-200 rounded bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-neutral-600 hover:bg-neutral-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-neutral-600 hover:bg-neutral-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="font-serif text-lg font-bold">
                      {formatCurrency(price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card h-fit space-y-6">
          <h2 className="font-serif text-2xl font-bold pb-4 border-b border-neutral-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount ({coupon?.code})</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold">
                {estimatedShipping === 0 ? "Complimentary" : formatCurrency(estimatedShipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8.5%)</span>
              <span className="font-semibold">{formatCurrency(estimatedTax)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-neutral-200 text-lg font-bold">
              <span>Total</span>
              <span className="font-serif text-2xl">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button variant="primary" size="lg" shimmer className="w-full gap-2 py-4">
              Proceed to Checkout <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
