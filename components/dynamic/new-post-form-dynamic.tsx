"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for New Post Form
const NewPostFormSkeleton = () => (
  <div className="mx-auto p-6 space-y-8">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content skeleton */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title skeleton */}
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>

        {/* Excerpt skeleton */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-16" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-3 w-64 mt-2" />
          </CardContent>
        </Card>

        {/* Editor skeleton */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-16" />
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              {/* Toolbar skeleton */}
              <div className="border-b p-2">
                <div className="flex gap-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-8" />
                  ))}
                </div>
              </div>
              {/* Content skeleton */}
              <div className="min-h-[400px] p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar skeleton */}
      <div className="space-y-6">
        {/* Publish settings skeleton */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-32 mt-1" />
              </div>
              <Skeleton className="h-6 w-10" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </CardContent>
        </Card>

        {/* Cover image skeleton */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-3 w-40 mt-2" />
          </CardContent>
        </Card>

        {/* Categories skeleton */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Tags skeleton */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-16" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// Dynamic import with loading state
export const NewPostFormDynamic = dynamic(
  () =>
    import("@/components/admin/new-post-form").then((mod) => ({
      default: mod.NewPostForm,
    })),
  {
    loading: () => <NewPostFormSkeleton />,
    ssr: false,
  }
);
