"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateSiteSettings } from "@/lib/actions/seo";
import { SiteSettings } from "@/lib/types";
import {
  seoSettingsSchema,
  type SEOSettingsFormData,
} from "@/lib/validations/seo";

interface SEOSettingsFormProps {
  initialData: SiteSettings | null;
}

export function SEOSettingsForm({ initialData }: SEOSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SEOSettingsFormData>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: {
      siteName: initialData?.siteName || "Kişisel Blog",
      siteDesc:
        initialData?.siteDesc || "Modern web teknolojileri hakkında yazılar",
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
      twitterHandle: "",
      keywords: "",
    },
  });

  const onSubmit = async (data: SEOSettingsFormData) => {
    setIsLoading(true);
    try {
      const result = await updateSiteSettings(data);

      if (result.success) {
        toast.success("SEO ayarları başarıyla güncellendi");
      } else {
        toast.error(result.error || "Bir hata oluştu");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Name */}
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Adı</Label>
          <Input
            id="siteName"
            {...form.register("siteName")}
            placeholder="Kişisel Blog"
          />
          {form.formState.errors.siteName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.siteName.message}
            </p>
          )}
        </div>

        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title (Opsiyonel)</Label>
          <Input
            id="metaTitle"
            {...form.register("metaTitle")}
            placeholder="Site adından farklıysa giriniz"
          />
          <p className="text-xs text-muted-foreground">
            Boş bırakılırsa site adı kullanılır
          </p>
        </div>
      </div>

      {/* Site Description */}
      <div className="space-y-2">
        <Label htmlFor="siteDesc">Site Açıklaması</Label>
        <Textarea
          id="siteDesc"
          {...form.register("siteDesc")}
          placeholder="Sitenizin kısa açıklaması"
          rows={3}
        />
        {form.formState.errors.siteDesc && (
          <p className="text-sm text-red-500">
            {form.formState.errors.siteDesc.message}
          </p>
        )}
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description (Opsiyonel)</Label>
        <Textarea
          id="metaDescription"
          {...form.register("metaDescription")}
          placeholder="Arama motorları için özel açıklama"
          rows={3}
          maxLength={160}
        />
        <p className="text-xs text-muted-foreground">
          Maksimum 160 karakter. Boş bırakılırsa site açıklaması kullanılır.
        </p>
        {form.formState.errors.metaDescription && (
          <p className="text-sm text-red-500">
            {form.formState.errors.metaDescription.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OG Image */}
        <div className="space-y-2">
          <Label htmlFor="ogImage">Open Graph Görseli</Label>
          <Input
            id="ogImage"
            {...form.register("ogImage")}
            placeholder="https://example.com/og-image.jpg"
            type="url"
          />
          <p className="text-xs text-muted-foreground">
            1200x630 piksel boyutunda olmalı
          </p>
          {form.formState.errors.ogImage && (
            <p className="text-sm text-red-500">
              {form.formState.errors.ogImage.message}
            </p>
          )}
        </div>

        {/* Twitter Handle */}
        <div className="space-y-2">
          <Label htmlFor="twitterHandle">Twitter Kullanıcı Adı</Label>
          <Input
            id="twitterHandle"
            {...form.register("twitterHandle")}
            placeholder="@kullaniciadi"
          />
          <p className="text-xs text-muted-foreground">
            @ işareti ile birlikte
          </p>
        </div>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <Label htmlFor="keywords">Anahtar Kelimeler</Label>
        <Input
          id="keywords"
          {...form.register("keywords")}
          placeholder="blog, teknoloji, yazılım, web geliştirme"
        />
        <p className="text-xs text-muted-foreground">
          Virgülle ayırarak yazınız
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
      </Button>
    </form>
  );
}
