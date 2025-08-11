"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }
  }, [session, isPending, router]);

  if (isPending || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { user } = session;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <p className="text-muted-foreground">
            Hesap bilgilerinizi görüntüleyin ve düzenleyin
          </p>
        </div>

        <Separator />

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Hesap Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="relative">
                  {user.image ? (
                    <Image
                      width={96}
                      height={96}
                      src={user.image}
                      alt={user.name || "Profil fotoğrafı"}
                      className="h-24 w-24 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {user.name || "İsim belirtilmemiş"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {user.createdAt
                      ? new Intl.DateTimeFormat("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(user.createdAt))
                      : "Bilinmiyor"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role === "ADMIN" ? "Yönetici" : "Kullanıcı"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profili Düzenle</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Profil bilgilerinizi güncelleyin
                </p>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  user={{
                    ...user,
                    image: user.image ?? null,
                    role: user.role as "USER" | "ADMIN",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
