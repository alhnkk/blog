"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationProgressProps {
  className?: string;
  height?: number;
  color?: string;
}

export function NavigationProgress({
  className,
  height = 3,
  color = "bg-primary",
}: NavigationProgressProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const startProgress = () => {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      let currentProgress = 0;
      progressTimer = setInterval(() => {
        currentProgress += Math.random() * 15 + 5;
        if (currentProgress < 90) {
          setProgress(currentProgress);
        } else {
          clearInterval(progressTimer);
          setProgress(90);
        }
      }, 100);
    };

    const completeProgress = () => {
      clearInterval(progressTimer);
      setProgress(100);

      hideTimer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    // Start progress when navigation begins
    startProgress();

    // Complete progress when navigation ends
    const timer = setTimeout(completeProgress, 100);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      className={cn("fixed top-0 left-0 right-0 z-50 bg-muted/20", className)}
      style={{ height: `${height}px` }}
    >
      <div
        className={cn("h-full transition-all ease-out", color)}
        style={{
          width: `${progress}%`,
          transition:
            progress === 100 ? "width 0.2s ease-out" : "width 0.1s ease-out",
        }}
      />
    </div>
  );
}
