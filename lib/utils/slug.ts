export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Özel karakterleri kaldır
    .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
    .replace(/-+/g, "-") // Çoklu tireleri tek tire yap
    .trim();
}

export async function ensureUniqueSlug(
  slug: string,
  type: "post" | "category" | "tag" = "post",
  excludeId?: string
): Promise<string> {
  const { prismadb } = await import("../prismadb");

  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    let existing;

    switch (type) {
      case "post":
        existing = await prismadb.post.findFirst({
          where: {
            slug: uniqueSlug,
            ...(excludeId && { id: { not: excludeId } }),
          },
        });
        break;
      case "category":
        existing = await prismadb.category.findFirst({
          where: {
            slug: uniqueSlug,
            ...(excludeId && { id: { not: excludeId } }),
          },
        });
        break;
      case "tag":
        existing = await prismadb.tag.findFirst({
          where: {
            slug: uniqueSlug,
            ...(excludeId && { id: { not: excludeId } }),
          },
        });
        break;
    }

    if (!existing) {
      return uniqueSlug;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}
