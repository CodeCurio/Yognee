"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product, ProductVariant, Coupon } from "@/types";

export interface FlyingTarget {
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number,
    selectedOptions?: Record<string, string>,
    rect?: DOMRect | null,
    imageUrl?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  itemCount: number;
  flyingTarget: FlyingTarget | null;
  setFlyingTarget: (target: FlyingTarget | null) => void;
  coupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [flyingTarget, setFlyingTarget] = useState<FlyingTarget | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("aura_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem("aura_coupon");
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("aura_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (coupon) {
        localStorage.setItem("aura_coupon", JSON.stringify(coupon));
      } else {
        localStorage.removeItem("aura_coupon");
      }
    } catch (e) {
      console.error("Failed to save coupon to localStorage", e);
    }
  }, [coupon, isInitialized]);

  const addItem = (
    product: Product,
    variant?: ProductVariant,
    quantity: number = 1,
    selectedOptions?: Record<string, string>,
    rect?: DOMRect | null,
    imageUrl?: string
  ) => {
    const itemId = variant ? `${product.id}-${variant.id}` : product.id;
    const itemPrice = variant?.price ?? (product.sale_price ?? product.price);

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === itemId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: itemId,
            product,
            variant,
            quantity,
            selectedOptions,
          },
        ];
      }
    });

    // Trigger Flying Animation if element rect provided
    if (rect) {
      const img = imageUrl || product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80";
      setFlyingTarget({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        imageUrl: img,
      });
    }

    // Open Cart Drawer after short delay
    setTimeout(() => {
      setIsCartOpen(true);
    }, 600);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price ?? (item.product.sale_price ?? item.product.price);
    return acc + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  let discountAmount = 0;
  if (coupon && subtotal >= coupon.min_order_amount) {
    if (coupon.type === "percentage") {
      discountAmount = (subtotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }
  }

  const applyCoupon = (c: Coupon) => setCoupon(c);
  const removeCoupon = () => setCoupon(null);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        itemCount,
        flyingTarget,
        setFlyingTarget,
        coupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
