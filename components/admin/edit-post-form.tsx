"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updatePostSchema,
  type UpdatePostData,
} from "../../lib/validations/post";
import { updatePost, deletePost } from "../../lib/actions/get-posts";
import { saveDraft, type DraftData } from "../../lib/actions/draft";
import { Post } from "../../lib/types";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/actions/category";
import { getTags } from "@/lib/actions/tag";
import {
  updatePostCategories,
  updatePostTags,
} from "@/lib/actions/post-relations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TiptapEditor } from "../ui/tiptap-editor";
import { ImageUploaderEnhanced } from "../ui/image-uploader-enhanced";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Save,
  Eye,
  Trash2,
  Sparkles,
  Calendar,
  User,
  Hash,
  Tag,
  Image as ImageIcon,
  FileText,
  Settings,
  Clock,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { PostPreviewModal } from "./post-preview-modal";
import { Category, CategoryWithCount } from "@/lib/types";

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

interface EditPostFormProps {
  post: Post & {
    author: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
    categories: Category[];
    tags: Tag[];
    _count: {
      likes: number;
      comments: number;
    };
  };
}

export function EditPostForm({ post }: EditPostFormProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const router = useRouter();

  const form = useForm<UpdatePostData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      coverImage: post.coverImage || "",
      status: post.status,
      featured: post.featured,
      categoryIds: post.categories.map((cat) => cat.id),
      tagIds: post.tags.map((tag) => tag.id),
    },
  });

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error loading categories and tags:", error);
        toast.error("Kategoriler ve etiketler yüklenirken hata oluştu");
      }
    };

    loadData();
  }, []);

  // Auto-save draft functionality
  const autoSaveDraft = useCallback(async () => {
    const formData = form.getValues();

    // Only save if there's meaningful content
    if (!formData.title && !formData.content) return;

    try {
      const draftData: DraftData = {
        title: formData.title || "Başlıksız Taslak",
        content: formData.content || "",
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        categoryIds: formData.categoryIds,
        tagIds: formData.tagIds,
      };

      await saveDraft(post.id, draftData);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [form, post.id]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSaveDraft, 30000);
    return () => clearInterval(interval);
  }, [autoSaveDraft]);

  const onSubmit = async (data: UpdatePostData) => {
    try {
      setIsLoading(true);

      const formData = form.getValues();

      const draftData: DraftData = {
        title: formData.title || "Başlıksız Taslak",
        content: formData.content || "",
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        categoryIds: formData.categoryIds,
        tagIds: formData.tagIds,
      };

      await saveDraft(post.id, draftData);

      // Update post
      const updateFormData = new FormData();
      updateFormData.append("id", post.id);
      updateFormData.append("title", data.title || "");
      updateFormData.append("content", data.content || "");
      updateFormData.append("excerpt", data.excerpt || "");
      updateFormData.append("coverImage", data.coverImage || "");
      updateFormData.append("status", data.status || "DRAFT");
      updateFormData.append("featured", data.featured ? "true" : "false");

      const result = await updatePost(updateFormData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Update categories and tags
      if (data.categoryIds) {
        await updatePostCategories(post.id, data.categoryIds);
      }

      if (data.tagIds) {
        await updatePostTags(post.id, data.tagIds);
      }

      toast.success("Yazı başarıyla güncellendi!");
      setLastSaved(new Date());
      setIsDirty(false);

      // Redirect to posts list
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Yazı güncellenirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast.success("Yazı başarıyla silindi!");
      router.push("/admin/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Yazı silinirken hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const selectedCategories = categories.filter((cat) =>
    form.watch("categoryIds")?.includes(cat.id)
  );

  const selectedTags = tags.filter((tag) =>
    form.watch("tagIds")?.includes(tag.id)
  );

  // Create preview data from form values with real-time updates
  const createPreviewData = () => {
    return {
      title: form.watch("title") || "Başlıksız Yazı",
      content: form.watch("content") || "",
      excerpt: form.watch("excerpt") || "",
      coverImage: form.watch("coverImage") || "",
      author: {
        ...post.author,
        name: post.author.name || post.author.email,
        image: post.author.image || undefined,
      },
      categories: selectedCategories,
      tags: selectedTags,
      status: form.watch("status") || "DRAFT",
      featured: form.watch("featured") || false,
      createdAt: post.createdAt,
    };
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Yazı Düzenle</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>Slug: {post.slug}</span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Son kaydedilen:{" "}
                  {lastSaved.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Önizle
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ana İçerik - Sol Taraf */}
            <div className="lg:col-span-2 space-y-6">
              {/* Başlık */}
              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Yazı başlığını girin..."
                            className="text-5xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Özet */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Özet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Yazının kısa özetini girin..."
                            rows={3}
                            className="w-full px-3 py-2 border border-input rounded-md resize-none"
                          />
                        </FormControl>
                        <FormDescription>
                          Bu özet, yazı listelerinde ve sosyal medya
                          paylaşımlarında görünecek.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* İçerik */}
              <Card>
                <CardHeader>
                  <CardTitle>İçerik</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TiptapEditor
                            content={field.value || ""}
                            onChange={field.onChange}
                            className="min-h-[760px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Yan Panel - Sağ Taraf */}
            <div className="space-y-6">
              {/* Yayın Ayarları */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Yayın Ayarları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durum</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500" />
                                Taslak
                              </div>
                            </SelectItem>
                            <SelectItem value="PUBLISHED">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Yayında
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Öne Çıkar
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Ana sayfada öne çıkarılsın
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Kapak Resmi */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Kapak Resmi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUploaderEnhanced
                            onUploadSuccess={(url) => {
                              field.onChange(url);
                              toast.success("Kapak resmi yüklendi!");
                            }}
                            onUploadError={(error) => {
                              toast.error("Resim yüklenirken hata oluştu");
                            }}
                            initialValue={field.value}
                            folder="/blog-covers"
                            maxFileSize={5}
                            showPreview={true}
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Önerilen boyut: 1200x630px
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Kategoriler */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Kategoriler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          {categories.map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`category-${category.id}`}
                                checked={field.value?.includes(category.id)}
                                onChange={(e) => {
                                  const currentValues = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...currentValues,
                                      category.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (id) => id !== category.id
                                      )
                                    );
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label
                                htmlFor={`category-${category.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Etiketler */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Etiketler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          {tags.map((tag) => (
                            <div
                              key={tag.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`tag-${tag.id}`}
                                checked={field.value?.includes(tag.id)}
                                onChange={(e) => {
                                  const currentValues = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...currentValues, tag.id]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (id) => id !== tag.id
                                      )
                                    );
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label
                                htmlFor={`tag-${tag.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {tag.name}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Kaydet ve Sil Butonları */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </Button>

                    <Separator />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          className="w-full gap-2"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                          Yazıyı Sil
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Yazıyı Sil</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu yazıyı silmek istediğinizden emin misiniz? Bu
                            işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      {/* Preview Modal */}
      <PostPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        post={createPreviewData()}
      />
    </div>
  );
}
