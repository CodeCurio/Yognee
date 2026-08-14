"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { Plus, Search, Edit3, Trash2, Eye } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, images:product_images(*), category:categories(*)")
      .order("created_at", { ascending: false });

    if (data) setProducts(data as Product[]);
    setIsLoading(false);
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success(`Deleted "${title}"`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            Product Catalog Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage inventory, variant matrices, pricing, and media uploads.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="md" shimmer className="gap-2">
            <Plus className="h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or SKU..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 rounded-md focus:outline-none focus:border-accent"
          />
        </div>
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Total: {filteredProducts.length}
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
            <tr>
              <th className="py-3.5 px-4">Thumbnail</th>
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4">SKU</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-400">
                  Loading catalog...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-400">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => {
                const img = prod.images?.[0]?.image_url || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80";
                return (
                  <tr key={prod.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="w-10 h-12 rounded overflow-hidden bg-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={prod.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-foreground-primary">
                      {prod.title}
                    </td>
                    <td className="py-2.5 px-4 text-neutral-500">{prod.sku}</td>
                    <td className="py-2.5 px-4">{prod.category?.name || "Uncategorized"}</td>
                    <td className="py-2.5 px-4 font-bold">{formatCurrency(prod.price)}</td>
                    <td className="py-2.5 px-4">
                      <span className={`font-semibold ${prod.stock_quantity < 10 ? "text-destructive" : "text-foreground-primary"}`}>
                        {prod.stock_quantity}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge variant={prod.status === "active" ? "success" : "outline"}>
                        {prod.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-2">
                      <Link href={`/products/${prod.slug}`} target="_blank" className="inline-block text-neutral-400 hover:text-foreground-primary p-1">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link href={`/admin/products/${prod.id}`} className="inline-block text-neutral-400 hover:text-accent p-1">
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.title)}
                        className="text-neutral-400 hover:text-destructive p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
