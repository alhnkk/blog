"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { createCategory } from "@/lib/actions/category";
import { toast } from "sonner";

interface CategoryModalProps {
  trigger?: React.ReactNode;
  onSuccess?: (category: any) => void;
}

export function CategoryModal({ trigger, onSuccess }: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    try {
      const result = await createCategory(formData);

      if (result.success) {
        toast.success("Kategori başarıyla oluşturuldu");
        setOpen(false);
        onSuccess?.(result.data);
        router.refresh();
      } else {
        toast.error(result.error || "Kategori oluşturulamadı");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kategori
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yeni Kategori Ekle</DialogTitle>
            <DialogDescription>
              Yeni bir blog kategorisi oluşturun.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Kategori Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Kategori adını girin"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Kategori açıklaması"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Oluştur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
