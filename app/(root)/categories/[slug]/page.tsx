import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/actions/category";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground mb-4">
            {category.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {category.posts.length} yazı bulundu
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {category.posts.map(({ post }) => (
          <article
            key={post.id}
            className="group cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
          >
            <Link href={`/posts/${post.slug}`}>
              {post.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold line-clamp-2 group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map(({ tag }) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.publishedAt
                        ? formatDate(post.publishedAt)
                        : formatDate(post.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post._count.comments}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {category.posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Bu kategoride henüz yazı bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
}
