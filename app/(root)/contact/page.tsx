import { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim | Blog",
  description:
    "Benimle iletişime geçin. Sorularınız, önerileriniz ve işbirliği teklifleriniz için bana ulaşabilirsiniz.",
  openGraph: {
    title: "İletişim | Blog",
    description:
      "Benimle iletişime geçin. Sorularınız, önerileriniz ve işbirliği teklifleriniz için bana ulaşabilirsiniz.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sorularınız, önerileriniz, işbirliği teklifleriniz veya sadece
            merhaba demek için benimle iletişime geçebilirsiniz. Size en kısa
            sürede dönüş yapacağım.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  İletişim Bilgileri
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">E-posta</h3>
                      <p className="text-muted-foreground">
                        Aşağıdaki formu kullanarak bana mesaj gönderebilirsiniz.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Yanıt Süresi</h3>
                      <p className="text-muted-foreground">
                        Genellikle 24-48 saat içinde yanıt veriyorum.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Konum</h3>
                      <p className="text-muted-foreground">Türkiye</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Hangi Konularda Yazabilirsiniz?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Blog yazıları ve içerikler hakkında</li>
                  <li>• İşbirliği teklifleri</li>
                  <li>• Proje önerileri</li>
                  <li>• Teknik sorular</li>
                  <li>• Genel geri bildirimler</li>
                  <li>• Diğer konular</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium mb-3">
            Dikkat Edilmesi Gerekenler
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Lütfen mesajınızı açık ve net bir şekilde yazın</li>
            <li>• Spam veya reklam içerikli mesajlar yanıtlanmayacaktır</li>
            <li>
              • Acil durumlar için alternatif iletişim yollarını tercih edin
            </li>
            <li>
              • Gönderdiğiniz mesajlar gizli tutulur ve üçüncü kişilerle
              paylaşılmaz
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
