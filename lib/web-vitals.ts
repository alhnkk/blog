// Simplified Web Vitals monitoring
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from "web-vitals";

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

// Simple Web Vitals hook
export function useWebVitals() {
  const reportMetric = (metric: Metric) => {
    // Simple console logging for development
    if (process.env.NODE_ENV === "development") {
      console.log(`${metric.name}: ${metric.value}`);
    }

    // Send to analytics in production
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined"
    ) {
      // Simple beacon API call
      navigator.sendBeacon?.(
        "/api/analytics/vitals",
        JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
        })
      );
    }
  };

  // Initialize Web Vitals monitoring
  if (typeof window !== "undefined") {
    onCLS(reportMetric);
    onINP(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  }
}

// Simple performance observer
export function observePerformance() {
  if (typeof window === "undefined") return;

  // Observe navigation timing
  if ("performance" in window && "getEntriesByType" in performance) {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        download: navigation.responseEnd - navigation.responseStart,
        domReady: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        load: navigation.loadEventEnd - navigation.fetchStart,
      };

      if (process.env.NODE_ENV === "development") {
        console.table(metrics);
      }
    }
  }
}
