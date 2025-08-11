"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface UsersTableWrapperProps {
  children: React.ReactNode;
}

export function UsersTableWrapper({ children }: UsersTableWrapperProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Kullanıcı Listesi</h2>
          <p className="text-sm text-muted-foreground">
            Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Yenileniyor..." : "Yenile"}
        </Button>
      </div>
      {children}
    </div>
  );
}
