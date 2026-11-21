import type { MetadataRoute } from "next";

const publicPages = [
  { path: "/", priority: 1 },
  { path: "/features", priority: 0.9 },
  { path: "/how-it-works", priority: 0.9 },
  { path: "/about", priority: 0.7 },
  { path: "/faq", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/disclaimer", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  // Do not publish localhost or placeholder URLs to search engines.
  if (!configuredUrl) return [];

  let baseUrl: URL;
  try {
    baseUrl = new URL(configuredUrl);
  } catch {
    return [];
  }

  if (baseUrl.protocol !== "https:" && baseUrl.protocol !== "http:") {
    return [];
  }

  return publicPages.map(({ path, priority }) => ({
    url: new URL(path, baseUrl).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
