import { unstable_cache } from "next/cache";

// Cache tags for revalidation
export const CACHE_TAGS = {
  POSTS: "posts",
  TAGS: "tags",
  CATEGORIES: "categories",
  COMMENTS: "comments",
  ANALYTICS: "analytics",
  HOMEPAGE: "homepage",
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Cached function wrapper with proper typing
export function createCachedFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: string[],
  options: {
    revalidate?: number;
    tags?: string[];
  } = {}
) {
  return unstable_cache(fn, keyParts, {
    revalidate: options.revalidate || CACHE_DURATIONS.MEDIUM,
    tags: options.tags || [],
  });
}

// Homepage specific cache functions
export const getCachedHomepagePosts = createCachedFunction(
  async () => {
    const { getPosts } = await import("@/lib/actions/get-posts");
    return getPosts({
      status: "PUBLISHED",
      limit: 6, // Get more posts for better UX
      page: 1,
      orderBy: "publishedAt",
      orderDirection: "desc",
    });
  },
  ["homepage", "posts"],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [CACHE_TAGS.POSTS, CACHE_TAGS.HOMEPAGE],
  }
);

export const getCachedPopularTags = createCachedFunction(
  async (limit: number = 8) => {
    const { getPopularTags } = await import("@/lib/actions/tag");
    return getPopularTags(limit);
  },
  ["popular", "tags"],
  {
    revalidate: CACHE_DURATIONS.LONG,
    tags: [CACHE_TAGS.TAGS, CACHE_TAGS.HOMEPAGE],
  }
);

export const getCachedRecentPosts = createCachedFunction(
  async (limit: number = 5) => {
    const { getPosts } = await import("@/lib/actions/get-posts");
    const { posts } = await getPosts({
      status: "PUBLISHED",
      limit,
      page: 1,
      orderBy: "publishedAt",
      orderDirection: "desc",
    });
    return posts.filter((post) => post.publishedAt);
  },
  ["recent", "posts"],
  {
    revalidate: CACHE_DURATIONS.MEDIUM,
    tags: [CACHE_TAGS.POSTS, CACHE_TAGS.HOMEPAGE],
  }
);

// Post specific cache functions
export const getCachedPost = createCachedFunction(
  async (slug: string) => {
    const { prismadb } = await import("@/lib/prismadb");
    return prismadb.post.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  },
  ["post"],
  {
    revalidate: CACHE_DURATIONS.LONG,
    tags: [CACHE_TAGS.POSTS],
  }
);

// Cache invalidation helpers
export async function revalidateHomepage() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag(CACHE_TAGS.HOMEPAGE);
}

export async function revalidatePosts() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag(CACHE_TAGS.POSTS);
}

export async function revalidateTags() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag(CACHE_TAGS.TAGS);
}

// Memory cache for frequently accessed data
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private maxSize = 100;

  set(key: string, data: any, ttl: number = CACHE_DURATIONS.SHORT * 1000) {
    // Clean up expired entries
    this.cleanup();

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();
