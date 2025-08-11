"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { generateImageUrl } from "@/lib/imagekit-utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  lazy?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 80,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  objectFit = "cover",
  lazy = true,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // ImageKit URL'i optimize et
  const optimizedSrc = src.includes("ik.imagekit.io")
    ? generateImageUrl(src, [
        { name: "q", value: quality.toString() },
        { name: "f", value: "auto" }, // Format otomatik seçim
        { name: "pr", value: "true" }, // Progressive loading
        ...(width ? [{ name: "w", value: width.toString() }] : []),
        ...(height ? [{ name: "h", value: height.toString() }] : []),
      ])
    : src;

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width, height }}
        />
      )}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={lazy ? "lazy" : "eager"}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill && `object-${objectFit}`
        )}
        style={!fill && objectFit !== "cover" ? { objectFit } : undefined}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
