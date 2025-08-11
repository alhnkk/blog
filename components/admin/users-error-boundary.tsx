"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, RefreshCw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface UsersErrorBoundaryProps {
  error: string;
  onRetry?: () => void;
}

export function UsersErrorBoundary({
  error,
  onRetry,
}: UsersErrorBoundaryProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            Kullanıcılar Yüklenemedi
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Olası nedenler:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ağ bağlantısı sorunu</li>
              <li>Sunucu geçici olarak erişilemez</li>
              <li>Yetki sorunu</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={handleRetry} disabled={isRetrying} className="gap-2">
            <RefreshCw
              className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Yeniden Deneniyor..." : "Yeniden Dene"}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Ana Panele Dön
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
