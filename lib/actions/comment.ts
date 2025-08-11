"use server";

import { revalidatePath } from "next/cache";
import { prismadb as prisma } from "@/lib/prismadb";
import { requireAuth, requireAdmin } from "@/lib/auth/session";
import {
  createCommentSchema,
  updateCommentSchema,
  type CreateCommentData,
  type UpdateCommentData,
} from "@/lib/types/validation";
import type { ActionResult, CommentWithRelations } from "@/lib/types";

// Create a new comment
export async function createComment(
  data: CreateCommentData
): Promise<ActionResult<CommentWithRelations>> {
  try {
    const session = await requireAuth();

    // Validate input data
    const validatedData = createCommentSchema.parse(data);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
      select: { id: true, status: true },
    });

    if (!post) {
      return {
        success: false,
        error: "Post bulunamadı",
      };
    }

    // Only allow comments on published posts
    if (post.status !== "PUBLISHED") {
      return {
        success: false,
        error: "Bu yazıya yorum yapılamaz",
      };
    }

    // If parentId is provided, check if parent comment exists
    if (validatedData.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validatedData.parentId },
        select: { id: true, postId: true },
      });

      if (!parentComment) {
        return {
          success: false,
          error: "Yanıtlanacak yorum bulunamadı",
        };
      }

      // Ensure parent comment belongs to the same post
      if (parentComment.postId !== validatedData.postId) {
        return {
          success: false,
          error: "Geçersiz yorum yanıtı",
        };
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        authorId: session.user.id,
        postId: validatedData.postId,
        parentId: validatedData.parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    // Revalidate the post page
    revalidatePath(`/post/${post.id}`);
    revalidatePath("/");

    return {
      success: true,
      data: comment as any, // Type assertion for now
      message: "Yorum başarıyla eklendi",
    };
  } catch (error) {
    console.error("Create comment error:", error);
    return {
      success: false,
      error: "Yorum eklenirken bir hata oluştu",
    };
  }
}

// Update an existing comment
export async function updateComment(
  data: UpdateCommentData
): Promise<ActionResult<CommentWithRelations>> {
  try {
    const session = await requireAuth();

    // Validate input data
    const validatedData = updateCommentSchema.parse(data);

    // Check if comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id: validatedData.id },
      select: {
        id: true,
        authorId: true,
        postId: true,
        post: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!existingComment) {
      return {
        success: false,
        error: "Yorum bulunamadı",
      };
    }

    // Check if user owns the comment or is admin
    if (
      existingComment.authorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return {
        success: false,
        error: "Bu yorumu düzenleme yetkiniz yok",
      };
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: validatedData.id },
      data: {
        content: validatedData.content,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    // Revalidate the post page
    revalidatePath(`/post/${existingComment.post.slug}`);

    return {
      success: true,
      data: updatedComment as any, // Type assertion for now
      message: "Yorum başarıyla güncellendi",
    };
  } catch (error) {
    console.error("Update comment error:", error);
    return {
      success: false,
      error: "Yorum güncellenirken bir hata oluştu",
    };
  }
}

// Delete a comment
export async function deleteComment(commentId: string): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        postId: true,
        post: {
          select: {
            slug: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!existingComment) {
      return {
        success: false,
        error: "Yorum bulunamadı",
      };
    }

    // Check if user owns the comment or is admin
    if (
      existingComment.authorId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return {
        success: false,
        error: "Bu yorumu silme yetkiniz yok",
      };
    }

    // If comment has replies, we might want to handle this differently
    // For now, we'll delete the comment and all its replies (cascade delete)
    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Revalidate the post page
    revalidatePath(`/post/${existingComment.post.slug}`);

    return {
      success: true,
      message: "Yorum başarıyla silindi",
    };
  } catch (error) {
    console.error("Delete comment error:", error);
    return {
      success: false,
      error: "Yorum silinirken bir hata oluştu",
    };
  }
}

// Get comments for a specific post with simplified structure
export async function getCommentsByPost(
  postId: string
): Promise<CommentWithRelations[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only get top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                replies: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments as any; // Type assertion for now
  } catch (error) {
    console.error("Get comments error:", error);
    return [];
  }
}

// Get all comments for admin panel
export async function getAllComments(): Promise<
  ActionResult<CommentWithRelations[]>
> {
  try {
    await requireAdmin();

    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: comments as any, // Type assertion for now
    };
  } catch (error) {
    console.error("Get all comments error:", error);
    return {
      success: false,
      error: "Yorumlar yüklenirken bir hata oluştu",
    };
  }
}

// Admin: Delete comment (for admin panel)
export async function adminDeleteComment(
  commentId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        post: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!existingComment) {
      return {
        success: false,
        error: "Yorum bulunamadı",
      };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Revalidate relevant pages
    revalidatePath(`/post/${existingComment.post.slug}`);
    revalidatePath("/admin/comments");

    return {
      success: true,
      message: "Yorum başarıyla silindi",
    };
  } catch (error) {
    console.error("Admin delete comment error:", error);
    return {
      success: false,
      error: "Yorum silinirken bir hata oluştu",
    };
  }
}
// Admin: Bulk delete comments
export async function bulkDeleteComments(
  commentIds: string[]
): Promise<ActionResult<{ count: number }>> {
  try {
    await requireAdmin();

    if (commentIds.length === 0) {
      return {
        success: false,
        error: "Silinecek yorum seçilmedi",
      };
    }

    // Get post slugs for revalidation
    const comments = await prisma.comment.findMany({
      where: {
        id: {
          in: commentIds,
        },
      },
      select: {
        post: {
          select: {
            slug: true,
          },
        },
      },
    });

    const uniqueSlugs = [...new Set(comments.map((c) => c.post.slug))];

    // Delete comments
    const result = await prisma.comment.deleteMany({
      where: {
        id: {
          in: commentIds,
        },
      },
    });

    // Revalidate relevant pages
    uniqueSlugs.forEach((slug) => {
      revalidatePath(`/post/${slug}`);
    });
    revalidatePath("/admin/comments");

    return {
      success: true,
      data: { count: result.count },
      message: `${result.count} yorum başarıyla silindi`,
    };
  } catch (error) {
    console.error("Bulk delete comments error:", error);
    return {
      success: false,
      error: "Yorumlar silinirken bir hata oluştu",
    };
  }
}
