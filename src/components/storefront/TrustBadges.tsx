"use client";

import React from "react";
import { ShieldCheck, Award, Lock, Sparkles, Gem, RefreshCw } from "lucide-react";

export const TrustBadges: React.FC = () => {
  const badges = [
    { icon: <ShieldCheck className="h-5 w-5 text-accent" />, label: "Certified Authenticity" },
    { icon: <Award className="h-5 w-5 text-accent" />, label: "Master Craftsman Guarantee" },
    { icon: <Lock className="h-5 w-5 text-accent" />, label: "256-Bit Encrypted Payments" },
    { icon: <Sparkles className="h-5 w-5 text-accent" />, label: "Grade 5 Titanium & Pure Silk" },
    { icon: <Gem className="h-5 w-5 text-accent" />, label: "Hand-Assembly in Florence" },
    { icon: <RefreshCw className="h-5 w-5 text-accent" />, label: "30-Day Bespoke Returns" },
  ];

  const duplicatedBadges = [...badges, ...badges, ...badges];

  return (
    <div className="w-full bg-neutral-900 text-white py-6 overflow-hidden border-y border-neutral-800 select-none">
      <div className="flex w-[200%] animate-marquee">
        {duplicatedBadges.map((badge, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-8 text-xs font-semibold uppercase tracking-widest text-neutral-300 flex-shrink-0"
          >
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
