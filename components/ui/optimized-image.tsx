"use client";

import { useState, useEffect } from "react";
import {
  getResponsiveImageSet,
  getModernImageFormats,
} from "@/lib/image-optimization";
import { useProgressiveImage } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  useCase?: "hero" | "thumbnail" | "gallery" | "avatar" | "content";
  priority?: boolean;
  enableLazyLoad?: boolean;
  enablePlaceholder?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  useCase = "content",
  priority = false,
  enableLazyLoad = true,
  enablePlaceholder = true,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate responsive image set
  const imageSet = getResponsiveImageSet(src, useCase, { width, height });
  const modernFormats = getModernImageFormats(src, { width, height });

  // Use progressive loading if lazy loading is enabled
  const {
    ref,
    src: currentSrc,
    isLoading,
    hasIntersected,
  } = useProgressiveImage(imageSet.placeholder || imageSet.src, imageSet.src, {
    skip: !enableLazyLoad || priority,
  });

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Preload critical images
  useEffect(() => {
    if (priority && typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = imageSet.src;
      document.head.appendChild(link);
    }
  }, [priority, imageSet.src]);

  // Don't render anything if lazy loading and not intersected
  if (enableLazyLoad && !priority && !hasIntersected) {
    return (
      <div
        ref={ref}
        className={cn("bg-muted animate-pulse", className)}
        style={{ width, height }}
      />
    );
  }

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground text-sm",
          className
        )}
        style={{ width, height }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {/* Modern format support with picture element */}
      <picture>
        {/* AVIF for modern browsers */}
        <source
          srcSet={modernFormats.avif}
          type="image/avif"
          sizes={imageSet.sizes}
        />

        {/* WebP for most browsers */}
        <source
          srcSet={modernFormats.webp}
          type="image/webp"
          sizes={imageSet.sizes}
        />

        {/* Fallback image */}
        <img
          src={enableLazyLoad && !priority ? currentSrc : imageSet.src}
          srcSet={enableLazyLoad && !priority ? undefined : imageSet.srcSet}
          sizes={imageSet.sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            isLoading && enablePlaceholder && "blur-sm"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>

      {/* Loading placeholder */}
      {!isLoaded && enablePlaceholder && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}

// Specialized image components for different use cases
export function HeroImage(
  props: Omit<OptimizedImageProps, "useCase" | "priority">
) {
  return <OptimizedImage {...props} useCase="hero" priority />;
}

export function ThumbnailImage(props: Omit<OptimizedImageProps, "useCase">) {
  return <OptimizedImage {...props} useCase="thumbnail" />;
}

export function GalleryImage(props: Omit<OptimizedImageProps, "useCase">) {
  return <OptimizedImage {...props} useCase="gallery" />;
}

export function AvatarImage(props: Omit<OptimizedImageProps, "useCase">) {
  return <OptimizedImage {...props} useCase="avatar" />;
}

export function ContentImage(props: Omit<OptimizedImageProps, "useCase">) {
  return <OptimizedImage {...props} useCase="content" />;
}
