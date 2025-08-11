// ImageKit custom loader for Next.js Image component
export default function imageKitLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Handle local images (starting with /)
  if (src.startsWith("/") && !src.includes("ik.imagekit.io")) {
    // For local images, just return the src as-is
    // Next.js will handle them with the default loader
    return src;
  }

  // Eğer ImageKit URL'i değilse, normal URL döndür
  if (!src.includes("ik.imagekit.io")) {
    return src;
  }

  // ImageKit transformation parametreleri
  const transformations = [];

  if (width) {
    transformations.push(`w-${width}`);
  }

  if (quality) {
    transformations.push(`q-${quality}`);
  } else {
    transformations.push("q-80");
  }

  // Format optimization
  transformations.push("f-webp");

  // Transformations'ı birleştir
  const trParam = transformations.join(",");
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}tr=${trParam}`;
}
