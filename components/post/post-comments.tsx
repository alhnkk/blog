import { Suspense } from "react";
import { CommentsSection } from "@/components/comments-section";
import { getCommentsByPost } from "@/lib/actions/comment";
import { Skeleton } from "@/components/ui/skeleton";

interface PostCommentsProps {
  postId: string;
  currentUser: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: "USER" | "ADMIN";
  } | null;
}

// Comments Loading Skeleton
function CommentsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
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
  );
}

// Async Comments Component
async function AsyncComments({ postId, currentUser }: PostCommentsProps) {
  const comments = await getCommentsByPost(postId);

  return (
    <CommentsSection
      postId={postId}
      currentUser={currentUser as any} // Type assertion for now
      initialComments={comments}
    />
  );
}

// Main Component with Suspense
export function PostComments({ postId, currentUser }: PostCommentsProps) {
  return (
    <div className="my-16 py-8 border-t">
      <Suspense fallback={<CommentsLoading />}>
        <AsyncComments postId={postId} currentUser={currentUser} />
      </Suspense>
    </div>
  );
}
