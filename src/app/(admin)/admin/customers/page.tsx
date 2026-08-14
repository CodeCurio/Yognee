"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Mail, User } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setCustomers(data as Profile[]);
    setIsLoading(false);
  };

  const filtered = customers.filter(
    (c) =>
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.full_name && c.full_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            Client Directory
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage patrons, customer profiles, and lifetime engagement values.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 rounded-md focus:outline-none focus:border-accent"
          />
        </div>
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Total: {filtered.length}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
            <tr>
              <th className="py-3.5 px-4">Client Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Join Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-400">Loading clients...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-400">No client profiles found.</td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground-primary">
                    {c.full_name || "Valued Patron"}
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{c.email}</td>
                  <td className="py-3 px-4 uppercase font-bold text-accent">{c.role}</td>
                  <td className="py-3 px-4 text-neutral-400">{formatDate(c.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
