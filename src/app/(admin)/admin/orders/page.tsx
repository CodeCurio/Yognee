"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, Download, Eye, Filter } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });

    if (data) setOrders(data as Order[]);
    setIsLoading(false);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = "Order Number,Customer Email,Total,Payment Status,Fulfillment Status,Date\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.order_number}","${o.email}",${o.total},"${o.payment_status}","${o.fulfillment_status}","${o.created_at}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AURA_Orders_Export_${Date.now()}.csv`;
    a.click();
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.fulfillment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            Order Fulfillment & Logistics
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track order lifecycle, update shipping tracking numbers, and process invoices.
          </p>
        </div>

        <Button onClick={handleExportCSV} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV Report
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or email..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 rounded-md focus:outline-none focus:border-accent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-neutral-200 rounded-md px-3 py-2 text-xs font-semibold text-foreground-primary focus:outline-none focus:border-accent"
        >
          <option value="all">All Fulfillment Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
            <tr>
              <th className="py-3.5 px-4">Order #</th>
              <th className="py-3.5 px-4">Customer Email</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Fulfillment</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400">Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground-primary">
                    <Link href={`/admin/orders/${ord.id}`} className="hover:text-accent">
                      {ord.order_number}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{ord.email}</td>
                  <td className="py-3 px-4 font-bold">{formatCurrency(ord.total)}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${ord.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                      {ord.payment_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={ord.fulfillment_status === "delivered" ? "success" : ord.fulfillment_status === "shipped" ? "new" : "outline"}>
                      {ord.fulfillment_status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">{formatDate(ord.created_at)}</td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/admin/orders/${ord.id}`} className="inline-block bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded font-semibold text-neutral-700">
                      Manage Order
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
