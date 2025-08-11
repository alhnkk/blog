"use client";

import { useState } from "react";
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
import { Trash2, Loader2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/category";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  postCount: number;
}

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  postCount,
}: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (postCount > 0) {
      toast.error(
        "Bu kategoriye ait yazılar var, önce yazıları silin veya başka kategoriye taşıyın"
      );
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        toast.success("Kategori başarıyla silindi");
        router.refresh();
      } else {
        toast.error(result.error || "Kategori silinemedi");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDeleting}>
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{categoryName}</strong> kategorisini silmek istediğinizden
            emin misiniz?
            {postCount > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                Bu kategoriye ait {postCount} yazı var. Önce yazıları silin veya
                başka kategoriye taşıyın.
              </span>
            )}
            Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={postCount > 0 || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Siliniyor...
              </>
            ) : (
              "Sil"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
