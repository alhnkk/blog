"use client";

import { useState, useRef, useEffect } from "react";
import { ResponsiveImage } from "./responsive-image";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  placeholder?: React.ReactNode;
  threshold?: number; // Intersection observer threshold
  rootMargin?: string; // Intersection observer root margin
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  quality = 75,
  sizes,
  fill = false,
  objectFit = "cover",
  placeholder,
  threshold = 0.1,
  rootMargin = "50px",
  onLoad,
  onError,
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  const defaultPlaceholder = (
    <div
      className={cn(
        "bg-muted animate-pulse flex items-center justify-center",
        className
      )}
      style={{ width, height }}
    >
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  );

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={!fill ? { width, height } : undefined}
    >
      {!isInView ? (
        placeholder || defaultPlaceholder
      ) : (
        <>
          {!isLoaded && (placeholder || defaultPlaceholder)}
          <ResponsiveImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            quality={quality}
            sizes={sizes}
            objectFit={objectFit}
            lazy={false} // We handle lazy loading ourselves
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleLoad}
            onError={handleError}
          />
        </>
      )}
    </div>
  );
}
