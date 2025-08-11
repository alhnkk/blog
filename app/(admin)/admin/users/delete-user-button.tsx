"use client";

import { useState, useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { Trash2, Loader2 } from "lucide-react";
import { deleteUser } from "@/lib/actions/user-management";
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
  hasContent: boolean;
}

export function DeleteUserButton({
  userId,
  userName,
  hasContent,
}: DeleteUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteUser(userId);

        if (result.success) {
          toast.success("Kullanıcı silindi");
          setIsOpen(false);
        } else {
          toast.error(result.error || "Kullanıcı silinemedi");
        }
      } catch (error) {
        toast.error("Bir hata oluştu");
      }
    });
  };

  return (
    <>
      <DropdownMenuItem
        className="text-destructive"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Kullanıcıyı Sil
      </DropdownMenuItem>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{userName}</strong> kullanıcısını silmek istediğinizden
              emin misiniz?
              {hasContent && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  <strong>Uyarı:</strong> Bu kullanıcının yazıları veya
                  yorumları var. Kullanıcı silindiğinde tüm yorumları da
                  silinecek.
                </div>
              )}
              <div className="mt-2 text-sm">Bu işlem geri alınamaz.</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                "Sil"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
