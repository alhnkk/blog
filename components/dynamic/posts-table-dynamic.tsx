"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for Posts Table
const PostsTableSkeleton = () => (
  <div className="space-y-4">
    {/* Filters skeleton */}
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>

    {/* Table skeleton */}
    <Card>
      <CardContent className="p-0">
        <div className="border rounded-md">
          {/* Table header */}
          <div className="border-b p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b p-4 last:border-b-0">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Pagination skeleton */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  </div>
);

// Dynamic import with loading state
export const PostsTableWithBulkDynamic = dynamic(
  () =>
    import("@/components/admin/posts-table-with-bulk").then((mod) => ({
      default: mod.PostsTableWithBulk,
    })),
  {
    loading: () => <PostsTableSkeleton />,
    ssr: false,
  }
);
