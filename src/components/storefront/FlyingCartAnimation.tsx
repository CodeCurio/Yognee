"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export const FlyingCartAnimation: React.FC = () => {
  const { flyingTarget, setFlyingTarget } = useCart();
  const [headerCartPos, setHeaderCartPos] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth - 60 : 1000,
    y: 24,
  });

  useEffect(() => {
    const updateCartPos = () => {
      const cartBtn = document.getElementById("header-cart-button");
      if (cartBtn) {
        const rect = cartBtn.getBoundingClientRect();
        setHeaderCartPos({
          x: rect.left + rect.width / 2 - 20,
          y: rect.top + rect.height / 2 - 20,
        });
      }
    };

    updateCartPos();
    window.addEventListener("resize", updateCartPos);
    return () => window.removeEventListener("resize", updateCartPos);
  }, []);

  if (!flyingTarget) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        setFlyingTarget(null);
      }}
    >
      <motion.div
        key="flying-cart-item"
        initial={{
          position: "fixed",
          top: flyingTarget.y,
          left: flyingTarget.x,
          width: flyingTarget.width,
          height: flyingTarget.height,
          scale: 1,
          rotate: 0,
          opacity: 1,
          zIndex: 9999,
          pointerEvents: "none",
        }}
        animate={{
          top: headerCartPos.y,
          left: headerCartPos.x,
          width: 40,
          height: 40,
          scale: 0.2,
          rotate: 15,
          opacity: 0.2,
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.4, 0, 0.2, 1],
        }}
        onAnimationComplete={() => {
          setFlyingTarget(null);
          // Trigger cart icon spring bounce
          const cartBtn = document.getElementById("header-cart-button");
          if (cartBtn) {
            cartBtn.classList.add("cart-bounce");
            setTimeout(() => cartBtn.classList.remove("cart-bounce"), 400);
          }
        }}
        className="rounded-lg shadow-2xl overflow-hidden border-2 border-accent bg-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={flyingTarget.imageUrl}
          alt="Adding to cart"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </AnimatePresence>
  );
};
