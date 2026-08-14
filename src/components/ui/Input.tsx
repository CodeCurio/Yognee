"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, value, onChange, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const hasValue = value !== undefined && value !== null && value !== "";

    const isFloating = focused || hasValue;

    return (
      <div className="relative w-full">
        <div className="relative flex flex-col">
          <input
            id={inputId}
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            className={cn(
              "peer w-full rounded-md border bg-white px-4 pb-2.5 pt-6 text-sm text-foreground-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 placeholder-transparent",
              error
                ? "border-destructive text-destructive focus:ring-destructive"
                : "border-neutral-200 hover:border-neutral-400 focus:border-accent",
              className
            )}
            placeholder={label}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-4 transition-all duration-200 ease-out select-none",
              isFloating
                ? "top-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500"
                : "top-4 text-sm text-neutral-400"
            )}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="mt-1 text-xs text-destructive font-medium pl-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
