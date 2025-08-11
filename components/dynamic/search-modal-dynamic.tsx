"use client";

import dynamic from "next/dynamic";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for Search Modal
const SearchModalSkeleton = () => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[10vh]">
    <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4">
      <div className="px-6 py-4">
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Dynamic import with loading state
export const SearchModalDynamic = dynamic(
  () =>
    import("@/components/search-modal").then((mod) => ({
      default: mod.SearchModal,
    })),
  {
    loading: SearchModalSkeleton,
    ssr: false,
  }
);
