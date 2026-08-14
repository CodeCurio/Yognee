"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  Globe,
  Image as ImageIcon,
  BarChart3,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user || profile?.role !== "admin") {
        // Redirect non-admin users to storefront homepage
        router.push("/");
      }
    }
  }, [user, profile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-foreground-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Authenticating Admin Session...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Products", href: "/admin/products", icon: <Package className="h-4 w-4" /> },
    { label: "Categories", href: "/admin/categories", icon: <FolderTree className="h-4 w-4" /> },
    { label: "Orders", href: "/admin/orders", icon: <ShoppingBag className="h-4 w-4" /> },
    { label: "Customers", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { label: "Coupons", href: "/admin/coupons", icon: <Tag className="h-4 w-4" /> },
    { label: "Brand Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
    { label: "SEO Center", href: "/admin/seo", icon: <Globe className="h-4 w-4" /> },
    { label: "Media Library", href: "/admin/media", icon: <ImageIcon className="h-4 w-4" /> },
    { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-foreground-primary font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between flex-shrink-0 z-20">
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <span className="font-serif text-xl font-bold text-foreground-primary">
                AURA Control
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full block w-fit mt-0.5">
                ADMIN CONSOLE
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-neutral-400 hover:text-foreground-primary p-1"
              title="View Storefront"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-foreground-primary text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-foreground-primary"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User Info */}
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {profile?.full_name?.charAt(0) || "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-foreground-primary truncate">
                  {profile?.full_name || "System Admin"}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="text-neutral-400 hover:text-destructive p-1.5 rounded"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <main className="p-8 max-w-[1440px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
