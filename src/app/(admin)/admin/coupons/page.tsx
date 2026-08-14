"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Coupon } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { Plus, Tag, Trash2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("100");
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    if (data) setCoupons(data as Coupon[]);
    setIsLoading(false);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) return;

    setIsSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("coupons").insert({
        code: code.trim().toUpperCase(),
        type,
        value: parseFloat(value),
        min_order_amount: parseFloat(minOrder) || 0,
        is_active: true,
      });

      if (error) throw error;

      toast.success(`Coupon ${code.toUpperCase()} created!`);
      setIsModalOpen(false);
      setCode("");
      setValue("");
      fetchCoupons();
    } catch (e: any) {
      toast.error("Failed to create coupon", e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Delete coupon "${couponCode}"?`)) return;
    const supabase = createClient();
    await supabase.from("coupons").delete().eq("id", id);
    toast.success(`Coupon ${couponCode} deleted.`);
    fetchCoupons();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            Promotional Coupons & Vault Codes
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Create percentage discounts, fixed reductions, and client incentive offers.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="primary" shimmer className="gap-2">
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
            <tr>
              <th className="py-3.5 px-4">Coupon Code</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Discount Value</th>
              <th className="py-3.5 px-4">Min Order Amount</th>
              <th className="py-3.5 px-4">Times Used</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400">Loading coupons...</td>
              </tr>
            ) : coupons.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-foreground-primary tracking-wider">
                  {c.code}
                </td>
                <td className="py-3 px-4 uppercase">{c.type}</td>
                <td className="py-3 px-4 font-bold">
                  {c.type === "percentage" ? `${c.value}%` : formatCurrency(c.value)}
                </td>
                <td className="py-3 px-4">{formatCurrency(c.min_order_amount)}</td>
                <td className="py-3 px-4 font-bold text-accent">{c.times_used} times</td>
                <td className="py-3 px-4">
                  <Badge variant={c.is_active ? "success" : "outline"}>
                    {c.is_active ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => handleDelete(c.id, c.code)} className="text-neutral-400 hover:text-destructive p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Vault Coupon">
        <form onSubmit={handleSaveCoupon} className="space-y-4 pt-2">
          <Input label="Coupon Code (e.g. WELCOME10)" value={code} onChange={(e) => setCode(e.target.value)} required />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              Discount Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-white border border-neutral-200 rounded p-2.5 text-xs font-bold"
            >
              <option value="percentage">Percentage Discount (%)</option>
              <option value="fixed">Fixed Dollar Discount ($)</option>
            </select>
          </div>
          <Input label="Discount Value" type="number" value={value} onChange={(e) => setValue(e.target.value)} required />
          <Input label="Minimum Order Subtotal ($)" type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} required />

          <Button type="submit" variant="primary" isLoading={isSaving} className="w-full">
            Save Coupon
          </Button>
        </form>
      </Modal>
    </div>
  );
}
