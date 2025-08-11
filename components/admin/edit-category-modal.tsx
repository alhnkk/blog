"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Loader2 } from "lucide-react";
import { updateCategory } from "@/lib/actions/category";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditCategoryModalProps {
  category: {
    id: string;
    name: string;
    description?: string;
  };
}

export function EditCategoryModal({ category }: EditCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const result = await updateCategory(formData);

      if (result.success) {
        toast.success("Kategori başarıyla güncellendi");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Bir hata oluştu");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kategoriyi Düzenle</DialogTitle>
          <DialogDescription>
            Kategori bilgilerini güncelleyin
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={category.id} />

          <div className="space-y-2">
            <Label htmlFor="name">Kategori Adı *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Kategori adını girin"
              defaultValue={category.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Kategori açıklamasını girin (opsiyonel)"
              defaultValue={category.description || ""}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                "Güncelle"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
