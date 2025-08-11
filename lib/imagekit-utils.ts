import { buildSrc } from "@imagekit/next";

// ImageKit URL endpoint'i environment variable'dan al
const IMAGEKIT_URL_ENDPOINT =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
  "https://ik.imagekit.io/your_imagekit_id";

/**
 * ImageKit URL'i oluşturur
 */
export const generateImageUrl = (
  src: string,
  transformations: any[] = []
): string => {
  return buildSrc({
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    src,
    transformation: transformations,
  });
};

/**
 * Thumbnail URL'i oluşturur
 */
export const generateThumbnail = (
  src: string,
  width = 300,
  height = 200,
  quality = 70
): string => {
  return generateImageUrl(src, [
    {
      width,
      height,
      crop: "maintain_ratio",
      quality,
      format: "webp",
    },
  ]);
};

/**
 * Avatar URL'i oluşturur (kare, yuvarlak)
 */
export const generateAvatar = (
  src: string,
  size = 40,
  quality = 80
): string => {
  return generateImageUrl(src, [
    {
      width: size,
      height: size,
      crop: "force",
      quality,
      format: "webp",
      radius: "max", // Yuvarlak yapar
    },
  ]);
};

/**
 * Blog post cover image URL'i oluşturur
 */
export const generatePostCover = (
  src: string,
  width = 1200,
  height = 630,
  quality = 85
): string => {
  return generateImageUrl(src, [
    {
      width,
      height,
      crop: "maintain_ratio",
      quality,
      format: "webp",
    },
  ]);
};

/**
 * Responsive image için farklı boyutlarda URL'ler oluşturur
 */
export const generateResponsiveUrls = (
  src: string,
  sizes: number[] = [400, 800, 1200],
  quality = 80
): { [key: number]: string } => {
  const urls: { [key: number]: string } = {};

  sizes.forEach((size) => {
    urls[size] = generateImageUrl(src, [
      {
        width: size,
        quality,
        format: "webp",
      },
    ]);
  });

  return urls;
};

/**
 * Placeholder (blur) image URL'i oluşturur
 */
export const generatePlaceholder = (
  src: string,
  width = 20,
  height = 20
): string => {
  return generateImageUrl(src, [
    {
      width,
      height,
      quality: 10,
      blur: 90,
      format: "webp",
    },
  ]);
};

/**
 * Image optimizasyonu için genel ayarlar
 */
export const getOptimizedImageUrl = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "avif";
    crop?: "maintain_ratio" | "force";
  } = {}
): string => {
  const {
    width,
    height,
    quality = 80,
    format = "auto",
    crop = "maintain_ratio",
  } = options;

  const transformations: any[] = [
    {
      quality,
      format,
    },
  ];

  if (width || height) {
    transformations[0] = {
      ...transformations[0],
      width,
      height,
      crop,
    };
  }

  return generateImageUrl(src, transformations);
};

/**
 * ImageKit dosya ID'sinden URL oluşturur
 */
export const getImageUrlFromFileId = (fileId: string): string => {
  return `${IMAGEKIT_URL_ENDPOINT}/${fileId}`;
};

/**
 * URL'den ImageKit dosya path'ini çıkarır
 */
export const extractImagePath = (url: string): string => {
  return url.replace(IMAGEKIT_URL_ENDPOINT, "");
};

/**
 * Responsive image sizes için ImageKit URL'leri oluşturur
 */
export const generateResponsiveSizes = (
  src: string,
  sizes: Array<{ width: number; quality?: number }>
): string => {
  return sizes
    .map(({ width, quality = 80 }) => {
      const url = generateImageUrl(src, [
        { name: "w", value: width.toString() },
        { name: "q", value: quality.toString() },
        { name: "f", value: "auto" },
      ]);
      return `${url} ${width}w`;
    })
    .join(", ");
};

/**
 * Cover image için optimize edilmiş URL oluşturur
 */
export const generateCoverImageUrl = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    aspectRatio?: "16:9" | "4:3" | "1:1" | "3:2";
  } = {}
): string => {
  const { width = 1200, height, quality = 85, aspectRatio } = options;

  const transformations: Array<{ name: string; value: string }> = [
    { name: "w", value: width.toString() },
    { name: "q", value: quality.toString() },
    { name: "f", value: "auto" },
    { name: "pr", value: "true" }, // Progressive loading
  ];

  // Aspect ratio'ya göre height hesapla
  if (aspectRatio && !height) {
    const ratios = {
      "16:9": width * (9 / 16),
      "4:3": width * (3 / 4),
      "1:1": width,
      "3:2": width * (2 / 3),
    };
    transformations.push({
      name: "h",
      value: Math.round(ratios[aspectRatio]).toString(),
    });
    transformations.push({ name: "c", value: "maintain_ratio" });
  } else if (height) {
    transformations.push({ name: "h", value: height.toString() });
    transformations.push({ name: "c", value: "maintain_ratio" });
  }

  return generateImageUrl(src, transformations);
};

/**
 * Thumbnail için optimize edilmiş URL oluşturur
 */
export const generateThumbnailUrl = (
  src: string,
  size: number = 300,
  quality: number = 70
): string => {
  return generateImageUrl(src, [
    { name: "w", value: size.toString() },
    { name: "h", value: size.toString() },
    { name: "c", value: "maintain_ratio" },
    { name: "q", value: quality.toString() },
    { name: "f", value: "auto" },
  ]);
};

/**
 * Blur placeholder için düşük kaliteli URL oluşturur
 */
export const generateBlurPlaceholder = (src: string): string => {
  return generateImageUrl(src, [
    { name: "w", value: "20" },
    { name: "q", value: "10" },
    { name: "bl", value: "6" }, // Blur effect
    { name: "f", value: "auto" },
  ]);
};

/**
 * Image metadata'sını ImageKit API'den alır
 */
export const getImageMetadata = async (fileId: string) => {
  try {
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.IMAGEKIT_PRIVATE_KEY + ":"
        ).toString("base64")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image metadata: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching image metadata:", error);
    return null;
  }
};
