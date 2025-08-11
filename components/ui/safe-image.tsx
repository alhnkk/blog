"use client";

import Image from "next/image";
import { useState } from "react";
import { getImageWithFallback } from "@/lib/utils/image";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  sizes,
  placeholder = "empty",
  blurDataURL,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(getImageWithFallback(src));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/images/placeholder.svg");
    }
  };

  const baseProps = {
    src: imgSrc,
    alt,
    className,
    priority,
    onError: handleError,
    placeholder,
    blurDataURL:
      placeholder === "blur"
        ? blurDataURL ||
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        : undefined,
  };

  const imageProps = fill
    ? {
        ...baseProps,
        fill: true,
        sizes,
      }
    : {
        ...baseProps,
        width: width!,
        height: height!,
      };

  return <Image {...imageProps} alt={alt} />;
}
