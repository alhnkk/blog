"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "page_view",
            path: pathname,
          }),
        });
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    };

    trackPageView();
  }, [pathname]);

  const trackEvent = async (
    event: string,
    properties?: Record<string, unknown>
  ) => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          path: pathname,
          properties,
        }),
      });
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  };

  return { trackEvent };
}
