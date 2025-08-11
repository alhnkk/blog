"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { togglePostLike } from "@/lib/actions/like";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  currentUser: any;
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  currentUser,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    if (!currentUser) {
      toast.error("Beğenmek için giriş yapmalısınız");
      return;
    }

    startTransition(async () => {
      // Optimistic update
      const newLiked = !isLiked;
      const newCount = newLiked ? likeCount + 1 : likeCount - 1;

      setIsLiked(newLiked);
      setLikeCount(newCount);

      try {
        const result = await togglePostLike(postId);

        if (!result.success) {
          // Revert optimistic update on error
          setIsLiked(!newLiked);
          setLikeCount(likeCount);
          toast.error(result.error || "Bir hata oluştu");
        } else {
          toast.success(result.liked ? "Post beğenildi!" : "Beğeni kaldırıldı");
        }
      } catch (error) {
        // Revert optimistic update on error
        setIsLiked(!newLiked);
        setLikeCount(likeCount);
        toast.error("Bir hata oluştu");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        "hover:bg-primary/10 hover:text-primary transition-colors",
        isLiked && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart
        className={cn("h-4 w-4 mr-1 transition-all", isLiked && "fill-current")}
      />
      <span className="hidden sm:inline">
        {isLiked ? "Beğenildi" : "Beğen"}
      </span>
      <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
        {likeCount}
      </span>
    </Button>
  );
}
