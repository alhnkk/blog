// Enhanced image optimization utilities for ImageKit
interface ImageTransformation {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "maintain_ratio" | "force" | "at_least" | "at_max";
  focus?: "auto" | "face" | "center";
  blur?: number;
  progressive?: boolean;
  lossless?: boolean;
}

interface ResponsiveImageSet {
  src: string;
  srcSet: string;
  sizes: string;
  placeholder?: string;
}

interface ImageOptimizationOptions {
  baseUrl: string;
  transformations?: ImageTransformation;
  responsive?: {
    breakpoints: number[];
    sizes: string;
  };
  placeholder?: {
    enabled: boolean;
    blur?: number;
    quality?: number;
  };
  preload?: boolean;
  priority?: boolean;
}

export class ImageOptimizer {
  private baseUrl: string;
  private defaultTransformations: ImageTransformation;

  constructor(
    baseUrl: string,
    defaultTransformations: ImageTransformation = {}
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.defaultTransformations = {
      quality: 80,
      format: "auto",
      progressive: true,
      ...defaultTransformations,
    };
  }

  // Build ImageKit URL with transformations
  buildUrl(
    imagePath: string,
    transformations: ImageTransformation = {}
  ): string {
    const finalTransformations = {
      ...this.defaultTransformations,
      ...transformations,
    };
    const transformParams: string[] = [];

    // Add transformation parameters
    if (finalTransformations.width)
      transformParams.push(`w-${finalTransformations.width}`);
    if (finalTransformations.height)
      transformParams.push(`h-${finalTransformations.height}`);
    if (finalTransformations.quality)
      transformParams.push(`q-${finalTransformations.quality}`);
    if (finalTransformations.format)
      transformParams.push(`f-${finalTransformations.format}`);
    if (finalTransformations.crop)
      transformParams.push(`c-${finalTransformations.crop}`);
    if (finalTransformations.focus)
      transformParams.push(`fo-${finalTransformations.focus}`);
    if (finalTransformations.blur)
      transformParams.push(`bl-${finalTransformations.blur}`);
    if (finalTransformations.progressive) transformParams.push("pr-true");
    if (finalTransformations.lossless) transformParams.push("lo-true");

    const transformString =
      transformParams.length > 0 ? `tr:${transformParams.join(",")}` : "";
    const cleanImagePath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    return transformString
      ? `${this.baseUrl}/${transformString}/${cleanImagePath}`
      : `${this.baseUrl}/${cleanImagePath}`;
  }

  // Generate responsive image set
  generateResponsiveSet(
    imagePath: string,
    options: ImageOptimizationOptions
  ): ResponsiveImageSet {
    const { responsive, transformations = {}, placeholder } = options;

    if (!responsive) {
      const src = this.buildUrl(imagePath, transformations);
      return {
        src,
        srcSet: src,
        sizes: "100vw",
      };
    }

    const { breakpoints, sizes } = responsive;
    const srcSetEntries: string[] = [];

    // Generate images for each breakpoint
    breakpoints.forEach((width) => {
      const url = this.buildUrl(imagePath, {
        ...transformations,
        width,
        crop: "at_max", // Ensure image doesn't exceed specified width
      });
      srcSetEntries.push(`${url} ${width}w`);
    });

    // Generate placeholder if enabled
    let placeholderUrl: string | undefined;
    if (placeholder?.enabled) {
      placeholderUrl = this.buildUrl(imagePath, {
        width: 20,
        quality: placeholder.quality || 20,
        blur: placeholder.blur || 10,
        format: "webp",
      });
    }

    return {
      src: this.buildUrl(imagePath, {
        ...transformations,
        width: breakpoints[0],
      }),
      srcSet: srcSetEntries.join(", "),
      sizes,
      placeholder: placeholderUrl,
    };
  }

  // Generate critical image (for above-the-fold content)
  generateCriticalImage(
    imagePath: string,
    transformations: ImageTransformation = {}
  ): string {
    return this.buildUrl(imagePath, {
      ...transformations,
      quality: 90, // Higher quality for critical images
      format: "webp", // Modern format for better compression
      progressive: true,
    });
  }

  // Generate thumbnail
  generateThumbnail(
    imagePath: string,
    size: number = 150,
    transformations: ImageTransformation = {}
  ): string {
    return this.buildUrl(imagePath, {
      ...transformations,
      width: size,
      height: size,
      crop: "force",
      quality: 70,
      format: "webp",
    });
  }

  // Generate optimized image for different use cases
  generateOptimizedImage(
    imagePath: string,
    useCase: "hero" | "thumbnail" | "gallery" | "avatar" | "content",
    customTransformations: ImageTransformation = {}
  ): ResponsiveImageSet {
    const useCaseConfigs = {
      hero: {
        transformations: { quality: 85, format: "webp" as const },
        responsive: {
          breakpoints: [640, 768, 1024, 1280, 1920],
          sizes: "100vw",
        },
        placeholder: { enabled: true, blur: 15, quality: 20 },
      },
      thumbnail: {
        transformations: {
          quality: 70,
          format: "webp" as const,
          crop: "force" as const,
        },
        responsive: {
          breakpoints: [150, 300],
          sizes: "(max-width: 768px) 150px, 300px",
        },
        placeholder: { enabled: true, blur: 10, quality: 15 },
      },
      gallery: {
        transformations: { quality: 80, format: "webp" as const },
        responsive: {
          breakpoints: [400, 600, 800, 1200],
          sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        },
        placeholder: { enabled: true, blur: 12, quality: 20 },
      },
      avatar: {
        transformations: {
          quality: 75,
          format: "webp" as const,
          crop: "force" as const,
          focus: "face" as const,
        },
        responsive: {
          breakpoints: [40, 80, 120],
          sizes: "(max-width: 768px) 40px, 80px",
        },
        placeholder: { enabled: true, blur: 8, quality: 15 },
      },
      content: {
        transformations: { quality: 80, format: "auto" as const },
        responsive: {
          breakpoints: [480, 768, 1024],
          sizes: "(max-width: 768px) 100vw, 768px",
        },
        placeholder: { enabled: true, blur: 10, quality: 20 },
      },
    };

    const config = useCaseConfigs[useCase];
    const finalTransformations = {
      ...config.transformations,
      ...customTransformations,
    };

    return this.generateResponsiveSet(imagePath, {
      baseUrl: this.baseUrl,
      transformations: finalTransformations,
      responsive: config.responsive,
      placeholder: config.placeholder,
    });
  }
}

// Default ImageKit optimizer instance
export const imageOptimizer = new ImageOptimizer(
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
  {
    quality: 80,
    format: "auto",
    progressive: true,
  }
);

// Utility functions for common image operations
export function getOptimizedImageUrl(
  imagePath: string,
  transformations: ImageTransformation = {}
): string {
  return imageOptimizer.buildUrl(imagePath, transformations);
}

export function getResponsiveImageSet(
  imagePath: string,
  useCase: "hero" | "thumbnail" | "gallery" | "avatar" | "content" = "content",
  customTransformations: ImageTransformation = {}
): ResponsiveImageSet {
  return imageOptimizer.generateOptimizedImage(
    imagePath,
    useCase,
    customTransformations
  );
}

export function getCriticalImageUrl(
  imagePath: string,
  transformations: ImageTransformation = {}
): string {
  return imageOptimizer.generateCriticalImage(imagePath, transformations);
}

export function getThumbnailUrl(
  imagePath: string,
  size: number = 150,
  transformations: ImageTransformation = {}
): string {
  return imageOptimizer.generateThumbnail(imagePath, size, transformations);
}

// Preload critical images
export function preloadCriticalImages(imagePaths: string[]): void {
  if (typeof window === "undefined") return;

  imagePaths.forEach((imagePath) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = getCriticalImageUrl(imagePath);
    document.head.appendChild(link);
  });
}

// Generate WebP and AVIF variants for modern browsers
export function getModernImageFormats(
  imagePath: string,
  transformations: ImageTransformation = {}
) {
  return {
    avif: imageOptimizer.buildUrl(imagePath, {
      ...transformations,
      format: "avif",
    }),
    webp: imageOptimizer.buildUrl(imagePath, {
      ...transformations,
      format: "webp",
    }),
    fallback: imageOptimizer.buildUrl(imagePath, {
      ...transformations,
      format: "jpg",
    }),
  };
}
