"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Reply,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Shield,
} from "lucide-react";
import { CommentForm } from "./comment-form";
import { deleteComment } from "@/lib/actions/comment";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CommentWithRelations, User } from "@/lib/types";

interface CommentItemProps {
  comment: CommentWithRelations;
  currentUser?: User | null;
  depth?: number;
  maxDepth?: number;
  className?: string;
  onCommentUpdate?: () => void;
}

export function CommentItem({
  comment,
  currentUser,
  depth = 0,
  maxDepth = 3,
  className,
  onCommentUpdate,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [localReplies] = useState(comment.replies || []);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const canReply = currentUser && depth < maxDepth;
  const canEdit =
    currentUser &&
    (currentUser.id === comment.authorId || currentUser.role === "ADMIN");
  const canDelete =
    currentUser &&
    (currentUser.id === comment.authorId || currentUser.role === "ADMIN");
  const isReply = depth > 0;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteComment(comment.id);

        if (result.success) {
          toast.success(result.message || "Yorum başarıyla silindi");
          onCommentUpdate?.();
          router.refresh();
        } else {
          toast.error(result.error || "Yorum silinirken bir hata oluştu");
        }
      } catch (error) {
        console.error("Delete comment error:", error);
        toast.error("Beklenmeyen bir hata oluştu");
      } finally {
        setShowDeleteDialog(false);
      }
    });
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onCommentUpdate?.();
    // Refresh to get the new reply
    router.refresh();
  };

  const handleCommentUpdate = () => {
    onCommentUpdate?.();
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Reply indicator line for nested comments */}
      {isReply && (
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border/50 to-transparent" />
      )}

      <div className={cn("relative", isReply && "ml-8 pl-6")}>
        {/* Reply arrow for nested comments - removed */}

        <div
          className={cn(
            "bg-background rounded-xl border transition-all duration-200 hover:shadow-sm",
            isReply
              ? "border-l-4 border-l-primary/30 bg-muted/20"
              : "border-border/50 hover:border-border"
          )}
        >
          <div className="p-6">
            <div className="space-y-4">
              {/* Comment Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage
                      src={comment.author.image || ""}
                      alt={comment.author.name || ""}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                      {comment.author.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-foreground">
                        {comment.author.name || "Anonim Kullanıcı"}
                      </span>
                      {currentUser?.role === "ADMIN" &&
                        comment.authorId === currentUser.id && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      {isReply && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Yanıt
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                      {comment.updatedAt !== comment.createdAt && (
                        <span className="ml-1 text-amber-600 dark:text-amber-400">
                          (düzenlendi)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                {(canEdit || canDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {canEdit && (
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer focus:text-destructive"
                          onClick={() => setShowDeleteDialog(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Comment Content */}
              <div className="ml-11">
                <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                  {comment.content}
                </p>
              </div>

              {/* Comment Actions */}
              <div className="ml-11 flex items-center gap-3 pt-2">
                {canReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="h-8 px-3 text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Yanıtla
                  </Button>
                )}
                {((comment._count?.replies ?? 0) > 0 ||
                  localReplies.length > 0) && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span>
                      {(comment._count?.replies ?? 0) + localReplies.length}{" "}
                      yanıt
                    </span>
                  </div>
                )}
              </div>

              {/* Reply Form */}
              {showReplyForm && currentUser && (
                <div className="mt-6 ml-11">
                  <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Reply className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {comment.author.name}&apos;e yanıt veriyorsunuz
                      </span>
                    </div>
                    <CommentForm
                      postId={comment.postId}
                      parentId={comment.id}
                      user={currentUser}
                      onCancel={() => setShowReplyForm(false)}
                      onSuccess={handleReplySuccess}
                      placeholder={`${comment.author.name}'e yanıt yazın...`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                depth={depth + 1}
                maxDepth={maxDepth}
                onCommentUpdate={handleCommentUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
              {(comment._count?.replies ?? 0) > 0 && (
                <span className="block mt-2 font-medium text-destructive">
                  Bu yorum {comment._count?.replies ?? 0} yanıta sahip. Tüm
                  yanıtlar da silinecek.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
