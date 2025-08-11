"use server";

import { prismadb } from "../prismadb";
import { PostStatus } from "../types";

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  tagId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: PostStatus;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: Date | null;
  author: {
    name: string | null;
    email: string;
  };
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  _count: {
    comments: number;
  };
}

export async function searchPosts(filters: SearchFilters) {
  const {
    query = "",
    categoryId,
    tagId,
    dateFrom,
    dateTo,
    status = "PUBLISHED",
    page = 1,
    limit = 10,
  } = filters;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    status,
    ...(categoryId && {
      categories: {
        some: {
          categoryId,
        },
      },
    }),
    ...(tagId && {
      tags: {
        some: {
          tagId,
        },
      },
    }),
  };

  // Handle date filtering
  if (dateFrom || dateTo) {
    where.publishedAt = {};
    if (dateFrom) {
      where.publishedAt.gte = dateFrom;
    }
    if (dateTo) {
      where.publishedAt.lte = dateTo;
    }
  }

  // Add search query if provided
  if (query.trim()) {
    where.OR = [
      {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        excerpt: {
          contains: query,
          mode: "insensitive",
        },
      },
    ];
  }

  try {
    const [posts, total] = await Promise.all([
      prismadb.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prismadb.post.count({ where }),
    ]);

    return {
      success: true,
      data: {
        posts: posts as SearchResult[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      success: false,
      error: "Arama sırasında bir hata oluştu",
    };
  }
}

export async function getSearchSuggestions(query: string, limit: number = 5) {
  if (!query.trim() || query.length < 2) {
    return { success: true, data: [] };
  }

  try {
    const posts = await prismadb.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            excerpt: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Search suggestions error:", error);
    return {
      success: false,
      error: "Öneriler alınamadı",
    };
  }
}

export async function getPopularSearchTerms(limit: number = 10) {
  try {
    // Bu örnekte popüler etiketleri döndürüyoruz
    // Gerçek uygulamada search analytics tablosu kullanılabilir
    const tags = await prismadb.tag.findMany({
      take: limit,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    });

    return {
      success: true,
      data: tags.map((tag) => ({
        term: tag.name,
        count: tag._count.posts,
      })),
    };
  } catch (error) {
    console.error("Popular search terms error:", error);
    return {
      success: false,
      error: "Popüler arama terimleri alınamadı",
    };
  }
}
