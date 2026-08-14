"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminAnalyticsPage() {
  const revenueData = [
    { month: "Jan", revenue: 14200, orders: 42 },
    { month: "Feb", revenue: 18500, orders: 56 },
    { month: "Mar", revenue: 22400, orders: 68 },
    { month: "Apr", revenue: 28900, orders: 84 },
    { month: "May", revenue: 34100, orders: 99 },
    { month: "Jun", revenue: 48920, orders: 142 },
  ];

  const categoryShare = [
    { name: "Timepieces", value: 45, color: "#1A1A1A" },
    { name: "Leather Goods", value: 30, color: "#2563EB" },
    { name: "Apparel & Coats", value: 15, color: "#4B5563" },
    { name: "Eyewear", value: 10, color: "#9CA3AF" },
  ];

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-neutral-200">
        <h1 className="font-serif text-3xl font-bold text-foreground-primary">
          Deep Sales & Customer Intelligence
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Aggregated Supabase telemetry on revenue growth, category distribution, and patron acquisition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold">Monthly Revenue Trajectory ($)</h3>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fill="url(#colorRevFull)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold">Revenue by Category Share</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {categoryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
            {categoryShare.map((c) => (
              <div key={c.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-semibold">{c.name}</span>
                </div>
                <span className="font-bold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
