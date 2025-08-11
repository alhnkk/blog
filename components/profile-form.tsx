"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Save, Upload } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
}

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    bio: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call for now
    setTimeout(() => {
      toast.success("Profil başarıyla güncellendi (Demo)");
      setIsLoading(false);
    }, 1000);

    // TODO: Implement actual API call when database is working
    /*
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
        }),
      });

      if (!response.ok) {
        throw new Error("Profil güncellenirken bir hata oluştu");
      }

      toast.success("Profil başarıyla güncellendi");
      router.refresh();
    } catch (error) {
      toast.error("Profil güncellenirken bir hata oluştu");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture Section */}
      <div className="space-y-4">
        <Label>Profil Fotoğrafı</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-lg">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button type="button" variant="outline" size="sm" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Fotoğraf Yükle
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG veya GIF. Maksimum 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          <User className="h-4 w-4 inline mr-2" />
          Ad Soyad
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Adınızı ve soyadınızı girin"
          className="w-full"
        />
      </div>

      {/* Email Field (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email">
          <Mail className="h-4 w-4 inline mr-2" />
          E-posta
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          disabled
          className="w-full bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          E-posta adresiniz değiştirilemez
        </p>
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <Label htmlFor="bio">Hakkında</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
          className="w-full min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">Maksimum 500 karakter</p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Kaydediliyor...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Kaydet
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
