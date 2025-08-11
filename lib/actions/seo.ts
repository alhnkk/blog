"use server";

import { prismadb } from "@/lib/prismadb";
import { generateSitemapEntry, type SitemapEntry } from "@/lib/utils/seo";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";

/**
 * Get all published posts for sitemap generation
 */
export async function getSitemapPosts(): Promise<SitemapEntry[]> {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return posts.map((post) =>
      generateSitemapEntry(
        `/posts/${post.slug}`,
        post.updatedAt,
        "monthly",
        0.8
      )
    );
  } catch (error) {
    console.error("Error fetching sitemap posts:", error);
    return [];
  }
}

/**
 * Get all categories for sitemap generation
 */
export async function getSitemapCategories(): Promise<SitemapEntry[]> {
  try {
    const categories = await prismadb.category.findMany({
      select: {
        slug: true,
        createdAt: true,
      },
    });

    return categories.map((category) =>
      generateSitemapEntry(
        `/categories/${category.slug}`,
        category.createdAt,
        "weekly",
        0.6
      )
    );
  } catch (error) {
    console.error("Error fetching sitemap categories:", error);
    return [];
  }
}

/**
 * Get all tags for sitemap generation
 */
export async function getSitemapTags(): Promise<SitemapEntry[]> {
  try {
    const tags = await prismadb.tag.findMany({
      select: {
        slug: true,
        createdAt: true,
      },
    });

    return tags.map((tag) =>
      generateSitemapEntry(`/tags/${tag.slug}`, tag.createdAt, "weekly", 0.5)
    );
  } catch (error) {
    console.error("Error fetching sitemap tags:", error);
    return [];
  }
}

/**
 * Get site settings for SEO
 */
export async function getSiteSettings() {
  try {
    const settings = await prismadb.siteSettings.findFirst();
    return settings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

/**
 * Update site SEO settings
 */
export async function updateSiteSettings(data: {
  siteName?: string;
  siteDesc?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  twitterHandle?: string;
  keywords?: string;
}) {
  try {
    await requireAdmin();

    const settings = await prismadb.siteSettings.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        siteName: data.siteName || "Kişisel Blog",
        siteDesc: data.siteDesc || "Modern web teknolojileri hakkında yazılar",
        ...data,
      },
    });

    revalidatePath("/admin/seo");
    revalidatePath("/");

    return { success: true, data: settings };
  } catch (error) {
    console.error("Error updating site settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
}

/**
 * Get post SEO data
 */
export async function getPostSEOData(slug: string) {
  try {
    const post = await prismadb.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return {
      title: post.title,
      description:
        post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
      image: post.coverImage,
      url: `/posts/${post.slug}`,
      type: "article" as const,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      author: post.author.name || "Blog Yazarı",
      section: post.categories[0]?.category.name,
      tags: post.tags.map((pt) => pt.tag.name),
      content: post.content,
    };
  } catch (error) {
    console.error("Error fetching post SEO data:", error);
    return null;
  }
}

/**
 * Update post SEO metadata
 */
export async function updatePostSEO(
  postId: string,
  data: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords?: string[];
  }
) {
  try {
    await requireAdmin();

    const post = await prismadb.post.update({
      where: { id: postId },
      data: {
        title: data.metaTitle || undefined,
        excerpt: data.metaDescription || undefined,
        coverImage: data.ogImage || undefined,
      },
    });

    revalidatePath(`/posts/${post.slug}`);
    revalidatePath("/admin/posts");

    return { success: true, data: post };
  } catch (error) {
    console.error("Error updating post SEO:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
}
