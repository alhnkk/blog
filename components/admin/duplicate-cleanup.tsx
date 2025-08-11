"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Search, AlertTriangle, CheckCircle } from "lucide-react";
import {
  findDuplicatePosts,
  removeDuplicatePosts,
} from "@/lib/utils/duplicate-checker";

interface DuplicateData {
  duplicatesBySlug: Array<{ slug: string; _count: { slug: number } }>;
  duplicatesByContent: Array<{
    title: string;
    content: string;
    _count: { title: number };
  }>;
}

export function DuplicateCleanup() {
  const [isScanning, setIsScanning] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateData | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const result = await findDuplicatePosts();
      setDuplicates(result);
      setLastScanTime(new Date());

      const totalDuplicates =
        result.duplicatesBySlug.length + result.duplicatesByContent.length;
      if (totalDuplicates === 0) {
        toast.success("Duplicate post bulunamadı!");
      } else {
        toast.warning(`${totalDuplicates} duplicate post grubu bulundu.`);
      }
    } catch (error) {
      toast.error("Tarama sırasında hata oluştu.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleRemove = async () => {
    if (
      !duplicates ||
      (duplicates.duplicatesBySlug.length === 0 &&
        duplicates.duplicatesByContent.length === 0)
    ) {
      toast.error("Silinecek duplicate post bulunamadı.");
      return;
    }

    setIsRemoving(true);
    try {
      const result = await removeDuplicatePosts();

      if (result.success) {
        toast.success(`${result.removedCount} duplicate post silindi!`);
        // Tekrar tara
        await handleScan();
      } else {
        toast.error(result.error || "Duplicate postlar silinemedi.");
      }
    } catch (error) {
      toast.error("Silme işlemi sırasında hata oluştu.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kontrol Paneli */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Duplicate Post Kontrolü
          </CardTitle>
          <CardDescription>
            Aynı slug veya içeriğe sahip duplicate postları tespit edin ve
            temizleyin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleScan}
              disabled={isScanning || isRemoving}
              className="min-w-[120px]"
            >
              <Search className="mr-2 h-4 w-4" />
              {isScanning ? "Taranıyor..." : "Tara"}
            </Button>

            {duplicates &&
              (duplicates.duplicatesBySlug.length > 0 ||
                duplicates.duplicatesByContent.length > 0) && (
                <Button
                  onClick={handleRemove}
                  disabled={isScanning || isRemoving}
                  variant="destructive"
                  className="min-w-[120px]"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isRemoving ? "Siliniyor..." : "Duplicate'ları Sil"}
                </Button>
              )}
          </div>

          {lastScanTime && (
            <p className="text-sm text-muted-foreground">
              Son tarama: {lastScanTime.toLocaleString("tr-TR")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sonuçlar */}
      {duplicates && (
        <div className="space-y-4">
          {/* Slug Duplicate'ları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {duplicates.duplicatesBySlug.length > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                Slug Duplicate&apos;ları
                <Badge
                  variant={
                    duplicates.duplicatesBySlug.length > 0
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {duplicates.duplicatesBySlug.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Aynı slug&apos;a sahip postlar. Bu durum SEO ve URL sorunlarına
                neden olabilir.
              </CardDescription>
            </CardHeader>
            {duplicates.duplicatesBySlug.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  {duplicates.duplicatesBySlug.map((duplicate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">/{duplicate.slug}</p>
                        <p className="text-sm text-muted-foreground">
                          {duplicate._count.slug} post aynı slug&apos;ı
                          kullanıyor
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {duplicate._count.slug} duplicate
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* İçerik Duplicate'ları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {duplicates.duplicatesByContent.length > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                İçerik Duplicate&apos;ları
                <Badge
                  variant={
                    duplicates.duplicatesByContent.length > 0
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {duplicates.duplicatesByContent.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Aynı başlık ve içeriğe sahip postlar.
              </CardDescription>
            </CardHeader>
            {duplicates.duplicatesByContent.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  {duplicates.duplicatesByContent.map((duplicate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{duplicate.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {duplicate._count.title} post aynı içeriğe sahip
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {duplicate._count.title} duplicate
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Bilgilendirme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Önemli Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • Duplicate postlar silinirken, en eski tarihli post korunur.
          </p>
          <p className="text-sm text-muted-foreground">
            • Silme işlemi geri alınamaz. İşlem öncesi veritabanı yedeği almanız
            önerilir.
          </p>
          <p className="text-sm text-muted-foreground">
            • Slug duplicate&apos;ları SEO açısından kritiktir ve öncelikle
            temizlenmelidir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
