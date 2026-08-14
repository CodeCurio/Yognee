"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Order, Product } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [isLoading, setIsLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    totalRevenue: 48920,
    totalOrders: 142,
    totalCustomers: 98,
    avgOrderValue: 344.5,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  const revenueData = [
    { date: "Day 1", revenue: 2400 },
    { date: "Day 5", revenue: 4100 },
    { date: "Day 10", revenue: 3800 },
    { date: "Day 15", revenue: 6200 },
    { date: "Day 20", revenue: 8900 },
    { date: "Day 25", revenue: 11400 },
    { date: "Day 30", revenue: 14200 },
  ];

  const topProductsData = [
    { name: "Chronograph No. 01", sales: 42 },
    { name: "Tuscan Weekender", sales: 34 },
    { name: "Cashmere Overcoat", sales: 28 },
    { name: "Titanium Aviator", sales: 22 },
    { name: "Skeleton Watch", sales: 16 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();
      setIsLoading(true);

      // Fetch Recent Orders
      const { data: ordData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (ordData) setRecentOrders(ordData as Order[]);

      // Fetch Low Stock Products
      const { data: stockData } = await supabase
        .from("products")
        .select("*")
        .lte("stock_quantity", 10)
        .limit(5);

      if (stockData) setLowStockProducts(stockData as Product[]);

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            Executive Performance Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time telemetry on revenue, customer metrics, and supply operations.
          </p>
        </div>

        {/* Time Range Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-neutral-200 shadow-sm">
          {(["7d", "30d", "90d", "1y"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all ${
                timeRange === r
                  ? "bg-foreground-primary text-white shadow"
                  : "text-neutral-500 hover:text-foreground-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 bg-blue-50 text-accent rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold text-foreground-primary">
            {formatCurrency(metrics.totalRevenue)}
          </h3>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="h-4 w-4" /> +18.4% vs last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-blue-50 text-accent rounded-lg">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold text-foreground-primary">
            {metrics.totalOrders}
          </h3>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="h-4 w-4" /> +12.1% vs last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Customers</span>
            <div className="p-2 bg-blue-50 text-accent rounded-lg">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold text-foreground-primary">
            {metrics.totalCustomers}
          </h3>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="h-4 w-4" /> +8.6% vs last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Order Value</span>
            <div className="p-2 bg-blue-50 text-accent rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold text-foreground-primary">
            {formatCurrency(metrics.avgOrderValue)}
          </h3>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <ArrowUpRight className="h-4 w-4" /> +5.2% vs last period
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold text-foreground-primary">
            Revenue Performance Over Time ({timeRange.toUpperCase()})
          </h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold text-foreground-primary">
            Top 5 Products (Units Sold)
          </h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="sales" fill="#1A1A1A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-foreground-primary">
              Recent Customer Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-accent hover:underline uppercase tracking-wider"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground-primary">
                      <Link href={`/admin/orders/${ord.id}`} className="hover:text-accent">
                        {ord.order_number}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{ord.email}</td>
                    <td className="py-3 px-4 font-bold">{formatCurrency(ord.total)}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          ord.fulfillment_status === "delivered"
                            ? "success"
                            : ord.fulfillment_status === "shipped"
                            ? "new"
                            : "outline"
                        }
                      >
                        {ord.fulfillment_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">{formatDate(ord.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-serif text-lg font-bold text-foreground-primary">
              Low Stock Alerts
            </h3>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/40 text-xs"
              >
                <div>
                  <h4 className="font-bold text-foreground-primary">{prod.title}</h4>
                  <p className="text-neutral-500">SKU: {prod.sku}</p>
                </div>
                <span className="font-bold text-destructive bg-white px-2 py-1 rounded border border-red-200">
                  {prod.stock_quantity} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
