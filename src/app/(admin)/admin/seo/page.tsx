"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { SEOSettings } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Globe, Save, FileCode } from "lucide-react";

export default function AdminSEOPage() {
  const [seo, setSeo] = useState<Partial<SEOSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSEO();
  }, []);

  const fetchSEO = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("seo_settings").select("*").single();
    if (data) setSeo(data);
    setIsLoading(false);
  };

  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("seo_settings")
        .update({
          ...seo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", seo.id || "00000000-0000-0000-0000-000000000001");

      if (error) throw error;
      toast.success("SEO settings updated!");
    } catch (e: any) {
      toast.error("Failed to update SEO", e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            SEO & Search Telemetry Center
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Global meta title templates, Open Graph defaults, GA4 tracking IDs, and dynamic robots.txt.
          </p>
        </div>

        <Button onClick={handleSaveSEO} variant="primary" isLoading={isSaving} shimmer className="gap-2">
          <Save className="h-4 w-4" /> Save SEO Settings
        </Button>
      </div>

      <form onSubmit={handleSaveSEO} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold">Global Meta & Open Graph Defaults</h3>
          <Input
            label="Meta Title Template"
            value={seo.meta_title_template || ""}
            onChange={(e) => setSeo({ ...seo, meta_title_template: e.target.value })}
            placeholder="{Page Title} | AURA Atelier"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={seo.default_meta_description || ""}
              onChange={(e) => setSeo({ ...seo, default_meta_description: e.target.value })}
              className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-md focus:outline-none focus:border-accent bg-white"
            />
          </div>

          <Input
            label="Default Open Graph (OG) Image URL"
            value={seo.og_default_image_url || ""}
            onChange={(e) => setSeo({ ...seo, og_default_image_url: e.target.value })}
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold">Tracking & Verification Pixels</h3>
          <Input
            label="Google Analytics GA4 Measurement ID"
            value={seo.ga_tracking_id || ""}
            onChange={(e) => setSeo({ ...seo, ga_tracking_id: e.target.value })}
            placeholder="G-XXXXXXXXXX"
          />
          <Input
            label="Facebook Pixel ID"
            value={seo.fb_pixel_id || ""}
            onChange={(e) => setSeo({ ...seo, fb_pixel_id: e.target.value })}
          />
          <Input
            label="Google Search Console Verification Tag"
            value={seo.search_console_meta || ""}
            onChange={(e) => setSeo({ ...seo, search_console_meta: e.target.value })}
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold">Robots.txt Configuration</h3>
          <textarea
            rows={5}
            value={seo.robots_txt || ""}
            onChange={(e) => setSeo({ ...seo, robots_txt: e.target.value })}
            className="w-full px-4 py-3 font-mono text-xs border border-neutral-200 rounded-md focus:outline-none focus:border-accent bg-neutral-900 text-white"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isSaving} shimmer className="w-full">
          Save SEO Center Configuration
        </Button>
      </form>
    </div>
  );
}
