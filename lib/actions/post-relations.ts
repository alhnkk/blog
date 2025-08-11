"use server";

import { revalidatePath } from "next/cache";
import { prismadb } from "../prismadb";
import { requireAdmin } from "../auth/server";

export async function addPostCategory(postId: string, categoryId: string) {
  const session = await requireAdmin();

  try {
    await prismadb.postCategory.create({
      data: {
        postId,
        categoryId,
      },
    });

    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { error: "Kategori eklenemedi" };
  }
}

export async function removePostCategory(postId: string, categoryId: string) {
  const session = await requireAdmin();

  try {
    await prismadb.postCategory.deleteMany({
      where: {
        postId,
        categoryId,
      },
    });

    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { error: "Kategori kaldırılamadı" };
  }
}

export async function updatePostCategories(
  postId: string,
  categoryIds: string[]
) {
  const session = await requireAdmin();

  try {
    // Önce mevcut kategorileri sil
    await prismadb.postCategory.deleteMany({
      where: { postId },
    });

    // Yeni kategorileri ekle
    if (categoryIds.length > 0) {
      await prismadb.postCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          postId,
          categoryId,
        })),
      });
    }

    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { error: "Kategoriler güncellenemedi" };
  }
}

export async function addPostTag(postId: string, tagId: string) {
  const session = await requireAdmin();

  try {
    await prismadb.postTag.create({
      data: {
        postId,
        tagId,
      },
    });

    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { error: "Etiket eklenemedi" };
  }
}

export async function removePostTag(postId: string, tagId: string) {
  const session = await requireAdmin();

  try {
    await prismadb.postTag.deleteMany({
      where: {
        postId,
        tagId,
      },
    });

    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { error: "Etiket kaldırılamadı" };
  }
}

export async function updatePostTags(postId: string, tagIds: string[]) {
  const session = await requireAdmin();

  try {
    // Önce mevcut etiketleri sil
    await prismadb.postTag.deleteMany({
      where: { postId },
    });

    // Yeni etiketleri ekle
    if (tagIds.length > 0) {
      await prismadb.postTag.createMany({
        data: tagIds.map((tagId) => ({
          postId,
          tagId,
        })),
      });
    }

    revalidatePath("/admin/posts");
    return { success: true };
  } catch (error) {
    return { error: "Etiketler güncellenemedi" };
  }
}
