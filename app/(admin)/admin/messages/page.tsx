import { Suspense } from "react";
import { getContacts } from "@/lib/actions/contact";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MailOpen,
  Trash2,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteContactButton } from "./delete-contact-button";
import { MarkAsReadButton } from "./mark-as-read-button";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

async function ContactsList() {
  const result = await getContacts();

  if (!result.success || !result.data) {
    return (
      <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                Yükleme Hatası
              </h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {result.message || "Mesajlar yüklenirken bir hata oluştu."}
              </p>
              {result.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-mono">
                  Hata: {result.error}
                </p>
              )}
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              Yeniden Dene
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const contacts = result.data;

  if (contacts.length === 0) {
    return (
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                Henüz mesaj yok
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mt-2">
                İletişim formu üzerinden gelen mesajlar burada görünecek.
              </p>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <p>• Mesajlar otomatik olarak burada listelenir</p>
              <p>• Yeni mesajlar &quot;Yeni&quot; etiketi ile işaretlenir</p>
              <p>
                • Mesajları okundu olarak işaretleyebilir veya silebilirsiniz
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unreadCount = contacts.filter((contact) => !contact.isRead).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Toplam Mesaj</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MailOpen className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Okunmuş</p>
                <p className="text-2xl font-bold">
                  {contacts.length - unreadCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Okunmamış</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            className={`${
              !contact.isRead ? "border-primary/50 bg-primary/5" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{contact.subject}</CardTitle>
                    {!contact.isRead && (
                      <Badge variant="secondary" className="text-xs">
                        Yeni
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {contact.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(contact.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!contact.isRead && (
                    <MarkAsReadButton contactId={contact.id} />
                  )}
                  <DeleteContactButton contactId={contact.id} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Mesaj ID: {contact.id}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleString("tr-TR")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">İletişim Mesajları</h1>
          <p className="text-muted-foreground">
            İletişim formu üzerinden gelen mesajları yönetin.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <Mail className="h-4 w-4" />
          Yenile
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="animate-pulse flex items-center gap-2">
                      <div className="h-5 w-5 bg-muted rounded" />
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-20" />
                        <div className="h-6 bg-muted rounded w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Messages Skeleton */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <div className="animate-pulse space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="h-5 bg-muted rounded w-48" />
                          <div className="flex items-center gap-4">
                            <div className="h-3 bg-muted rounded w-24" />
                            <div className="h-3 bg-muted rounded w-32" />
                            <div className="h-3 bg-muted rounded w-20" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-muted rounded" />
                          <div className="h-8 w-8 bg-muted rounded" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="animate-pulse space-y-3">
                      <div className="h-16 bg-muted rounded" />
                      <div className="flex justify-between pt-2 border-t">
                        <div className="h-3 bg-muted rounded w-24" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        }
      >
        <ContactsList />
      </Suspense>
    </div>
  );
}
