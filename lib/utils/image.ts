/**
 * Image utility functions for handling image URLs and fallbacks
 */

export function getImageWithFallback(imageUrl?: string | null): string {
  if (!imageUrl) {
    return "/images/placeholder.svg";
  }

  // ImageKit URL'lerini kontrol et
  if (imageUrl.includes("ik.imagekit.io")) {
    return imageUrl;
  }

  // Harici URL'ler için doğrudan döndür
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  // Relative path'ler için public klasöründen serve et
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  // Fallback
  return "/images/placeholder.svg";
}

export function optimizeImageUrl(
  imageUrl: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  if (!imageUrl) {
    return "/images/placeholder.svg";
  }

  // ImageKit URL'leri için transformation parametreleri ekle
  if (imageUrl.includes("ik.imagekit.io")) {
    const url = new URL(imageUrl);
    const params = new URLSearchParams();

    if (width) params.set("tr", `w-${width}`);
    if (height)
      params.set(
        "tr",
        `${params.get("tr") || ""}${params.get("tr") ? "," : ""}h-${height}`
      );
    params.set(
      "tr",
      `${params.get("tr") || ""}${params.get("tr") ? "," : ""}q-${quality}`
    );

    url.search = params.toString();
    return url.toString();
  }

  return imageUrl;
}

export function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
