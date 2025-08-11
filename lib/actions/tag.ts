"use server";

import { revalidatePath } from "next/cache";
import { prismadb } from "../prismadb";
import { requireAdmin } from "../auth/server";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1, "Etiket adı gerekli"),
});

const updateTagSchema = tagSchema.extend({
  id: z.string(),
});

export async function createTag(formData: FormData) {
  const session = await requireAdmin();

  const validatedFields = tagSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return { error: "Geçersiz veri", details: validatedFields.error.issues };
  }

  try {
    // Generate slug from name
    const { generateSlug, ensureUniqueSlug } = await import("../utils/slug");
    const baseSlug = generateSlug(validatedFields.data.name);
    const slug = await ensureUniqueSlug(baseSlug, "tag");

    const tag = await prismadb.tag.create({
      data: {
        ...validatedFields.data,
        slug,
      },
    });

    revalidatePath("/admin/tags");
    return { success: true, data: tag };
  } catch (error) {
    return { error: "Etiket oluşturulamadı" };
  }
}

export async function updateTag(formData: FormData) {
  const session = await requireAdmin();

  const validatedFields = updateTagSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return { error: "Geçersiz veri" };
  }

  try {
    const tag = await prismadb.tag.update({
      where: { id: validatedFields.data.id },
      data: {
        name: validatedFields.data.name,
      },
    });

    revalidatePath("/admin/tags");
    return { success: true, data: tag };
  } catch (error) {
    return { error: "Etiket güncellenemedi" };
  }
}

export async function deleteTag(tagId: string) {
  const session = await requireAdmin();

  try {
    await prismadb.tag.delete({
      where: { id: tagId },
    });

    revalidatePath("/admin/tags");
    return { success: true };
  } catch (error) {
    return { error: "Etiket silinemedi" };
  }
}

export async function getTags() {
  const tags = await prismadb.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return tags;
}

export async function getTagBySlug(slug: string) {
  const tag = await prismadb.tag.findUnique({
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

  return tag;
}

export async function getPopularTags(limit: number = 10) {
  const tags = await prismadb.tag.findMany({
    take: limit,
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return tags;
}
