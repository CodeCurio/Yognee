"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  shimmer?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  shimmer = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none overflow-hidden";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs tracking-wider uppercase rounded-md",
    md: "px-6 py-3 text-sm tracking-wide rounded-md",
    lg: "px-8 py-4 text-base font-semibold rounded-lg",
  };

  const variantStyles = {
    primary:
      "bg-foreground-primary text-white hover:bg-neutral-800 shadow-sm border border-transparent",
    secondary:
      "bg-background-secondary text-foreground-primary hover:bg-neutral-200 border border-transparent",
    outline:
      "bg-transparent text-foreground-primary border border-neutral-300 hover:border-foreground-primary hover:bg-neutral-50",
    ghost:
      "bg-transparent text-foreground-primary hover:bg-neutral-100 border border-transparent",
    destructive:
      "bg-destructive text-white hover:bg-red-700 shadow-sm border border-transparent",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        shimmer && variant === "primary" && "bg-gradient-to-r from-neutral-900 via-accent to-neutral-900 bg-[length:200%_100%] animate-shimmer",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
