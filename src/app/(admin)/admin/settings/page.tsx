"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { SiteSettings, HeroSlide } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Settings, Upload, Save, Plus, Trash2, LayoutTemplate } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    fetchSettingsAndSlides();
  }, []);

  const fetchSettingsAndSlides = async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Site Settings
    const { data: set } = await supabase.from("site_settings").select("*").single();
    if (set) setSettings(set);

    // Hero Slides
    const { data: slides } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });
    if (slides) setHeroSlides(slides as HeroSlide[]);

    setIsLoading(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id || "00000000-0000-0000-0000-000000000001");

      if (error) throw error;
      toast.success("Brand & Site settings updated successfully!");
    } catch (e: any) {
      toast.error("Failed to update settings", e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: "logo_url" | "logo_inverted_url") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = createClient();
    const filePath = `logo_${slot}_${Date.now()}.${file.name.split(".").pop()}`;

    const { error } = await supabase.storage.from("brand-assets").upload(filePath, file);

    if (error) {
      toast.error("Logo upload failed", error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from("brand-assets").getPublicUrl(filePath);
      setSettings((prev) => ({ ...prev, [slot]: publicUrl }));
      toast.success("Logo uploaded!");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground-primary">
            Brand Identity & Store Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Customize storefront branding, logo assets, announcement banner, and hero slides without touching code.
          </p>
        </div>

        <Button onClick={handleSaveSettings} variant="primary" isLoading={isSaving} shimmer className="gap-2">
          <Save className="h-4 w-4" /> Save All Settings
        </Button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Brand Name & Tagline */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold">Store Identity & Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Site Name"
              value={settings.site_name || ""}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            />
            <Input
              label="Brand Tagline"
              value={settings.tagline || ""}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Concierge Email"
              value={settings.contact_email || ""}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            />
            <Input
              label="Concierge Phone"
              value={settings.contact_phone || ""}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
            />
          </div>

          <Input
            label="Business Address"
            value={settings.business_address || ""}
            onChange={(e) => setSettings({ ...settings, business_address: e.target.value })}
          />
        </div>

        {/* Announcement Bar Settings */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold">Top Announcement Banner</h3>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcement_bar_active ?? true}
                onChange={(e) => setSettings({ ...settings, announcement_bar_active: e.target.checked })}
                className="h-4 w-4 accent-accent"
              />
              Active
            </label>
          </div>

          <Input
            label="Announcement Banner Text"
            value={settings.announcement_bar_text || ""}
            onChange={(e) => setSettings({ ...settings, announcement_bar_text: e.target.value })}
          />

          <Input
            label="Banner Target Link"
            value={settings.announcement_bar_link || ""}
            onChange={(e) => setSettings({ ...settings, announcement_bar_link: e.target.value })}
          />
        </div>

        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold">Currency & Taxes</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Currency Code (e.g. USD)"
              value={settings.currency_code || "USD"}
              onChange={(e) => setSettings({ ...settings, currency_code: e.target.value })}
            />
            <Input
              label="Currency Symbol (e.g. $)"
              value={settings.currency_symbol || "$"}
              onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card space-y-4">
          <h3 className="font-serif text-lg font-bold">Social Media Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Instagram URL"
              value={settings.social_instagram || ""}
              onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
            />
            <Input
              label="Facebook URL"
              value={settings.social_facebook || ""}
              onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
            />
            <Input
              label="Twitter / X URL"
              value={settings.social_twitter || ""}
              onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
            />
            <Input
              label="YouTube URL"
              value={settings.social_youtube || ""}
              onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isSaving} shimmer className="w-full">
          Save Brand & Site Settings
        </Button>
      </form>
    </div>
  );
}
