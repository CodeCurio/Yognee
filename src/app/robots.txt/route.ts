import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("seo_settings").select("robots_txt").single();

  const robots = data?.robots_txt || `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://aura-atelier.com/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
