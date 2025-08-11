import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ServerAdminGuard } from "../../../../../lib/auth/admin-guard";
import { EditPostForm } from "../../../../../components/admin/edit-post-form";
import { Button } from "../../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prismadb } from "../../../../../lib/prismadb";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../../components/ui/card";
import { Skeleton } from "../../../../../components/ui/skeleton";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditPostPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
      return {
        title: "Post Bulunamadı | Admin Panel",
        description: "Aradığınız post bulunamadı veya erişim izniniz yok.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    return {
      title: `${post.title} - Düzenle | Admin Panel`,
      description: `"${
        post.title
      }" yazısını düzenleyin ve güncelleyin. Yazar: ${
        post.author.name || post.author.email
      }`,
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Hata | Admin Panel",
      description: "Post yüklenirken bir hata oluştu.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

async function getPost(id: string) {
  try {
    // Validate ID format
    if (!id || typeof id !== "string") {
      console.error("Invalid post ID format:", id);
      return null;
    }

    // Check if ID is a valid format (assuming UUID or similar)
    if (id.length < 10) {
      console.error("Post ID too short:", id);
      return null;
    }

    const post = await prismadb.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      console.error("Post not found with ID:", id);
      return null;
    }

    // Transform the data to match expected types
    return {
      ...post,
      categories: post.categories.map((pc) => pc.category),
      tags: post.tags.map((pt) => pt.tag),
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

function EditPostPageSkeleton() {
  return (
    <div className="container max-w-[1600px] mx-auto py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Yazılara Dön
          </Button>
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-background">
        <div className="mx-auto p-6 space-y-8">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Post Info Card */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
          </Card>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-16" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-16" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-96 w-full" />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-12 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Cover Image */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-16" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                </CardContent>
              </Card>

              {/* Dangerous Actions */}
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function EditPostContent({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container max-w-[1600px] mx-auto py-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Yazılara Dön
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yazı Düzenle</h1>
            <p className="text-muted-foreground mt-1">
              &quot;{post.title}&quot; yazısını düzenleyin ve güncelleyin.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1">
          <div className="text-sm text-muted-foreground">
            Son güncelleme:{" "}
            {new Date(post.updatedAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {post._count?.likes || 0} beğeni • {post._count?.comments || 0}{" "}
            yorum
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-background">
        <EditPostForm post={post} />
      </div>
    </div>
  );
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <ServerAdminGuard>
      <Suspense fallback={<EditPostPageSkeleton />}>
        <EditPostContent params={params} />
      </Suspense>
    </ServerAdminGuard>
  );
}
