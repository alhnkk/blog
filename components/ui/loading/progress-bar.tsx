"use client";

import { cn } from "@/lib/utils";
import { useNavigationLoading } from "@/lib/stores/loading-store";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  className?: string;
  height?: number;
  color?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  className,
  height = 3,
  color = "bg-primary",
  showPercentage = false,
}: ProgressBarProps) {
  const { isNavigating, navigationProgress } = useNavigationLoading();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      setVisible(true);
    } else {
      // Hide immediately when navigation completes
      const timer = setTimeout(() => setVisible(false), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isNavigating]);

  if (!visible) return null;

  return (
    <div
      className={cn("fixed top-0 left-0 right-0 z-50 bg-muted/20", className)}
      style={{ height: `${height}px` }}
    >
      <div
        className={cn("h-full transition-all ease-out", color)}
        style={{
          width: `${navigationProgress}%`,
          transition:
            navigationProgress === 100
              ? "width 0.2s ease-out, opacity 0.1s ease-out 0.2s"
              : "width 0.15s ease-out",
          opacity: navigationProgress === 100 && !isNavigating ? 0 : 1,
        }}
      />

      {showPercentage && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-muted-foreground">
          {Math.round(navigationProgress)}%
        </div>
      )}
    </div>
  );
}

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  blur?: boolean;
}

export function LoadingOverlay({
  isLoading,
  message = "Loading...",
  children,
  blur = true,
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      <div
        className={cn(
          isLoading && blur && "blur-sm transition-all duration-200"
        )}
      >
        {children}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface PulseLoaderProps {
  count?: number;
  size?: number;
  color?: string;
  className?: string;
}

export function PulseLoader({
  count = 3,
  size = 8,
  color = "bg-primary",
  className,
}: PulseLoaderProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn("rounded-full animate-pulse", color)}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${index * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
}
