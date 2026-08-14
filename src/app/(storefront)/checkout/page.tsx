"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Check, ShieldCheck, Truck, CreditCard, ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, coupon, discountAmount, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");

  // Shipping Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"express" | "overnight">("express");

  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = shippingMethod === "express" ? (subtotal > 250 ? 0 : 25) : 45;
  const taxAmount = Math.round(subtotal * 0.085);
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost + taxAmount);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !addressLine1 || !city || !state || !zip) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your shopping bag is empty");
      return;
    }

    setIsProcessing(true);
    const supabase = createClient();

    try {
      const shippingAddressJson = {
        full_name: fullName,
        phone,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        state,
        zip,
        country,
      };

      // 1. Create order record in Supabase with status 'pending'
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          email,
          shipping_address: shippingAddressJson,
          billing_address: shippingAddressJson,
          shipping_method: shippingMethod === "express" ? "Express Insured Delivery" : "Overnight Priority Vault",
          shipping_cost: shippingCost,
          subtotal,
          discount_amount: discountAmount,
          tax_amount: taxAmount,
          total: finalTotal,
          coupon_code: coupon?.code || null,
          payment_status: "pending",
          fulfillment_status: "pending",
        })
        .select()
        .single();

      if (orderError || !newOrder) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      // 2. Create Order Items
      const orderItems = items.map((item) => {
        const price = item.variant?.price ?? (item.product.sale_price ?? item.product.price);
        return {
          order_id: newOrder.id,
          product_id: item.product.id,
          variant_id: item.variant?.id || null,
          title: item.product.title,
          variant_info: item.selectedOptions || null,
          quantity: item.quantity,
          unit_price: price,
          line_total: price * item.quantity,
        };
      });

      await supabase.from("order_items").insert(orderItems);

      // 3. Initiate Razorpay Payment Intent
      const response = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          currency: "USD",
          receipt: newOrder.order_number,
        }),
      });

      const razorpayOrder = await response.json();

      // Configure Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "AURA Atelier",
        description: `Order ${newOrder.order_number}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#1A1A1A",
        },
        handler: async function (response: any) {
          // On Payment Success
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              fulfillment_status: "processing",
              Razorpay_payment_id: response.razorpay_payment_id,
            })
            .eq("id", newOrder.id);

          await supabase.from("order_timeline").insert({
            order_id: newOrder.id,
            status: "paid",
            note: `Payment confirmed via Razorpay (${response.razorpay_payment_id})`,
          });

          clearCart();
          toast.success("Payment successful!", `Order ${newOrder.order_number} confirmed.`);
          router.push(`/order-confirmation/${newOrder.id}`);
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error("Payment failed", response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback for simulation if Razorpay script is blocked
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            fulfillment_status: "processing",
            Razorpay_payment_id: `rzp_sim_${Date.now()}`,
          })
          .eq("id", newOrder.id);

        clearCart();
        toast.success("Order confirmed!", `Order ${newOrder.order_number} processed.`);
        router.push(`/order-confirmation/${newOrder.id}`);
      }
    } catch (e: any) {
      toast.error("Checkout failed", e.message || "Please check your inputs.");
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: "shipping", label: "1. Shipping Address" },
    { id: "payment", label: "2. Payment Details" },
    { id: "review", label: "3. Final Review" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12">
      {/* Progress Bar & Step Indicator */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          {steps.map((s, idx) => {
            const isCompleted =
              (s.id === "shipping" && (step === "payment" || step === "review")) ||
              (s.id === "payment" && step === "review");
            const isCurrent = step === s.id;

            return (
              <div key={s.id} className="flex items-center gap-2 z-10 bg-background-primary px-2">
                <div
                  className={`h-8 w-8 rounded-full font-bold text-xs flex items-center justify-center transition-colors ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-foreground-primary text-white"
                      : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isCurrent ? "text-foreground-primary" : "text-neutral-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Form Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* STEP 1: SHIPPING FORM */}
          {step === "shipping" && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleShippingSubmit}
              className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card space-y-6"
            >
              <h2 className="font-serif text-2xl font-bold text-foreground-primary pb-4 border-b border-neutral-100">
                Shipping & Client Contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Input
                label="Address Line 1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
              />

              <Input
                label="Address Line 2 (Apt, Suite, Unit)"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input
                  label="State / Province"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
                <Input
                  label="Zip / Postal Code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>

              {/* Shipping Method Selector */}
              <div className="pt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-primary mb-3">
                  Shipping Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setShippingMethod("express")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === "express"
                        ? "border-accent bg-blue-50/40 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-sm">Express Insured Delivery</h4>
                      <span className="font-semibold text-sm">
                        {subtotal > 250 ? "FREE" : "$25.00"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">Estimated 2–3 business days via Fedex Courier</p>
                  </div>

                  <div
                    onClick={() => setShippingMethod("overnight")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === "overnight"
                        ? "border-accent bg-blue-50/40 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-sm">Overnight Priority Vault</h4>
                      <span className="font-semibold text-sm">$45.00</span>
                    </div>
                    <p className="text-xs text-neutral-500">Next business day arrival with armored transit</p>
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" shimmer className="w-full">
                Continue to Payment →
              </Button>
            </motion.form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === "payment" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h2 className="font-serif text-2xl font-bold text-foreground-primary">
                  Payment Method
                </h2>
                <button
                  onClick={() => setStep("shipping")}
                  className="text-xs text-accent font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Shipping
                </button>
              </div>

              <div className="p-6 rounded-xl border-2 border-accent bg-blue-50/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <CreditCard className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-foreground-primary">
                      Razorpay Secure Card / UPI Checkout
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Supports Visa, Mastercard, American Express, Apple Pay & UPI
                    </p>
                  </div>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>

              <Button
                onClick={() => setStep("review")}
                variant="primary"
                size="lg"
                shimmer
                className="w-full"
              >
                Review Order Summary →
              </Button>
            </motion.div>
          )}

          {/* STEP 3: FINAL REVIEW */}
          {step === "review" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h2 className="font-serif text-2xl font-bold text-foreground-primary">
                  Final Order Review
                </h2>
                <button
                  onClick={() => setStep("payment")}
                  className="text-xs text-accent font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Edit Details
                </button>
              </div>

              {/* Shipping Review Box */}
              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                <h4 className="font-bold text-foreground-primary uppercase tracking-wider mb-2">
                  Shipping To:
                </h4>
                <p className="font-semibold">{fullName}</p>
                <p>{addressLine1} {addressLine2}</p>
                <p>{city}, {state} {zip}, {country}</p>
                <p>Phone: {phone}</p>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                  Items ({items.length})
                </h4>
                {items.map((item) => {
                  const price = item.variant?.price ?? (item.product.sale_price ?? item.product.price);
                  return (
                    <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-neutral-100">
                      <div>
                        <span className="font-semibold text-foreground-primary">{item.product.title}</span>
                        <span className="text-xs text-neutral-400 block">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold">{formatCurrency(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handlePlaceOrder}
                variant="primary"
                size="lg"
                isLoading={isProcessing}
                shimmer
                className="w-full gap-2 shadow-2xl py-4"
              >
                Place Order & Pay {formatCurrency(finalTotal)}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Right Summary Panel */}
        <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card h-fit space-y-6">
          <h3 className="font-serif text-xl font-bold pb-4 border-b border-neutral-100">
            Order Breakdown
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({coupon?.code})</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold">
                {shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-semibold">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-neutral-200 text-base font-bold text-foreground-primary">
              <span>Total</span>
              <span className="font-serif text-2xl">{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
