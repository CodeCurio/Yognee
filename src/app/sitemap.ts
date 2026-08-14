import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yoginee.com";
  const staticRoutes = [
    "",
    "/products",
    "/consultations",
    "/chart-calculator",
    "/about",
    "/contact",
    "/faq",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/products" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
