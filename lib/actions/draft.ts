"use server";

import { revalidatePath } from "next/cache";
import { prismadb } from "../prismadb";
import { requireAuth } from "../auth/server";
import type { Post } from "@prisma/client";

export interface DraftData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  categoryIds?: string[];
  tagIds?: string[];
}

export async function saveDraft(postId: string | null, data: DraftData) {
  const session = await requireAuth();

  try {
    const { categoryIds, tagIds, ...postData } = data;

    let post: Post;

    if (postId) {
      // Update existing draft
      post = await prismadb.post.update({
        where: { id: postId },
        data: {
          ...postData,
          status: "DRAFT",
          updatedAt: new Date(),
        },
      });

      // Update categories if provided
      if (categoryIds) {
        await prismadb.postCategory.deleteMany({
          where: { postId: post.id },
        });

        if (categoryIds.length > 0) {
          await prismadb.postCategory.createMany({
            data: categoryIds.map((categoryId) => ({
              postId: post.id,
              categoryId,
            })),
          });
        }
      }

      // Update tags if provided
      if (tagIds) {
        await prismadb.postTag.deleteMany({
          where: { postId: post.id },
        });

        if (tagIds.length > 0) {
          await prismadb.postTag.createMany({
            data: tagIds.map((tagId) => ({
              postId: post.id,
              tagId,
            })),
          });
        }
      }
    } else {
      // Create new draft
      const { generateSlug, ensureUniqueSlug } = await import("../utils/slug");
      const baseSlug = generateSlug(data.title || "untitled-draft");
      const slug = await ensureUniqueSlug(baseSlug);

      post = await prismadb.post.create({
        data: {
          ...postData,
          slug,
          authorId: session.user.id,
          status: "DRAFT",
        },
      });

      // Add categories if provided
      if (categoryIds && categoryIds.length > 0) {
        await prismadb.postCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            postId: post.id,
            categoryId,
          })),
        });
      }

      // Add tags if provided
      if (tagIds && tagIds.length > 0) {
        await prismadb.postTag.createMany({
          data: tagIds.map((tagId) => ({
            postId: post.id,
            tagId,
          })),
        });
      }
    }

    revalidatePath("/admin/posts");
    return { success: true, data: post };
  } catch (error) {
    console.error("Draft save error:", error);
    return { error: "Taslak kaydedilemedi" };
  }
}

export async function getDraft(postId: string) {
  const session = await requireAuth();

  try {
    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
        authorId: session.user.id, // Ensure user can only access their own drafts
      },
      include: {
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
      },
    });

    if (!post) {
      return { error: "Taslak bulunamadı" };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error("Draft fetch error:", error);
    return { error: "Taslak alınamadı" };
  }
}

export async function deleteDraft(postId: string) {
  const session = await requireAuth();

  try {
    const post = await prismadb.post.findUnique({
      where: { id: postId },
      select: { authorId: true, status: true },
    });

    if (!post) {
      return { error: "Taslak bulunamadı" };
    }

    if (post.authorId !== session.user.id) {
      return { error: "Bu taslağı silme yetkiniz yok" };
    }

    if (post.status !== "DRAFT") {
      return { error: "Sadece taslaklar silinebilir" };
    }

    await prismadb.post.delete({
      where: { id: postId },
    });

    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    console.error("Draft delete error:", error);
    return { error: "Taslak silinemedi" };
  }
}

export async function getUserDrafts() {
  const session = await requireAuth();

  try {
    const drafts = await prismadb.post.findMany({
      where: {
        authorId: session.user.id,
        status: "DRAFT",
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    return { success: true, data: drafts };
  } catch (error) {
    console.error("Drafts fetch error:", error);
    return { error: "Taslaklar alınamadı" };
  }
}
