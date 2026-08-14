"use client";

import React from "react";

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
        Client Guarantee
      </span>
      <h1 className="font-serif text-4xl font-bold text-foreground-primary">
        30-Day Bespoke Returns & Exchanges
      </h1>
      <div className="space-y-4 text-sm text-foreground-secondary leading-relaxed pt-4">
        <p>
          We provide a complimentary 30-day trial period for all unworn timepieces and pristine leather goods. Every order includes a pre-paid insured return shipping label inside the presentation box.
        </p>
        <h3 className="font-serif text-xl font-bold text-foreground-primary pt-4">
          Return Instructions
        </h3>
        <p>
          To initiate a return or exchange, access your Account Dashboard or contact concierge@aura-atelier.com. Refunds are credited back to your original payment method within 3 business days of item inspection.
        </p>
      </div>
    </div>
  );
}
