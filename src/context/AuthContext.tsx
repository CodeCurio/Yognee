"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfileAndWishlist = async (userId: string) => {
    try {
      // Fetch Profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (prof) {
        setProfile(prof as Profile);
      } else {
        // Fallback demo profile if missing
        setProfile({
          id: userId,
          email: user?.email || "customer@example.com",
          full_name: "Valued Customer",
          phone: null,
          avatar_url: null,
          role: "customer",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Fetch Wishlist
      const { data: wishData } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", userId);

      if (wishData) {
        setWishlist(wishData.map((w) => w.product_id));
      }
    } catch (e) {
      console.error("Error fetching user profile", e);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchProfileAndWishlist(currentSession.user.id);
      }
      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchProfileAndWishlist(newSession.user.id);
        } else {
          setProfile(null);
          setWishlist([]);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfileAndWishlist(user.id);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      // Fallback local wishlist for unauthenticated visitors
      setWishlist((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
      return;
    }

    const inWish = wishlist.includes(productId);
    if (inWish) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId);
    } else {
      setWishlist((prev) => [...prev, productId]);
      await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId });
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setWishlist([]);
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAdmin,
        wishlist,
        toggleWishlist,
        isInWishlist,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
