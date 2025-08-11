import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PostLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Button
              variant="secondary"
              size="sm"
              className="backdrop-blur-sm bg-white/10 border-white/20 text-white"
              disabled
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </div>

          {/* Title Overlay Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-6 w-20 bg-white/20" />
                <Skeleton className="h-6 w-16 bg-white/20" />
                <Skeleton className="h-6 w-24 bg-white/20" />
              </div>
              <Skeleton className="h-12 w-3/4 mb-4 bg-white/20" />
              <Skeleton className="h-6 w-2/3 bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content Skeleton */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* Author & Meta Info Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-8 border-b">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Article Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <div className="py-4">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>

          {/* Tags Skeleton */}
          <div className="mt-12 pt-8 border-t">
            <Skeleton className="h-4 w-16 mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-18" />
            </div>
          </div>

          {/* Comments Section Skeleton */}
          <div className="mt-16 pt-8 border-t">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
