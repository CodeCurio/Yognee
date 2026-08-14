import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aura-atelier.com";
  const supabase = createAdminClient();

  const { data: products } = await supabase.from("products").select("slug, updated_at").eq("status", "active");
  const { data: categories } = await supabase.from("categories").select("slug");

  const productUrls = (products || [])
    .map(
      (p) => `<url>
    <loc>${baseUrl}/products/${p.slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("");

  const categoryUrls = (categories || [])
    .map(
      (c) => `<url>
    <loc>${baseUrl}/products?category=${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <priority>0.5</priority>
  </url>
  ${categoryUrls}
  ${productUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
