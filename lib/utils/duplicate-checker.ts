"use server";

import { prismadb } from "../prismadb";
import { requireAdmin } from "../auth/server";

export async function findDuplicatePosts() {
  await requireAdmin();
  try {
    // Aynı slug'a sahip postları bul
    const duplicatesBySlug = await prismadb.post.groupBy({
      by: ["slug"],
      having: {
        slug: {
          _count: {
            gt: 1,
          },
        },
      },
      _count: {
        slug: true,
      },
    });

    // Aynı başlık ve içeriğe sahip postları bul
    const duplicatesByContent = await prismadb.post.groupBy({
      by: ["title", "content"],
      having: {
        title: {
          _count: {
            gt: 1,
          },
        },
      },
      _count: {
        title: true,
      },
    });

    return {
      duplicatesBySlug,
      duplicatesByContent,
    };
  } catch (error) {
    console.error("Duplicate post kontrolü sırasında hata:", error);
    return {
      duplicatesBySlug: [],
      duplicatesByContent: [],
    };
  }
}

export async function removeDuplicatePosts() {
  await requireAdmin();

  try {
    // Aynı slug'a sahip postları bul
    const duplicateSlugs = await prismadb.post.groupBy({
      by: ["slug"],
      having: {
        slug: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    let removedCount = 0;

    for (const duplicate of duplicateSlugs) {
      // Bu slug'a sahip tüm postları getir
      const posts = await prismadb.post.findMany({
        where: { slug: duplicate.slug },
        orderBy: { createdAt: "asc" }, // En eski olanı koru
      });

      if (posts.length > 1) {
        // İlk post hariç diğerlerini sil
        const postsToDelete = posts.slice(1);

        for (const post of postsToDelete) {
          await prismadb.post.delete({
            where: { id: post.id },
          });
          removedCount++;
        }
      }
    }

    return {
      success: true,
      removedCount,
    };
  } catch (error) {
    console.error("Duplicate post silme sırasında hata:", error);
    return {
      success: false,
      error: "Duplicate postlar silinemedi",
    };
  }
}
