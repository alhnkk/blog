import { MetadataRoute } from "next";
import {
  getSitemapPosts,
  getSitemapCategories,
  getSitemapTags,
} from "@/lib/actions/seo";
import { generateSitemapEntry } from "@/lib/utils/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static pages
  const staticPages = [
    generateSitemapEntry("/", new Date(), "daily", 1.0),
    generateSitemapEntry("/iletisim", new Date(), "monthly", 0.3),
  ];

  // Dynamic pages
  const [posts, categories, tags] = await Promise.all([
    getSitemapPosts(),
    getSitemapCategories(),
    getSitemapTags(),
  ]);

  return [...staticPages, ...posts, ...categories, ...tags];
}
