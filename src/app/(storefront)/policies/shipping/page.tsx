"use client";

import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
        Client Concierge Policy
      </span>
      <h1 className="font-serif text-4xl font-bold text-foreground-primary">
        Complimentary Express Shipping & Delivery
      </h1>
      <div className="space-y-4 text-sm text-foreground-secondary leading-relaxed pt-4">
        <p>
          AURA Atelier delivers all order shipments via insured private express transit. All timepieces, Tuscan leather goods, and cashmere outerwear are housed in signature archival black box presentation packaging with serial certificates.
        </p>
        <h3 className="font-serif text-xl font-bold text-foreground-primary pt-4">
          Estimated Delivery Windows
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Complimentary Express Delivery:</strong> 2–3 business days on orders over $250.</li>
          <li><strong>Overnight Priority Vault Shipping:</strong> Next business day delivery with armored courier tracking ($45.00).</li>
        </ul>
      </div>
    </div>
  );
}
