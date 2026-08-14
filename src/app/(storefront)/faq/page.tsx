"use client";

import React from "react";
import { Accordion } from "@/components/ui/Accordion";

export default function FAQPage() {
  const faqItems = [
    {
      id: "faq-1",
      title: "How are AURA timepieces regulated and certified?",
      content:
        "Every mechanical movement is regulated across 5 positions in Florence by master horologists over a 200-hour testing period before receiving serial authentication.",
    },
    {
      id: "faq-2",
      title: "Where is Tuscan calfskin leather sourced?",
      content:
        "Our leather hides are vegetable-tanned in Santa Croce sull'Arno using natural chestnut tannins, guaranteeing rich patina development over decades of use.",
    },
    {
      id: "faq-3",
      title: "What is your complimentary shipping policy?",
      content:
        "We provide complimentary insured courier delivery worldwide on all orders exceeding $250. Orders placed before 2 PM EST ship the same day.",
    },
    {
      id: "faq-4",
      title: "What payment methods are supported at checkout?",
      content:
        "We support Visa, Mastercard, American Express, Apple Pay, and Razorpay UPI payments with full 256-bit SSL encryption.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
          Client Support
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground-primary">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-foreground-secondary">
          Everything you need to know about our horology, leather crafting, and courier shipping.
        </p>
      </div>

      <div className="pt-8">
        <Accordion items={faqItems} defaultOpenId="faq-1" />
      </div>
    </div>
  );
}
