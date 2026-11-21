import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let sitemap: string | undefined;

  if (configuredUrl) {
    try {
      const baseUrl = new URL(configuredUrl);
      if (baseUrl.protocol === "https:" || baseUrl.protocol === "http:") {
        sitemap = new URL("/sitemap.xml", baseUrl).toString();
      }
    } catch {
      sitemap = undefined;
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/explore"],
    },
    ...(sitemap ? { sitemap } : {}),
  };
}
