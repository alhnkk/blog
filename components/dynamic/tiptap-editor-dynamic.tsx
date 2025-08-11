"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for TipTap Editor
const TiptapEditorSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    {/* Toolbar skeleton */}
    <div className="border-b bg-muted/30 p-2">
      <div className="flex flex-wrap items-center gap-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8" />
        ))}
      </div>
    </div>
    {/* Editor content skeleton */}
    <div className="min-h-[300px] p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

// Dynamic import with loading state
export const TiptapEditorDynamic = dynamic(
  () =>
    import("@/components/ui/tiptap-editor").then((mod) => ({
      default: mod.TiptapEditor,
    })),
  {
    loading: () => <TiptapEditorSkeleton />,
    ssr: false,
  }
);
