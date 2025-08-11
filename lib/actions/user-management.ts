"use server";

import { prismadb } from "@/lib/prismadb";
import { requireAdmin } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  try {
    // Check admin permissions first
    await requireAdmin();

    // Validate database connection
    if (!prismadb) {
      throw new Error("Database connection not available");
    }

    const users = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Validate the response
    if (!Array.isArray(users)) {
      throw new Error("Invalid response from database");
    }

    return {
      success: true,
      data: users,
      count: users.length,
    };
  } catch (error) {
    console.error("Error fetching users:", error);

    // Provide more specific error messages
    let errorMessage = "Kullanıcılar yüklenemedi";

    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        errorMessage = "Bu işlem için yetkiniz bulunmuyor";
      } else if (error.message.includes("connection")) {
        errorMessage = "Veritabanı bağlantısı kurulamadı";
      } else if (error.message.includes("timeout")) {
        errorMessage = "İstek zaman aşımına uğradı";
      }
    }

    return {
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error : undefined,
    };
  }
}

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  try {
    await requireAdmin();

    const updatedUser = await prismadb.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error: "Kullanıcı rolü güncellenemedi",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    await requireAdmin();

    // Kullanıcının yazılarını ve yorumlarını kontrol et
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Kullanıcı bulunamadı",
      };
    }

    // Eğer kullanıcının yazıları varsa silmeyi engelle
    if (user._count.posts > 0) {
      return {
        success: false,
        error:
          "Bu kullanıcının yazıları var. Önce yazıları silin veya başka bir kullanıcıya atayın.",
      };
    }

    // Kullanıcının yorumlarını sil
    await prismadb.comment.deleteMany({
      where: { authorId: userId },
    });

    // Kullanıcıyı sil
    await prismadb.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: "Kullanıcı silinemedi",
    };
  }
}
