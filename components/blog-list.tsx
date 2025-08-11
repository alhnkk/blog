"use client";

import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BlogPostCard } from "@/components/blog-post-card";
import { getPosts } from "@/lib/actions/get-posts";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt: Date | null;
  author: {
    name: string;
    image?: string;
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

interface BlogListProps {
  heading?: string;
  description?: string;
  posts: Post[];
  initialPage?: number;
  hasMore?: boolean;
}

const BlogList = ({
  heading = "Son Yazılar",
  description = "Modern web geliştirme, tasarım ve teknoloji hakkında en güncel içerikler.",
  posts: initialPosts,
  initialPage = 1,
  hasMore: initialHasMore = false,
}: BlogListProps) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const result = await getPosts({
        status: "PUBLISHED",
        page: nextPage,
        limit: 3,
      });

      if (result.posts.length > 0) {
        setPosts((prev) => [...prev, ...result.posts]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < result.pagination.pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex py-32">
      <div className="container flex flex-col items-center gap-16 mx-auto">
        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={loadMorePosts}
              disabled={loading}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  Daha Fazla Göster
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export { BlogList };
