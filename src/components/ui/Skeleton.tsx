"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] animate-shimmer rounded",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 w-3/4 rounded",
        className
      )}
      {...props}
    />
  );
};
