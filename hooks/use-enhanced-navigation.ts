import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface NavigationOptions {
  prefetch?: boolean;
  onStart?: (to: string) => void;
  onComplete?: (to: string) => void;
  onError?: (error: Error) => void;
}

export function useEnhancedNavigation(options: NavigationOptions = {}) {
  const router = useRouter();
  const { prefetch = true, onStart, onComplete, onError } = options;

  // Enhanced navigation function
  const navigate = useCallback(
    async (to: string, navigationOptions?: NavigationOptions) => {
      const opts = { ...options, ...navigationOptions };

      try {
        // Start navigation
        if (opts.onStart) opts.onStart(to);

        // Perform navigation
        router.push(to);

        // Complete navigation
        if (opts.onComplete) opts.onComplete(to);
      } catch (error) {
        if (opts.onError) opts.onError(error as Error);
        console.error("Navigation error:", error);
      }
    },
    [router, options]
  );

  // Enhanced back navigation
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  // Enhanced forward navigation
  const goForward = useCallback(() => {
    router.forward();
  }, [router]);

  // Prefetch route
  const prefetchRoute = useCallback(
    (href: string) => {
      if (prefetch) {
        router.prefetch(href);
      }
    },
    [router, prefetch]
  );

  return {
    navigate,
    goBack,
    goForward,
    prefetchRoute,
  };
}

// Hook for route-specific navigation enhancements
export function useRouteNavigation(currentRoute: string) {
  const { navigate, prefetchRoute } = useEnhancedNavigation();

  return { navigate, prefetchRoute };
}
