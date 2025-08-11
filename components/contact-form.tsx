"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createContact, type ContactFormData } from "@/lib/actions/contact";
import { toast } from "sonner";
import { Mail, User, MessageSquare, Send } from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createContact(formData);

      if (result.success) {
        toast.success(result.message);
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(result.message);

        // Handle validation errors
        if (result.errors) {
          result.errors.forEach((error) => {
            toast.error(`${error.path.join(".")}: ${error.message}`);
          });
        }
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          İletişim Formu
        </CardTitle>
        <CardDescription>
          Benimle iletişime geçmek için aşağıdaki formu doldurabilirsiniz. En
          kısa sürede size dönüş yapacağım.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                İsim Soyisim
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Adınız ve soyadınız"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-posta
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Konu
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="Mesajınızın konusu"
              value={formData.subject}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Mesajınızı buraya yazın..."
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Mesajı Gönder
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
