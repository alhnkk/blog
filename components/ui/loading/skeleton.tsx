import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  lines = 1,
  ...props
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted";

  const variantClasses = {
    default: "rounded-md",
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              index === lines - 1 && "w-3/4", // Last line shorter
              className
            )}
            style={style}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      {...props}
    />
  );
}

// Pre-built skeleton components for common use cases
export function PostSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <Skeleton variant="text" width="60%" height={24} />
      <Skeleton variant="text" lines={3} />
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2">
          <Skeleton variant="text" width={120} height={16} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="space-y-3 p-4 border-l-2 border-muted">
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="space-y-1">
          <Skeleton variant="text" width={100} height={14} />
          <Skeleton variant="text" width={60} height={12} />
        </div>
      </div>
      <Skeleton variant="text" lines={2} />
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            variant="text"
            width="100%"
            height={20}
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              width="100%"
              height={16}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="60%" height={16} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-2">
            <Skeleton variant="text" width="70%" height={16} />
            <Skeleton variant="text" width="50%" height={24} />
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="border rounded-lg p-6">
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    </div>
  );
}
