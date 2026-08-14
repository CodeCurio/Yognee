"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "sale" | "new" | "success" | "warning" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  const variantStyles = {
    default: "bg-neutral-100 text-foreground-primary border-neutral-200",
    sale: "bg-destructive text-white border-transparent font-semibold uppercase tracking-wider",
    new: "bg-accent text-white border-transparent font-semibold uppercase tracking-wider animate-pulse",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium",
    warning: "bg-amber-50 text-amber-700 border-amber-200 font-medium",
    outline: "bg-transparent text-neutral-600 border-neutral-300 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] sm:text-xs rounded-full border transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
