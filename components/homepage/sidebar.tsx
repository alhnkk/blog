import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { getCachedRecentPosts, getCachedPopularTags } from "@/lib/cache";

// Loading skeletons
function RecentPostsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
          {i < 2 && <Separator className="mt-3" />}
        </div>
      ))}
    </div>
  );
}

function PopularTagsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-16" />
      ))}
    </div>
  );
}

// Async components
async function RecentPosts() {
  const recentPosts = await getCachedRecentPosts(5);

  return (
    <div className="space-y-4">
      {recentPosts.slice(0, 3).map((post, index) => (
        <div key={post.id} className="space-y-2">
          <Link
            href={`/posts/${post.slug}`}
            className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
          >
            {post.title}
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>•</span>
            {post.publishedAt &&
              (() => {
                try {
                  const date = new Date(post.publishedAt);
                  if (isNaN(date.getTime())) return "Tarih yok";
                  return new Intl.DateTimeFormat("tr-TR", {
                    month: "short",
                    day: "numeric",
                  }).format(date);
                } catch {
                  return "Tarih yok";
                }
              })()}
          </div>
          {index < 2 && <Separator className="mt-3" />}
        </div>
      ))}
    </div>
  );
}

async function PopularTags() {
  const popularTags = await getCachedPopularTags(8);

  return (
    <div className="flex flex-wrap gap-2">
      {popularTags.map((tag) => (
        <Link key={tag.slug} href={`/tags/${tag.slug}`}>
          <Badge
            variant="secondary"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {tag.name} ({tag._count.posts})
          </Badge>
        </Link>
      ))}
    </div>
  );
}

// Main sidebar component
export function HomepageSidebar() {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Hakkımda */}
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-lg">Hakkımda</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Modern web teknolojileri, yazılım geliştirme ve tasarım hakkında
            yazılar paylaşıyorum. React, Next.js, TypeScript ve diğer güncel
            teknolojiler üzerine deneyimlerimi aktarıyorum.
          </p>
        </CardContent>
      </Card>

      <Separator className="bg-gray-300 dark:bg-border" />

      {/* Son Yazılar */}
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Son Yazılar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<RecentPostsSkeleton />}>
            <RecentPosts />
          </Suspense>
        </CardContent>
      </Card>

      <Separator className="bg-gray-300 dark:bg-border" />

      {/* Popüler Etiketler */}
      <Card className="bg-transparent shadow-none border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5" />
            Popüler Etiketler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PopularTagsSkeleton />}>
            <PopularTags />
          </Suspense>
        </CardContent>
      </Card>

      <Separator className="bg-gray-300 dark:bg-border" />
    </aside>
  );
}
