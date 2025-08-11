"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, LogIn, RefreshCw, Users } from "lucide-react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { getCommentsByPost } from "@/lib/actions/comment";
import type { CommentWithRelations, User } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CommentsSectionProps {
  postId: string;
  currentUser?: User | null;
  initialComments?: CommentWithRelations[];
  className?: string;
}

export function CommentsSection({
  postId,
  currentUser,
  initialComments = [],
  className,
}: CommentsSectionProps) {
  const [comments, setComments] =
    useState<CommentWithRelations[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await getCommentsByPost(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Load comments if not provided initially
  useEffect(() => {
    if (initialComments.length === 0) {
      loadComments();
    }
  }, [postId, initialComments.length, loadComments]);

  const refreshComments = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const fetchedComments = await getCommentsByPost(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error refreshing comments:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [postId]);

  const handleCommentSuccess = () => {
    // Refresh comments after successful submission
    refreshComments();
  };

  const handleCommentUpdate = () => {
    // Refresh comments when a nested comment is added/deleted
    refreshComments();
  };

  const totalComments = comments.reduce((total, comment) => {
    const countReplies = (comment: CommentWithRelations): number => {
      let count = 1; // Count the comment itself
      if (comment.replies) {
        count += comment.replies.reduce(
          (acc, reply) => acc + countReplies(reply),
          0
        );
      }
      return count;
    };
    return total + countReplies(comment);
  }, 0);

  return (
    <div className={cn("space-y-8 ", className)}>
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Yorumlar</h2>
            <p className="text-sm text-muted-foreground">
              {totalComments > 0 ? (
                <>
                  <Users className="inline h-3 w-3 mr-1" />
                  {totalComments} yorum
                </>
              ) : (
                "Henüz yorum yok"
              )}
            </p>
          </div>
        </div>

        {comments.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshComments}
            disabled={isRefreshing}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
            />
            Yenile
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* Comment Form for Authenticated Users */}
        {currentUser ? (
          <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
            <CommentForm
              postId={postId}
              user={currentUser}
              onSuccess={handleCommentSuccess}
              placeholder="Bu yazı hakkında ne düşünüyorsunuz?"
            />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-background rounded-xl p-8 border border-dashed border-primary/20 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sohbete katılın</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Bu yazıya yorum yapabilmek ve diğer okuyucularla etkileşime
                  geçebilmek için hesabınıza giriş yapın.
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <Button asChild className="px-6">
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Giriş Yap
                  </Link>
                </Button>
                <Button asChild variant="outline" className="px-6">
                  <Link href="/register">Kayıt Ol</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
              <span className="text-sm font-medium text-muted-foreground px-3">
                Tüm Yorumlar
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
            </div>

            <div className="space-y-8">
              {comments.map((comment, index) => (
                <div key={comment.id} className="relative">
                  {index > 0 && (
                    <div className="absolute -top-4 left-6 w-px h-4 bg-gradient-to-b from-border to-transparent" />
                  )}
                  <CommentItem
                    comment={comment}
                    currentUser={currentUser}
                    onCommentUpdate={handleCommentUpdate}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {comments.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mx-auto mb-6">
              <MessageCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">İlk yorumu siz yapın</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Bu yazı hakkında düşüncelerinizi paylaşın ve tartışmayı başlatın.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mt-4 font-medium">
              Yorumlar yükleniyor...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
