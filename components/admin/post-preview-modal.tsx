"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeImage } from "@/components/ui/safe-image";
import { ArrowLeft, Calendar, Clock, Eye, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostPreviewData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  categories?: Array<{ id: string; name: string; slug: string }>;
  tags?: Array<{ id: string; name: string; slug: string }>;
  author?: {
    name: string;
    image?: string;
  };
  status?: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  featured?: boolean;
}

interface PostPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostPreviewData;
  className?: string;
}

export function PostPreviewModal({
  open,
  onOpenChange,
  post,
  className,
}: PostPreviewModalProps) {
  // Mock data for preview
  const mockAuthor = {
    name: post.author?.name || "Yazar Adı",
    image: post.author?.image || null,
  };

  const mockCategory = post.categories?.[0] || { name: "Genel", slug: "genel" };
  const mockTags = post.tags || [];
  const mockReadingTime = Math.ceil((post.content?.length || 0) / 1000);
  const mockDate = new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-w-6xl max-h-[90vh] overflow-y-auto p-0", className)}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Yazı Önizlemesi</DialogTitle>
        </DialogHeader>

        <div className="relative">
          {/* Hero Section */}
          <section className="relative">
            {post.coverImage && (
              <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                <SafeImage
                  src={post.coverImage}
                  alt={post.title || "Önizleme"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
                <div className="absolute inset-0 post-hero-gradient" />

                {/* Close Button */}
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
                      >
                        {mockCategory.name}
                      </Badge>
                      {mockTags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={tag.id || index}
                          variant="outline"
                          className="bg-white/10 text-white border-white/30 backdrop-blur-sm"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                      {post.title || "Başlıksız Yazı"}
                    </h1>
                    {post.excerpt && (
                      <p className="text-base text-white/90 max-w-2xl leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* No Cover Image Fallback */}
            {!post.coverImage && (
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12">
                <div className="max-w-4xl mx-auto px-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{mockCategory.name}</Badge>
                      {mockTags.slice(0, 3).map((tag, index) => (
                        <Badge key={tag.id || index} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenChange(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </Button>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    {post.title || "Başlıksız Yazı"}
                  </h1>

                  {post.excerpt && (
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Article Content */}
          <section className="py-8">
            <div className="max-w-3xl mx-auto px-6">
              {/* Author & Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarImage
                      src={mockAuthor.image || undefined}
                      alt={mockAuthor.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {mockAuthor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{mockAuthor.name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {mockDate.toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mockReadingTime} dk okuma
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <Heart className="h-4 w-4 mr-1" />0
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Share2 className="h-4 w-4 mr-1" />
                    Paylaş
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <article className="prose prose-lg dark:prose-invert prose-enhanced max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:transition-colors">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p className="text-muted-foreground italic">
                    İçerik henüz yazılmamış...
                  </p>
                )}
              </article>

              {/* Tags */}
              {mockTags.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    Etiketler
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockTags.map((tag, index) => (
                      <Badge
                        key={tag.id || index}
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Notice */}
              <div className="mt-8 pt-6 border-t">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 inline mr-1" />
                    Bu bir önizlemedir. Yorumlar ve etkileşimler gerçek
                    değildir.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
