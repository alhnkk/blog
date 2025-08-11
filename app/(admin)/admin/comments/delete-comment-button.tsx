"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2, Loader2 } from "lucide-react";
import { adminDeleteComment } from "@/lib/actions/comment";
import { toast } from "sonner";

interface AdminDeleteCommentButtonProps {
  commentId: string;
}

export function AdminDeleteCommentButton({
  commentId,
}: AdminDeleteCommentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await adminDeleteComment(commentId);

        if (result.success) {
          toast.success(result.message || "Yorum başarıyla silindi");
          router.refresh();
        } else {
          toast.error(result.error || "Yorum silinirken bir hata oluştu");
        }
      } catch (error) {
        console.error("Delete comment error:", error);
        toast.error("Beklenmeyen bir hata oluştu");
      } finally {
        setIsOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive"
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Sil
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
          <AlertDialogDescription>
            Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz. Eğer bu yorumun yanıtları varsa, onlar da silinecektir.
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
  );
}
