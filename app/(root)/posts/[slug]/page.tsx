import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Eye, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { prismadb } from "@/lib/prismadb";
import { SafeImage } from "@/components/ui/safe-image";
import { getServerSession } from "@/lib/auth/session";
import { PostComments } from "@/components/post/post-comments";
import { getPostSEOData } from "@/lib/actions/seo";
import { trackPostView } from "@/lib/actions/analytics";
import { getPostLikeStatus } from "@/lib/actions/like";
import {
  generateSEOMetadata,
  generateArticleStructuredData,
  extractKeywords,
  calculateReadingTime,
} from "@/lib/utils/seo";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LikeButton } from "@/components/like-button";
import { ShareButton } from "@/components/share-button";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seoData = await getPostSEOData(slug);

  if (!seoData) {
    return {
      title: "Post Bulunamadı",
      description: "Aradığınız post bulunamadı.",
    };
  }

  const keywords = extractKeywords(seoData.content || "", seoData.tags);

  return generateSEOMetadata({
    ...seoData,
    image: seoData.image || undefined,
    keywords,
  });
}

async function getPost(slug: string) {
  const post = await prismadb.post.findUnique({
    where: {
      slug,
      status: "PUBLISHED",
    },
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

  if (!post) {
    return null;
  }

  // Transform the data
  return {
    ...post,
    publishedAt: post.publishedAt || post.createdAt,
    excerpt: post.excerpt || undefined,
    category: post.categories[0]?.category || { name: "Genel", slug: "genel" },
    tags: post.tags.map((pt) => pt.tag),
    readingTime: Math.ceil(post.content.length / 1000), // Rough estimate
  };
}

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Track post view
  await trackPostView(post.id);

  // Get current user session (comments will be loaded separately)
  const session = await getServerSession().catch(() => null);

  // Calculate like status
  const isLiked = session?.user?.id
    ? post.likes.some((like) => like.userId === session.user.id)
    : false;
  const likeCount = post._count.likes;

  // Generate structured data for SEO
  const seoData = await getPostSEOData(slug);
  const structuredData = seoData
    ? generateArticleStructuredData({
        ...seoData,
        image: seoData.image || undefined,
        wordCount: seoData.content?.split(/\s+/).length,
        readingTime: calculateReadingTime(seoData.content || ""),
      })
    : null;

  return (
    <>
      {/* Structured Data */}
      {structuredData && <StructuredData data={structuredData} />}

      {/* Hero Section */}
      <section className="relative">
        {post.coverImage && (
          <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
            <SafeImage
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority={true}
              sizes="100vw"
            />
            <div className="absolute inset-0 post-hero-gradient" />

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-10">
              <Link href="/">
                <Button
                  variant="secondary"
                  size="sm"
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri
                </Button>
              </Link>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                  >
                    {post.category.name}
                  </Badge>
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="bg-white/10 text-white border-white/30 backdrop-blur-sm"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-lg text-white/90 max-w-3xl leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Cover Image Fallback */}
        {!post.coverImage && (
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
            <div className="max-w-4xl mx-auto px-6">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri
              </Link>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">{post.category.name}</Badge>
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 border-x bg-white dark:bg-background dark:border-none mb-20">
          {/* Author & Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 py-12 border-b">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                <AvatarImage
                  src={post.author.image || undefined}
                  alt={post.author.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{post.author.name}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} dk okuma
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LikeButton
                postId={post.id}
                initialLiked={isLiked}
                initialCount={likeCount}
                currentUser={session?.user || null}
              />
              <ShareButton
                url={`${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`}
                title={post.title}
                text={post.excerpt}
              />
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg dark:prose-invert prose-enhanced max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:transition-colors">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                Etiketler
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <PostComments
            postId={post.id}
            currentUser={
              session?.user
                ? {
                    ...session.user,
                    image: session.user.image || null,
                    role: session.user.role as "USER" | "ADMIN",
                  }
                : null
            }
          />
        </div>
      </section>
    </>
  );
};

export default PostPage;
