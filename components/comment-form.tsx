"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, X } from "lucide-react";
import { createComment } from "@/lib/actions/comment";
import { toast } from "sonner";
import type { User } from "@/lib/types";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  user: User;
  onCancel?: () => void;
  onSuccess?: () => void;
  placeholder?: string;
  className?: string;
}

export function CommentForm({
  postId,
  parentId,
  user,
  onCancel,
  onSuccess,
  placeholder = "Yorumunuzu yazın...",
  className,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Yorum içeriği boş olamaz");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createComment({
          content: content.trim(),
          postId,
          parentId,
        });

        if (result.success) {
          toast.success(result.message || "Yorum başarıyla eklendi");
          setContent("");
          onSuccess?.();
          // Don't refresh the entire page, let the parent component handle updates
        } else {
          toast.error(result.error || "Yorum eklenirken bir hata oluştu");
        }
      } catch (error) {
        console.error("Comment submission error:", error);
        toast.error("Beklenmeyen bir hata oluştu");
      }
    });
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  return (
    <div className={cn("", className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-primary/10">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="min-h-[120px] resize-none border-border/50 focus:border-primary transition-colors"
              disabled={isPending}
              maxLength={1000}
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                <span
                  className={cn(
                    "transition-colors",
                    content.length > 900 && "text-amber-600",
                    content.length > 950 && "text-red-600"
                  )}
                >
                  {content.length}
                </span>
                <span className="text-muted-foreground/60">/1000</span>
              </div>
              <div className="flex gap-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isPending}
                    className="hover:bg-muted"
                  >
                    <X className="h-4 w-4 mr-1" />
                    İptal
                  </Button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || !content.trim()}
                  className="px-6"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {parentId ? "Yanıtla" : "Yorum Yap"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
