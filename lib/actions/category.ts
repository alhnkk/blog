"use server";

import { revalidatePath } from "next/cache";
import { prismadb } from "../prismadb";
import { requireAdmin } from "../auth/server";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli"),
  description: z.string().optional(),
});

const updateCategorySchema = categorySchema.extend({
  id: z.string(),
});

export async function createCategory(formData: FormData) {
  const session = await requireAdmin();

  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return { error: "Geçersiz veri", details: validatedFields.error.issues };
  }

  try {
    // Generate slug from name
    const { generateSlug, ensureUniqueSlug } = await import("../utils/slug");
    const baseSlug = generateSlug(validatedFields.data.name);
    const slug = await ensureUniqueSlug(baseSlug, "category");

    const category = await prismadb.category.create({
      data: {
        ...validatedFields.data,
        slug,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (error) {
    return { error: "Kategori oluşturulamadı" };
  }
}

export async function updateCategory(formData: FormData) {
  const session = await requireAdmin();

  const validatedFields = updateCategorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return { error: "Geçersiz veri" };
  }

  try {
    const category = await prismadb.category.update({
      where: { id: validatedFields.data.id },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
  } catch (error) {
    return { error: "Kategori güncellenemedi" };
  }
}

export async function deleteCategory(categoryId: string) {
  const session = await requireAdmin();

  try {
    await prismadb.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: "Kategori silinemedi" };
  }
}

export async function getCategories() {
  const categories = await prismadb.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const category = await prismadb.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: {
          post: {
            status: "PUBLISHED",
          },
        },
        include: {
          post: {
            include: {
              author: { select: { name: true, image: true } },
              categories: { include: { category: true } },
              tags: { include: { tag: true } },
              _count: { select: { comments: true } },
            },
          },
        },
      },
    },
  });

  return category;
}
