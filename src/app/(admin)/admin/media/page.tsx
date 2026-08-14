"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Upload, Copy, Check, Trash2, Image as ImageIcon } from "lucide-react";

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<Array<{ name: string; url: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const toast = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.storage.from("media-library").list();

    if (data) {
      const items = data.map((f) => {
        const { data: { publicUrl } } = supabase.storage.from("media-library").getPublicUrl(f.name);
        return { name: f.name, url: publicUrl };
      });
      setMediaItems(items);
    }
    setIsLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const supabase = createClient();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `${Date.now()}_${file.name}`;
      await supabase.storage.from("media-library").upload(filePath, file);
    }

    toast.success("Media assets uploaded!");
    setIsUploading(false);
    fetchMedia();
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete media asset "${name}"?`)) return;
    const supabase = createClient();
    await supabase.storage.from("media-library").remove([name]);
    toast.success("Asset deleted.");
    fetchMedia();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            Media Library & Storage Bucket
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Central repository for product photography, brand imagery, and editorial banners.
          </p>
        </div>

        <label className="bg-foreground-primary text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer flex items-center gap-2 shadow-sm">
          <Upload className="h-4 w-4" /> {isUploading ? "Uploading..." : "Upload New Media"}
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-neutral-400">Loading storage bucket...</div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-neutral-100 space-y-3">
          <ImageIcon className="h-10 w-10 text-neutral-300 mx-auto" />
          <h3 className="font-serif text-xl font-bold">No Media Files Uploaded</h3>
          <p className="text-xs text-neutral-500">Upload photography to generate shareable asset URLs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => (
            <div key={item.name} className="bg-white p-2 rounded-xl border border-neutral-200 shadow-card space-y-2 group relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[100px]">{item.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyUrl(item.url)}
                    className="p-1 text-neutral-500 hover:text-accent"
                    title="Copy URL"
                  >
                    {copiedUrl === item.url ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.name)}
                    className="p-1 text-neutral-500 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
