"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Order } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowRight, Package, Truck } from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    const fetchOrder = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("id", orderId)
        .single();

      if (data) setOrder(data as Order);
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-4">
        <Skeleton className="h-20 w-20 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-12">
      {/* Animated Checkmark Path Draw */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-xl"
        >
          <svg className="w-12 h-12 stroke-current" viewBox="0 0 52 52" fill="none">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27l7 7 16-16"
            />
          </svg>
        </motion.div>
      </div>

      {/* Headline & Order Number */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 block mb-2">
          Order Payment Verified
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground-primary">
          Thank You For Your Patronage
        </h1>
        <p className="text-sm text-foreground-secondary mt-3">
          Order Identifier: <strong className="text-foreground-primary">{order?.order_number || orderId}</strong>
        </p>
      </div>

      {/* Estimated Delivery Box */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card text-left space-y-4 max-w-xl mx-auto">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
          <div className="p-3 bg-neutral-100 rounded-lg text-accent">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base">Estimated Delivery</h4>
            <p className="text-xs text-neutral-500">2–3 Business Days via Fedex Insured Express</p>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Ordered Items
          </h4>
          {order?.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground-primary">{item.title} (x{item.quantity})</span>
              <span className="font-bold">{formatCurrency(item.line_total)}</span>
            </div>
          ))}

          <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-sm font-bold">
            <span>Total Paid</span>
            <span className="font-serif text-xl">{formatCurrency(order?.total || 0)}</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link href="/account">
          <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
            <Package className="h-4 w-4" /> Track Order in Account
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="primary" size="lg" shimmer className="w-full sm:w-auto gap-2">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
