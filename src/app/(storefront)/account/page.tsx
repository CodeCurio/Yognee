"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Order, Address, Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ProductCard } from "@/components/storefront/ProductCard";
import { User, Package, MapPin, Heart, LogOut, ShieldCheck, Plus, Trash2 } from "lucide-react";

function AccountDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const { user, profile, signOut, wishlist, refreshProfile } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "wishlist" | "profile">(
    initialTab as any
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");

  // Profile Edit State
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
    };

    const fetchAddresses = async () => {
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setAddresses(data as Address[]);
    };

    fetchOrders();
    fetchAddresses();
  }, [user]);

  useEffect(() => {
    if (wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }
    const fetchWishlistProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, images:product_images(*)")
        .in("id", wishlist);
      if (data) setWishlistProducts(data as Product[]);
    };
    fetchWishlistProducts();
  }, [wishlist]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const supabase = createClient();

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        full_name: addrName,
        phone: addrPhone,
        address_line1: addrLine1,
        city: addrCity,
        state: addrState,
        zip: addrZip,
        country: "United States",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add address");
    } else {
      toast.success("Address saved!");
      setAddresses([data as Address, ...addresses]);
      setAddressModalOpen(false);
      setAddrName("");
      setAddrLine1("");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const supabase = createClient();
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully!");
      refreshProfile();
    }
    setIsSavingProfile(false);
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Account Access Required</h1>
        <p className="text-sm text-neutral-500 mb-8">
          Please sign in to view your order history, saved addresses, and wishlist.
        </p>
        <Link href="/">
          <Button variant="primary">Return to Storefront</Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge variant="success">Delivered</Badge>;
      case "shipped":
        return <Badge variant="new">Shipped</Badge>;
      case "processing":
        return <Badge variant="warning">Processing</Badge>;
      case "cancelled":
        return <Badge variant="sale">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12 space-y-8">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block mb-1">
            Private Client Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground-primary">
            Welcome, {profile?.full_name || user.email}
          </h1>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-destructive transition-colors w-fit"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      {/* Main Grid: Sidebar Tabs + Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav Tabs */}
        <aside className="space-y-1">
          {[
            { id: "orders", label: "Order History", icon: <Package className="h-4 w-4" /> },
            { id: "addresses", label: "Address Book", icon: <MapPin className="h-4 w-4" /> },
            { id: "wishlist", label: "Wishlist", icon: <Heart className="h-4 w-4" /> },
            { id: "profile", label: "Profile Settings", icon: <User className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all text-left ${
                activeTab === tab.id
                  ? "bg-foreground-primary text-white shadow-md"
                  : "bg-white text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3">
          {/* TAB 1: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-foreground-primary">
                Recent Orders ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-xl text-center border border-neutral-100">
                  <p className="text-sm text-neutral-500 mb-4">You have not placed any orders yet.</p>
                  <Link href="/products">
                    <Button variant="primary">Explore Masterpieces</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card hover:border-accent transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-serif text-lg font-bold text-foreground-primary">
                            {ord.order_number}
                          </span>
                          {getStatusBadge(ord.fulfillment_status)}
                        </div>
                        <p className="text-xs text-neutral-400">
                          Placed on {formatDate(ord.created_at)} • {ord.items?.length || 0} Items
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="font-serif text-xl font-bold text-foreground-primary">
                          {formatCurrency(ord.total)}
                        </span>
                        <Button variant="outline" size="sm">
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-2xl font-bold text-foreground-primary">
                  Address Book
                </h2>
                <Button
                  onClick={() => setAddressModalOpen(true)}
                  variant="primary"
                  size="sm"
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Address
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card relative">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-destructive p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <h4 className="font-bold text-sm text-foreground-primary mb-1">{addr.full_name}</h4>
                    <p className="text-xs text-neutral-600">{addr.address_line1}</p>
                    <p className="text-xs text-neutral-600">{addr.city}, {addr.state} {addr.zip}</p>
                    <p className="text-xs text-neutral-500 mt-2">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-foreground-primary">
                Saved Wishlist ({wishlistProducts.length})
              </h2>

              {wishlistProducts.length === 0 ? (
                <div className="bg-white p-12 rounded-xl text-center border border-neutral-100">
                  <p className="text-sm text-neutral-500 mb-4">Your saved wishlist is empty.</p>
                  <Link href="/products">
                    <Button variant="primary">Discover Collections</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlistProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card max-w-xl">
              <h2 className="font-serif text-2xl font-bold text-foreground-primary mb-6">
                Client Profile Settings
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Button type="submit" variant="primary" isLoading={isSavingProfile}>
                  Save Changes
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal isOpen={addressModalOpen} onClose={() => setAddressModalOpen(false)} title="Add Saved Address">
        <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
          <Input label="Full Name" value={addrName} onChange={(e) => setAddrName(e.target.value)} required />
          <Input label="Phone" value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} required />
          <Input label="Street Address" value={addrLine1} onChange={(e) => setAddrLine1(e.target.value)} required />
          <div className="grid grid-cols-3 gap-2">
            <Input label="City" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} required />
            <Input label="State" value={addrState} onChange={(e) => setAddrState(e.target.value)} required />
            <Input label="Zip" value={addrZip} onChange={(e) => setAddrZip(e.target.value)} required />
          </div>
          <Button type="submit" variant="primary" className="w-full">Save Address</Button>
        </form>
      </Modal>

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order Receipt #${selectedOrder.order_number}`} maxWidth="xl">
          <div className="space-y-6 pt-2">
            <div className="flex justify-between items-center text-xs pb-4 border-b border-neutral-100">
              <div>
                <p>Status: <strong>{selectedOrder.fulfillment_status}</strong></p>
                <p>Payment: <strong>{selectedOrder.payment_status}</strong></p>
              </div>
              <span className="font-serif text-2xl font-bold">{formatCurrency(selectedOrder.total)}</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400">Order Items</h4>
              {selectedOrder.items?.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span>{i.title} (x{i.quantity})</span>
                  <span className="font-semibold">{formatCurrency(i.line_total)}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading Account...</div>}>
      <AccountDashboardContent />
    </Suspense>
  );
}
