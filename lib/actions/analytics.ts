"use server";

import { prismadb } from "@/lib/prismadb";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export async function trackEvent(
  event: string,
  path?: string,
  properties?: Record<string, unknown>
) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const forwarded = headersList.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0] : undefined;

    const session = await auth.api.getSession({
      headers: headersList,
    });

    await prismadb.analytics.create({
      data: {
        event,
        path,
        userAgent,
        ipAddress,
        userId: session?.user?.id,
        properties: properties ? JSON.stringify(properties) : undefined,
      },
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

export async function trackPostView(postId: string) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const forwarded = headersList.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0] : undefined;

    await prismadb.postView.create({
      data: {
        postId,
        userAgent,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("Post view tracking error:", error);
  }
}

export async function getAnalyticsStats() {
  try {
    // Start with basic counts first
    const totalPageViews = await prismadb.analytics
      .count({
        where: {
          event: "page_view",
        },
      })
      .catch(() => 0);

    const totalPostViews = await prismadb.postView.count().catch(() => 0);

    // Get unique visitors count
    const uniqueVisitorsResult = await prismadb.analytics
      .groupBy({
        by: ["ipAddress"],
        where: {
          event: "page_view",
          ipAddress: {
            not: null,
          },
        },
      })
      .catch(() => []);

    // Get top viewed posts
    const topPosts = await prismadb.postView
      .groupBy({
        by: ["postId"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 10,
      })
      .catch(() => []);

    // Get post details for top posts
    const topPostIds = topPosts.map((p) => p.postId);
    const postDetails =
      topPostIds.length > 0
        ? await prismadb.post
            .findMany({
              where: {
                id: {
                  in: topPostIds,
                },
              },
              select: {
                id: true,
                title: true,
                slug: true,
              },
            })
            .catch(() => [])
        : [];

    const topPostsWithDetails = topPosts.map((stat) => {
      const post = postDetails.find((p) => p.id === stat.postId);
      return {
        ...stat,
        post,
      };
    });

    // Get recent events
    const recentEvents = await prismadb.analytics
      .findMany({
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })
      .catch(() => []);

    return {
      totalPageViews,
      uniqueVisitors: uniqueVisitorsResult.length,
      totalPostViews,
      topPosts: topPostsWithDetails,
      recentEvents,
      dailyStats: [],
    };
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return {
      totalPageViews: 0,
      uniqueVisitors: 0,
      totalPostViews: 0,
      topPosts: [],
      recentEvents: [],
      dailyStats: [],
    };
  }
}

export async function getPostAnalytics(postId: string) {
  try {
    const [viewCount, dailyViews, referrers] = await Promise.all([
      // Total views for this post
      prismadb.postView.count({
        where: {
          postId,
        },
      }),

      // Daily views - simplified for now
      Promise.resolve([]),

      // Top referrers (from analytics events) - simplified for now
      Promise.resolve([]),
    ]);

    return {
      viewCount,
      dailyViews,
      referrers,
    };
  } catch (error) {
    console.error("Error fetching post analytics:", error);
    return {
      viewCount: 0,
      dailyViews: [],
      referrers: [],
    };
  }
}

export async function getUserActivity(userId: string) {
  try {
    const [totalEvents, recentActivity, eventTypes] = await Promise.all([
      // Total events for user
      prismadb.analytics.count({
        where: {
          userId,
        },
      }),

      // Recent activity
      prismadb.analytics.findMany({
        where: {
          userId,
        },
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      }),

      // Event types breakdown
      prismadb.analytics.groupBy({
        by: ["event"],
        where: {
          userId,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
      }),
    ]);

    return {
      totalEvents,
      recentActivity,
      eventTypes,
    };
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return {
      totalEvents: 0,
      recentActivity: [],
      eventTypes: [],
    };
  }
}
