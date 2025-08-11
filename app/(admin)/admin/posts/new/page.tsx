import { Metadata } from "next";
import { ServerAdminGuard } from "../../../../../lib/auth/admin-guard";
import { NewPostForm } from "../../../../../components/admin/new-post-form";
import { Button } from "../../../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yeni Yazı Oluştur | Admin Panel",
  description: "Yeni blog yazısı oluşturun",
};

export default function NewPostPage() {
  return (
    <ServerAdminGuard>
      <div className="container max-w-[1600px] mx-auto py-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/posts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Yazılara Dön
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Yeni Yazı Oluştur
              </h1>
              <p className="text-muted-foreground mt-1">
                Yeni bir blog yazısı oluşturun ve yayınlayın.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-background">
          <NewPostForm />
        </div>
      </div>
    </ServerAdminGuard>
  );
}
