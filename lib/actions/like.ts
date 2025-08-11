"use server";

import { prismadb } from "@/lib/prismadb";
import { getServerSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function togglePostLike(postId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Beğenmek için giriş yapmalısınız" };
    }

    // Check if user already liked this post
    const existingLike = await prismadb.postLike.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      // Unlike the post
      await prismadb.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      revalidatePath(`/posts/${postId}`);
      return { success: true, liked: false };
    } else {
      // Like the post
      await prismadb.postLike.create({
        data: {
          userId: session.user.id,
          postId: postId,
        },
      });

      revalidatePath(`/posts/${postId}`);
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling post like:", error);
    return { success: false, error: "Bir hata oluştu" };
  }
}

export async function getPostLikeStatus(postId: string, userId?: string) {
  try {
    if (!userId) {
      return { isLiked: false, likeCount: 0 };
    }

    const [like, likeCount] = await Promise.all([
      prismadb.postLike.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      }),
      prismadb.postLike.count({
        where: {
          postId: postId,
        },
      }),
    ]);

    return {
      isLiked: !!like,
      likeCount: likeCount,
    };
  } catch (error) {
    console.error("Error getting post like status:", error);
    return { isLiked: false, likeCount: 0 };
  }
}
