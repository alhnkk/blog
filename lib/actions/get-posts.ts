// lib/actions/post.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prismadb } from "../prismadb";
import { createPostSchema, updatePostSchema } from "../validations/post";
import { requireAuth, requireAdmin } from "../auth/server";
import { PostStatus } from "../types";

export async function createPost(formData: FormData) {
  const session = await requireAdmin();

  // Parse categoryIds and tagIds from FormData
  const categoryIds = formData
    .getAll("categoryIds")
    .filter(Boolean) as string[];
  const tagIds = formData.getAll("tagIds").filter(Boolean) as string[];

  const coverImageValue = formData.get("coverImage");
  console.log("DEBUG - coverImage from form:", coverImageValue);

  const validatedFields = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    coverImage: coverImageValue,
    status: formData.get("status"),
    featured: formData.get("featured") === "true",
    publishedAt: formData.get("publishedAt")
      ? new Date(formData.get("publishedAt") as string)
      : undefined,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    tagIds: tagIds.length > 0 ? tagIds : undefined,
  });

  if (!validatedFields.success) {
    return { error: "Geçersiz veri", details: validatedFields.error.issues };
  }

  try {
    // Generate slug from title
    const { generateSlug, ensureUniqueSlug } = await import("../utils/slug");
    const baseSlug = generateSlug(validatedFields.data.title);
    const slug = await ensureUniqueSlug(baseSlug);

    // Check for duplicate posts by title and author to prevent double creation
    const existingPost = await prismadb.post.findFirst({
      where: {
        title: validatedFields.data.title,
        authorId: session.user.id,
      },
    });

    if (existingPost) {
      return {
        error:
          "Bu başlıkla zaten bir yazınız var. Lütfen farklı bir başlık kullanın.",
      };
    }

    // Additional check for recent submissions to prevent rapid double-clicking
    const recentPost = await prismadb.post.findFirst({
      where: {
        authorId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 3000), // Within last 3 seconds
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (recentPost && recentPost.title === validatedFields.data.title) {
      return { error: "Bu yazı zaten oluşturulmuş. Lütfen sayfayı yenileyin." };
    }

    const {
      categoryIds: postCategoryIds,
      tagIds: postTagIds,
      ...postData
    } = validatedFields.data;

    // Use transaction to ensure atomicity and prevent partial creation
    const post = await prismadb.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          ...postData,
          slug,
          authorId: session.user.id,
          publishedAt:
            validatedFields.data.status === "PUBLISHED"
              ? validatedFields.data.publishedAt || new Date()
              : validatedFields.data.publishedAt,
        },
      });

      // Add categories if provided
      if (postCategoryIds && postCategoryIds.length > 0) {
        await tx.postCategory.createMany({
          data: postCategoryIds.map((categoryId) => ({
            postId: newPost.id,
            categoryId,
          })),
        });
      }

      // Add tags if provided
      if (postTagIds && postTagIds.length > 0) {
        await tx.postTag.createMany({
          data: postTagIds.map((tagId) => ({
            postId: newPost.id,
            tagId,
          })),
        });
      }

      return newPost;
    });

    revalidatePath("/admin/posts");
    return { success: true, data: post };
  } catch (error: any) {
    console.error("Post creation error:", error);

    // Handle unique constraint violations
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("title")) {
        return {
          error:
            "Bu başlıkla zaten bir yazınız var. Lütfen farklı bir başlık kullanın.",
        };
      }
      if (error.meta?.target?.includes("slug")) {
        return {
          error: "Bu URL zaten kullanımda. Lütfen farklı bir başlık kullanın.",
        };
      }
    }

    return { error: "Post oluşturulamadı. Lütfen tekrar deneyin." };
  }
}

export async function updatePost(formData: FormData) {
  const session = await requireAdmin();

  const validatedFields = updatePostSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    coverImage: formData.get("coverImage"),
    status: formData.get("status"),
    featured: formData.get("featured") === "true",
    publishedAt: formData.get("publishedAt")
      ? new Date(formData.get("publishedAt") as string)
      : undefined,
  });

  if (!validatedFields.success) {
    return { error: "Geçersiz veri" };
  }

  try {
    const post = await prismadb.post.update({
      where: { id: validatedFields.data.id },
      data: validatedFields.data,
    });

    revalidatePath("/admin/posts");
    revalidatePath(`/posts/${post.slug}`);
    return { success: true, data: post };
  } catch (error) {
    return { error: "Post güncellenemedi" };
  }
}

export async function deletePost(postId: string) {
  const session = await requireAdmin();

  try {
    await prismadb.post.delete({
      where: { id: postId },
    });

    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { error: "Post silinemedi" };
  }
}

export async function togglePostStatus(postId: string, status: PostStatus) {
  const session = await requireAdmin();

  try {
    const post = await prismadb.post.update({
      where: { id: postId },
      data: {
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath(`/posts/${post.slug}`);
    return { success: true, data: post };
  } catch (error) {
    return { error: "Post durumu değiştirilemedi" };
  }
}

// lib/actions/post.ts (devamı)
export async function getPosts({
  page = 1,
  limit = 10,
  status,
  categoryId,
  tagId,
  search,
  orderBy = "createdAt",
  orderDirection = "desc",
}: {
  page?: number;
  limit?: number;
  status?: PostStatus;
  categoryId?: string;
  tagId?: string;
  search?: string;
  orderBy?: "createdAt" | "publishedAt" | "title";
  orderDirection?: "asc" | "desc";
}) {
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(categoryId && { categories: { some: { id: categoryId } } }),
    ...(tagId && { tags: { some: { id: tagId } } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as any } },
        { content: { contains: search, mode: "insensitive" as any } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    prismadb.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderBy]: orderDirection },
      include: {
        author: { select: { name: true, email: true } },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
        _count: { select: { comments: true } },
      },
    }),
    prismadb.post.count({ where }),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getAllPosts() {
  try {
    const posts = await prismadb.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, email: true } },
        categories: true,
        tags: true,
        _count: { select: { comments: true } },
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    return { success: false, error: "Postlar alınamadı" };
  }
}

export async function bulkDeletePosts(postIds: string[]) {
  try {
    await requireAdmin();

    if (postIds.length === 0) {
      return { error: "Silinecek post seçilmedi" };
    }

    await prismadb.post.deleteMany({
      where: {
        id: {
          in: postIds,
        },
      },
    });

    revalidatePath("/admin/posts");
    return { success: true, count: postIds.length };
  } catch (error) {
    console.error("Error bulk deleting posts:", error);
    return { error: "Postlar silinemedi" };
  }
}

export async function bulkUpdatePostStatus(
  postIds: string[],
  status: PostStatus
) {
  try {
    await requireAdmin();

    if (postIds.length === 0) {
      return { error: "Güncellenecek post seçilmedi" };
    }

    await prismadb.post.updateMany({
      where: {
        id: {
          in: postIds,
        },
      },
      data: {
        status,
        ...(status === "PUBLISHED" && { publishedAt: new Date() }),
      },
    });

    revalidatePath("/admin/posts");
    return { success: true, count: postIds.length };
  } catch (error) {
    console.error("Error bulk updating posts:", error);
    return { error: "Post durumları güncellenemedi" };
  }
}
