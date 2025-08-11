import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
}

export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = "0px",
    triggerOnce = true,
    skip = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || skip) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce, skip, hasIntersected]);

  return {
    ref: elementRef,
    isIntersecting,
    hasIntersected,
  };
}

// Hook for lazy loading components when they enter viewport
export function useLazyLoad<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const { ref, hasIntersected } = useIntersectionObserver<T>({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px", // Start loading 100px before element is visible
    ...options,
  });

  return {
    ref,
    shouldLoad: hasIntersected,
  };
}

// Hook for progressive image loading
export function useProgressiveImage(
  lowQualitySrc: string,
  highQualitySrc: string,
  options: UseIntersectionObserverOptions = {}
) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "200px",
    ...options,
  });

  useEffect(() => {
    if (!hasIntersected) return;

    setIsLoading(true);
    const img = new Image();

    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsLoading(false);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setIsLoading(false);
      // Keep low quality image on error
    };

    img.src = highQualitySrc;
  }, [hasIntersected, highQualitySrc]);

  return {
    ref,
    src: currentSrc,
    isLoading,
    isLoaded,
    hasIntersected,
  };
}

// Hook for infinite scrolling
export function useInfiniteScroll<T extends Element = HTMLDivElement>(
  onLoadMore: () => void | Promise<void>,
  options: UseIntersectionObserverOptions & {
    hasNextPage?: boolean;
    isLoading?: boolean;
  } = {}
) {
  const {
    hasNextPage = true,
    isLoading = false,
    ...intersectionOptions
  } = options;
  const { ref, isIntersecting } = useIntersectionObserver<T>({
    threshold: 1.0,
    rootMargin: "100px",
    triggerOnce: false,
    ...intersectionOptions,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isLoading) {
      onLoadMore();
    }
  }, [isIntersecting, hasNextPage, isLoading, onLoadMore]);

  return {
    ref,
    isIntersecting,
  };
}
