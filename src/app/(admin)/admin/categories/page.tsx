"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit3, Trash2, FolderTree } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [parentId, setParentId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    if (data) setCategories(data as Category[]);
    setIsLoading(false);
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setParentId("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.image_url || "");
    setParentId(cat.parent_id || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSaving(true);
    const supabase = createClient();

    const payload = {
      name,
      slug: slug || slugify(name),
      description,
      image_url: imageUrl || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      parent_id: parentId || null,
    };

    try {
      if (editingCategory) {
        await supabase.from("categories").update(payload).eq("id", editingCategory.id);
        toast.success("Category updated!");
      } else {
        await supabase.from("categories").insert(payload);
        toast.success("Category created!");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (e: any) {
      toast.error("Error saving category", e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    toast.success(`Deleted ${catName}`);
    fetchCategories();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            Category Architecture
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Organize catalog hierarchies, landing banners, and sub-category trees.
          </p>
        </div>

        <Button onClick={handleOpenCreateModal} variant="primary" shimmer className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-card overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
            <tr>
              <th className="py-3.5 px-4">Banner</th>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-400">Loading categories...</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="w-12 h-10 rounded overflow-hidden bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cat.image_url || ""} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-foreground-primary">{cat.name}</td>
                  <td className="py-2.5 px-4 text-neutral-500">{cat.slug}</td>
                  <td className="py-2.5 px-4 text-neutral-500 max-w-xs truncate">{cat.description}</td>
                  <td className="py-2.5 px-4 text-right space-x-2">
                    <button onClick={() => handleOpenEditModal(cat)} className="text-neutral-400 hover:text-accent p-1">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="text-neutral-400 hover:text-destructive p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "New Category"}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <Input label="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Slug (URL Key)" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Auto-generated if blank" />
          <Input label="Banner Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short category description..."
              className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-accent bg-white"
            />
          </div>
          <Button type="submit" variant="primary" isLoading={isSaving} className="w-full">
            {editingCategory ? "Save Changes" : "Create Category"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
