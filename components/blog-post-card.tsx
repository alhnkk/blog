"use client";

import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import { EnhancedLink } from "@/components/ui/enhanced-link";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

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

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const { ref: cardRef, hasIntersected: isVisible } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      rootMargin: "50px",
      triggerOnce: true,
    });

  const formatDate = (date: Date | null) => {
    if (!date) return "Tarih yok";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Tarih yok";
      return new Intl.DateTimeFormat("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(dateObj);
    } catch {
      return "Tarih yok";
    }
  };

  return (
    <Card
      ref={cardRef}
      className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
    >
      <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-5">
          <div className="mb-4 md:mb-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((postTag) => (
                <EnhancedLink
                  key={postTag.tag.id}
                  href={`/tags/${postTag.tag.slug}`}
                  prefetch={false}
                  showProgress={false}
                >
                  <Badge variant="outline" className="text-xs">
                    {postTag.tag.name}
                  </Badge>
                </EnhancedLink>
              ))}
            </div>
          </div>
          <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">
            <EnhancedLink
              href={`/posts/${post.slug}`}
              className="hover:underline line-clamp-2"
              prefetch={isVisible}
              showProgress={true}
            >
              {post.title}
            </EnhancedLink>
          </h3>
          {post.excerpt && (
            <p className="mt-4 text-sm text-muted-foreground md:mt-5 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
            <span className="text-muted-foreground">{post.author.name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {post._count.comments} yorum
            </span>
          </div>
          <div className="mt-6 flex items-center space-x-2 md:mt-8">
            <EnhancedLink
              href={`/posts/${post.slug}`}
              className="inline-flex items-center font-semibold hover:underline md:text-base"
              prefetch={isVisible}
              showProgress={true}
            >
              <span>Devamını oku</span>
              <ArrowRight className="ml-2 size-4 transition-transform" />
            </EnhancedLink>
          </div>
        </div>
        <div className="order-first sm:order-last sm:col-span-5">
          <EnhancedLink
            href={`/posts/${post.slug}`}
            className="block"
            prefetch={isVisible}
            showProgress={true}
          >
            <div className="aspect-16/9 overflow-clip rounded-lg border border-border">
              {post.coverImage && isVisible ? (
                <SafeImage
                  src={post.coverImage}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-opacity duration-200 hover:opacity-70"
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : post.coverImage ? (
                <div className="h-full w-full bg-muted animate-pulse" />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Görsel yok</span>
                </div>
              )}
            </div>
          </EnhancedLink>
        </div>
      </div>
    </Card>
  );
}
