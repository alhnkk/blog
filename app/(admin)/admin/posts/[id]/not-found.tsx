import Link from "next/link";
import { Button } from "../../../../../components/ui/button";
import { ArrowLeft, FileX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";

export default function PostNotFound() {
  return (
    <div className="container max-w-[1600px] mx-auto py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Yazılara Dön
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Post Bulunamadı</h1>
          <p className="text-muted-foreground mt-1">
            Aradığınız post bulunamadı veya erişim izniniz yok.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileX className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">Post Bulunamadı</CardTitle>
            <CardDescription>
              Bu post mevcut değil, silinmiş olabilir veya erişim izniniz
              bulunmuyor.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Yapabilecekleriniz:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• URL&apos;yi kontrol edin</li>
                <li>• Post listesinden doğru post&apos;u seçin</li>
                <li>• Yönetici ile iletişime geçin</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="flex-1">
                <Link href="/admin/posts">Tüm Yazılar</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/admin">Ana Panel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
