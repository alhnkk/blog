import { Suspense } from "react";
import {
  Skeleton,
  PostSkeleton,
  CommentSkeleton,
  TableSkeleton,
  DashboardSkeleton,
} from "@/components/ui/loading/skeleton";
import { Spinner } from "@/components/ui/loading/progress-bar";

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variant?: "default" | "post" | "comment" | "table" | "dashboard" | "minimal";
  className?: string;
}

export function SuspenseBoundary({
  children,
  fallback,
  variant = "default",
  className,
}: SuspenseBoundaryProps) {
  const getFallback = () => {
    if (fallback) return fallback;

    switch (variant) {
      case "post":
        return <PostSkeleton />;
      case "comment":
        return <CommentSkeleton />;
      case "table":
        return <TableSkeleton />;
      case "dashboard":
        return <DashboardSkeleton />;
      case "minimal":
        return (
          <div className="flex items-center justify-center p-8">
            <Spinner size="md" />
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <Skeleton variant="text" lines={3} />
            <Skeleton variant="rectangular" height={200} />
          </div>
        );
    }
  };

  return (
    <div className={className}>
      <Suspense fallback={getFallback()}>{children}</Suspense>
    </div>
  );
}

// Route-level suspense boundaries
export function RouteSuspenseBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuspenseBoundary
      variant="default"
      className="min-h-screen"
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="text" lines={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      {children}
    </SuspenseBoundary>
  );
}

// Component-specific suspense boundaries
export function BlogListSuspense({ children }: { children: React.ReactNode }) {
  return (
    <SuspenseBoundary
      fallback={
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      }
    >
      {children}
    </SuspenseBoundary>
  );
}

export function CommentsSuspense({ children }: { children: React.ReactNode }) {
  return (
    <SuspenseBoundary
      fallback={
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </div>
      }
    >
      {children}
    </SuspenseBoundary>
  );
}

export function AdminTableSuspense({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuspenseBoundary variant="table">{children}</SuspenseBoundary>;
}

export function DashboardSuspense({ children }: { children: React.ReactNode }) {
  return <SuspenseBoundary variant="dashboard">{children}</SuspenseBoundary>;
}
