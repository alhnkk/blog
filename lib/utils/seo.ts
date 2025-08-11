import { Metadata } from "next";
import { SEOData, OpenGraphData } from "@/lib/types";

// Default site configuration
const DEFAULT_SITE_CONFIG = {
  siteName: "Kişisel Blog",
  siteDescription:
    "Modern web teknolojileri, yazılım geliştirme ve tasarım hakkında yazılar",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultImage: "/images/og-default.jpg",
  twitterHandle: "@yourusername",
  locale: "tr_TR",
};

/**
 * Generate dynamic metadata for Next.js pages
 */
export function generateSEOMetadata(seoData: SEOData): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
  } = seoData;

  const fullTitle = title.includes(DEFAULT_SITE_CONFIG.siteName)
    ? title
    : `${title} | ${DEFAULT_SITE_CONFIG.siteName}`;

  const fullUrl = url
    ? `${DEFAULT_SITE_CONFIG.siteUrl}${url}`
    : DEFAULT_SITE_CONFIG.siteUrl;
  const ogImage = image || DEFAULT_SITE_CONFIG.defaultImage;
  const fullImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${DEFAULT_SITE_CONFIG.siteUrl}${ogImage}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: author ? [{ name: author }] : undefined,

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: DEFAULT_SITE_CONFIG.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: DEFAULT_SITE_CONFIG.locale,
      type: type as any,
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImageUrl],
      creator: DEFAULT_SITE_CONFIG.twitterHandle,
    },

    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },
  };

  return metadata;
}

/**
 * Generate structured data (JSON-LD) for articles
 */
export function generateArticleStructuredData(
  seoData: SEOData & {
    content?: string;
    wordCount?: number;
    readingTime?: number;
  }
) {
  const {
    title,
    description,
    image,
    url,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    content,
    wordCount,
    readingTime,
  } = seoData;

  const fullUrl = url
    ? `${DEFAULT_SITE_CONFIG.siteUrl}${url}`
    : DEFAULT_SITE_CONFIG.siteUrl;
  const fullImageUrl = image?.startsWith("http")
    ? image
    : `${DEFAULT_SITE_CONFIG.siteUrl}${image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: fullImageUrl,
    url: fullUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Person",
      name: author || "Blog Yazarı",
    },
    publisher: {
      "@type": "Organization",
      name: DEFAULT_SITE_CONFIG.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${DEFAULT_SITE_CONFIG.siteUrl}/logo.jpeg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    articleSection: section,
    keywords: tags.join(", "),
    ...(wordCount && { wordCount }),
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
  };
}

/**
 * Generate structured data for website/homepage
 */
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: DEFAULT_SITE_CONFIG.siteName,
    description: DEFAULT_SITE_CONFIG.siteDescription,
    url: DEFAULT_SITE_CONFIG.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${DEFAULT_SITE_CONFIG.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate structured data for blog
 */
export function generateBlogStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: DEFAULT_SITE_CONFIG.siteName,
    description: DEFAULT_SITE_CONFIG.siteDescription,
    url: DEFAULT_SITE_CONFIG.siteUrl,
    author: {
      "@type": "Person",
      name: "Blog Yazarı",
    },
    publisher: {
      "@type": "Organization",
      name: DEFAULT_SITE_CONFIG.siteName,
    },
  };
}

/**
 * Extract keywords from content
 */
export function extractKeywords(
  content: string,
  tags: string[] = []
): string[] {
  // Simple keyword extraction - in production, you might want to use a more sophisticated approach
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const wordFreq: Record<string, number> = {};
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  const topWords = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);

  return [...tags, ...topWords].slice(0, 10);
}

/**
 * Calculate reading time
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate sitemap data
 */
export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export function generateSitemapEntry(
  path: string,
  lastModified: Date,
  changeFrequency: SitemapEntry["changeFrequency"] = "weekly",
  priority: number = 0.5
): SitemapEntry {
  return {
    url: `${DEFAULT_SITE_CONFIG.siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}
