"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Upload, X, Plus, Trash2, ArrowLeft } from "lucide-react";

interface ProductFormProps {
  initialProduct?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialProduct }) => {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState(initialProduct?.title || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || "");
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : "");
  const [salePrice, setSalePrice] = useState(initialProduct?.sale_price ? String(initialProduct.sale_price) : "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [stockQuantity, setStockQuantity] = useState(initialProduct?.stock_quantity ? String(initialProduct.stock_quantity) : "10");
  const [status, setStatus] = useState<"active" | "draft">(initialProduct?.status || "active");
  const [tags, setTags] = useState<string[]>(initialProduct?.tags || ["New Arrival"]);
  const [newTagInput, setNewTagInput] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(
    initialProduct?.images?.map((i) => i.image_url) || [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    ]
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Variant Creator State
  const [options, setOptions] = useState<Array<{ name: string; values: string[] }>>([
    { name: "Size", values: ["S", "M", "L", "XL"] },
  ]);

  useEffect(() => {
    const fetchCats = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data) setCategories(data as Category[]);
    };
    fetchCats();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialProduct) {
      setSlug(slugify(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const supabase = createClient();

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (error) {
          toast.error(`Upload error: ${error.message}`);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        toast.success(`Uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch (e: any) {
      toast.error("Upload failed", e.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
    }
    setNewTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !sku) {
      toast.error("Please fill in required fields (Title, Price, SKU).");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        description,
        category_id: categoryId || null,
        price: parseFloat(price),
        sale_price: salePrice ? parseFloat(salePrice) : null,
        sku,
        stock_quantity: parseInt(stockQuantity, 10) || 0,
        status,
        tags,
        updated_at: new Date().toISOString(),
      };

      let productId = initialProduct?.id;

      if (initialProduct) {
        // Update existing
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", initialProduct.id);

        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      // Sync Images in product_images table
      if (productId) {
        await supabase.from("product_images").delete().eq("product_id", productId);
        const imageRows = images.map((url, idx) => ({
          product_id: productId,
          image_url: url,
          sort_order: idx + 1,
        }));
        await supabase.from("product_images").insert(imageRows);
      }

      toast.success(
        initialProduct ? "Product updated successfully!" : "Product published successfully!"
      );
      router.push("/admin/products");
    } catch (e: any) {
      toast.error("Failed to save product", e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => router.push("/admin/products")}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            {initialProduct ? `Edit Product: ${initialProduct.title}` : "Create New Product"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => {
              setStatus("draft");
            }}
            variant="outline"
          >
            Save Draft
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving} shimmer>
            {initialProduct ? "Update Product" : "Publish Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
            <h3 className="font-serif text-lg font-bold">General Information</h3>
            <Input label="Product Title" value={title} onChange={handleTitleChange} required />
            <Input label="Slug (URL Key)" value={slug} onChange={(e) => setSlug(e.target.value)} required />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Description (HTML / Rich Text)
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product narrative, materials, origin, and specifications..."
                className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-accent bg-white"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
            <h3 className="font-serif text-lg font-bold">Pricing & Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Regular Price ($)"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <Input
                label="Sale Price ($ optional)"
                type="number"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="SKU Code" value={sku} onChange={(e) => setSku(e.target.value)} required />
              <Input
                label="Stock Quantity"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Media Upload Zone */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
            <h3 className="font-serif text-lg font-bold">Product Media Gallery</h3>
            <p className="text-xs text-neutral-500">
              Drag & drop or select images to upload to Supabase bucket. First image = Featured image.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Product Media" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>
              ))}

              <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 hover:border-accent bg-neutral-50 hover:bg-blue-50/20 flex flex-col items-center justify-center cursor-pointer transition-colors text-neutral-500">
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold uppercase">{isUploading ? "Uploading..." : "Upload"}</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Dynamic Variant Matrix Creator */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
            <h3 className="font-serif text-lg font-bold">Variant Options</h3>
            {options.map((opt, i) => (
              <div key={i} className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase">{opt.name}</span>
                  <button
                    type="button"
                    onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
                    className="text-neutral-400 hover:text-destructive text-xs"
                  >
                    Remove Option
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {opt.values.map((v, valIdx) => (
                    <span key={valIdx} className="bg-white px-2.5 py-1 rounded text-xs font-semibold border border-neutral-200">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Controls (Right 1 Column) */}
        <div className="space-y-6">
          {/* Status Selector */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
              Publish Status
            </h4>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-white border border-neutral-200 rounded-md p-2.5 text-xs font-bold text-foreground-primary focus:outline-none focus:border-accent"
            >
              <option value="active">Active (Visible on Storefront)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>

          {/* Category Assignment */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
              Category
            </h4>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-md p-2.5 text-xs font-semibold text-foreground-primary focus:outline-none focus:border-accent"
            >
              <option value="">Select Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
              Tags & Collections
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Add tag (e.g. Best Seller)"
                className="flex-1 px-3 py-1.5 text-xs border border-neutral-200 rounded-md focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-neutral-100 px-2.5 py-1 rounded-full text-xs font-medium text-foreground-primary flex items-center gap-1"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((tag) => tag !== t))}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
