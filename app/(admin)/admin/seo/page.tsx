import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/actions/seo";
import { SEOSettingsForm } from "@/components/admin/seo-settings-form";
import { Metadata } from "next";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Paneli",
  description: "Site SEO ayarlarını yönetin",
};

const SEOPage = async () => {
  const siteSettings = await getSiteSettings();

  return (
    <div className="container max-w-[1600px] mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SEO Paneli</h1>
        <p className="text-muted-foreground">
          Site SEO ayarlarını ve meta bilgilerini yönetin
        </p>
      </div>

      <div className="grid gap-6">
        {/* Site SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Site SEO Ayarları</CardTitle>
          </CardHeader>
          <CardContent>
            <SEOSettingsForm initialData={siteSettings} />
          </CardContent>
        </Card>

        {/* SEO Tips */}
        <Card>
          <CardHeader>
            <CardTitle>SEO İpuçları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Meta Title</h4>
              <p className="text-sm text-muted-foreground">
                • 50-60 karakter arası olmalı
                <br />
                • Ana anahtar kelimeyi içermeli
                <br />• Her sayfa için benzersiz olmalı
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Meta Description</h4>
              <p className="text-sm text-muted-foreground">
                • 150-160 karakter arası olmalı
                <br />
                • Sayfanın içeriğini özetlemeli
                <br />• Call-to-action içermeli
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Open Graph</h4>
              <p className="text-sm text-muted-foreground">
                • Görsel boyutu 1200x630 piksel olmalı
                <br />
                • Sosyal medya paylaşımları için önemli
                <br />• Her post için özel görsel kullanın
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Structured Data</h4>
              <p className="text-sm text-muted-foreground">
                • JSON-LD formatında otomatik ekleniyor
                <br />
                • Google Rich Snippets için gerekli
                <br />• Article schema kullanılıyor
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SEO Status */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm font-medium">Sitemap</div>
                <div className="text-xs text-muted-foreground">Aktif</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm font-medium">Robots.txt</div>
                <div className="text-xs text-muted-foreground">Aktif</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm font-medium">Meta Tags</div>
                <div className="text-xs text-muted-foreground">Dinamik</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SEOPage;
