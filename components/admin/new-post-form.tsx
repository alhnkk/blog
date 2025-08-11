"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  type CreatePostData,
} from "../../lib/validations/post";
import { createPost } from "../../lib/actions/get-posts";
import { saveDraft, type DraftData } from "../../lib/actions/draft";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/actions/category";
import { getTags } from "@/lib/actions/tag";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  CalendarIcon,
  ImageIcon,
  TagIcon,
  FolderIcon,
  X,
  Plus,
  Save,
  Eye,
  Check,
  ChevronsUpDown,
  Search,
  Sparkles,
  Clock,
  FileText,
} from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { CategoryModal } from "./category-modal";
import { TagModal } from "./tag-modal";
import { Badge } from "../ui/badge";

import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { PostPreviewModal } from "./post-preview-modal";
import { CategoryWithCount } from "@/lib/types";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

export function NewPostForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(
    null
  );
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [openTagPopover, setOpenTagPopover] = useState(false);
  const router = useRouter();

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      coverImage: "",
      status: "PUBLISHED",
      featured: false,
      categoryIds: [],
      tagIds: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
      }
    };

    fetchData();
  }, []);

  // Auto-save draft functionality
  const autoSaveDraft = useCallback(async () => {
    const formData = form.getValues();

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

      const result = await saveDraft(currentDraftId, draftData);

      if (result.success && result.data) {
        if (!currentDraftId) {
          setCurrentDraftId(result.data.id);
        }
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [form, currentDraftId]);

  useEffect(() => {
    const interval = setInterval(autoSaveDraft, 30000);
    return () => clearInterval(interval);
  }, [autoSaveDraft]);

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);

    try {
      const formData = form.getValues();

      const draftData: DraftData = {
        title: formData.title || "Başlıksız Taslak",
        content: formData.content || "",
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        categoryIds: formData.categoryIds,
        tagIds: formData.tagIds,
      };

      const result = await saveDraft(currentDraftId, draftData);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.data) {
        if (!currentDraftId) {
          setCurrentDraftId(result.data.id);
        }
        toast.success("Taslak kaydedildi!");
      }
    } catch (error) {
      toast.error("Taslak kaydedilirken hata oluştu.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  async function onSubmit(data: CreatePostData) {
    const now = Date.now();

    // Prevent double submission
    if (isLoading || isSubmitted) {
      return;
    }

    // Prevent rapid successive submissions (within 3 seconds)
    if (lastSubmissionTime && now - lastSubmissionTime < 3000) {
      toast.error("Lütfen bir önceki işlemin tamamlanmasını bekleyin.");
      return;
    }

    setIsLoading(true);
    setIsSubmitted(true);
    setLastSubmissionTime(now);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "categoryIds" || key === "tagIds") {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((id) => formData.append(key, id));
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await createPost(formData);

      if (result?.error) {
        toast.error(result.error);
        setIsSubmitted(false); // Allow retry on error
        return;
      } else {
        toast.success("Post başarıyla oluşturuldu!");
        // Keep form disabled after successful submission
        form.reset();
        router.push("/admin/posts");
        router.refresh();
      }
    } catch (error) {
      console.error("Post creation error:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      setIsSubmitted(false); // Allow retry on error
    } finally {
      setIsLoading(false);
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const selectedCategories = categories.filter((cat) =>
    form.watch("categoryIds")?.includes(cat.id)
  );

  const selectedTags = tags.filter((tag) =>
    form.watch("tagIds")?.includes(tag.id)
  );

  // Create preview data from form values with real-time updates
  const createPreviewData = () => {
    return {
      title: form.watch("title"),
      content: form.watch("content"),
      excerpt: form.watch("excerpt"),
      coverImage: form.watch("coverImage"),
      categories: selectedCategories,
      tags: selectedTags,
      status: form.watch("status"),
      featured: form.watch("featured"),
    };
  };

  return (
    <div className="mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Yeni Yazı Oluştur
          </h1>
          <p className="text-muted-foreground mt-2">
            Blog yazınızı oluşturun ve yayınlayın
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading || isSavingDraft || isSubmitted}
          >
            İptal
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSaveDraft}
            disabled={isLoading || isSavingDraft || isSubmitted}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSavingDraft ? "Kaydediliyor..." : "Taslak Kaydet"}
          </Button>
        </div>
      </div>

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
                            placeholder="Yazınızın başlığını girin..."
                            {...field}
                            disabled={isSubmitted}
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
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
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
                          <Textarea
                            placeholder="Yazınızın kısa bir özetini yazın..."
                            {...field}
                            rows={3}
                            className="resize-none"
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

              {/* İçerik Editörü */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">İçerik</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TiptapEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Yazınızın içeriğini buraya yazın..."
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
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Yayın
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
                                <div className="h-2 w-2 rounded-full bg-gray-500" />
                                Taslak
                              </div>
                            </SelectItem>
                            <SelectItem value="PUBLISHED">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                Yayınlandı
                              </div>
                            </SelectItem>
                            <SelectItem value="SCHEDULED">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                Zamanlandı
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
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
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

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowPreview(true)}
                      disabled={isSubmitted}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Önizleme
                    </Button>

                    {showPreview && (
                      <PostPreviewModal
                        open={showPreview}
                        onOpenChange={setShowPreview}
                        post={createPreviewData()}
                      />
                    )}

                    <Button
                      type="submit"
                      size="sm"
                      disabled={isLoading || isSavingDraft || isSubmitted}
                      className="flex-1"
                    >
                      {isLoading
                        ? "Yayınlanıyor..."
                        : isSubmitted
                        ? "Oluşturuldu"
                        : "Yayınla"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Kapak Resmi */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
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
                            onUploadSuccess={(url, fileId) => {
                              field.onChange(url);
                              toast.success("Kapak resmi yüklendi!");
                            }}
                            folder="/blog-covers"
                            maxFileSize={10}
                            acceptedTypes={[
                              "image/jpeg",
                              "image/png",
                              "image/webp",
                              "image/gif",
                            ]}
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
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderIcon className="h-5 w-5" />
                    Kategoriler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <Popover
                            open={openCategoryPopover}
                            onOpenChange={setOpenCategoryPopover}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCategoryPopover}
                                className="w-full justify-between"
                              >
                                {selectedCategories.length > 0
                                  ? `${selectedCategories.length} kategori seçildi`
                                  : "Kategori seçin..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <div className="p-3 border-b">
                                <div className="relative">
                                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Kategori ara..."
                                    value={categorySearch}
                                    onChange={(e) =>
                                      setCategorySearch(e.target.value)
                                    }
                                    className="pl-8"
                                  />
                                </div>
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {filteredCategories.length === 0 ? (
                                  <div className="p-4 text-sm text-muted-foreground text-center">
                                    Kategori bulunamadı
                                  </div>
                                ) : (
                                  filteredCategories.map((category) => (
                                    <div
                                      key={category.id}
                                      className="flex items-center space-x-2 p-3 hover:bg-accent cursor-pointer"
                                      onClick={() => {
                                        const currentIds = field.value || [];
                                        if (currentIds.includes(category.id)) {
                                          field.onChange(
                                            currentIds.filter(
                                              (id) => id !== category.id
                                            )
                                          );
                                        } else {
                                          field.onChange([
                                            ...currentIds,
                                            category.id,
                                          ]);
                                        }
                                      }}
                                    >
                                      <Checkbox
                                        checked={field.value?.includes(
                                          category.id
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {category.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {category._count.posts} yazı
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                              <div className="p-3 border-t">
                                <CategoryModal
                                  trigger={
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Yeni Kategori Ekle
                                    </Button>
                                  }
                                  onSuccess={(newCategory) => {
                                    setCategories((prev) => [
                                      ...prev,
                                      newCategory,
                                    ]);
                                    setOpenCategoryPopover(false);
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>

                          {selectedCategories.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedCategories.map((category) => (
                                <Badge
                                  key={category.id}
                                  variant="secondary"
                                  className="gap-1"
                                >
                                  {category.name}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => {
                                      const currentIds = field.value || [];
                                      field.onChange(
                                        currentIds.filter(
                                          (id) => id !== category.id
                                        )
                                      );
                                    }}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Etiketler */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TagIcon className="h-5 w-5" />
                    Etiketler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-3">
                          <Popover
                            open={openTagPopover}
                            onOpenChange={setOpenTagPopover}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openTagPopover}
                                className="w-full justify-between"
                              >
                                {selectedTags.length > 0
                                  ? `${selectedTags.length} etiket seçildi`
                                  : "Etiket seçin..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <div className="p-3 border-b">
                                <div className="relative">
                                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Etiket ara..."
                                    value={tagSearch}
                                    onChange={(e) =>
                                      setTagSearch(e.target.value)
                                    }
                                    className="pl-8"
                                  />
                                </div>
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {filteredTags.length === 0 ? (
                                  <div className="p-4 text-sm text-muted-foreground text-center">
                                    Etiket bulunamadı
                                  </div>
                                ) : (
                                  filteredTags.map((tag) => (
                                    <div
                                      key={tag.id}
                                      className="flex items-center space-x-2 p-3 hover:bg-accent cursor-pointer"
                                      onClick={() => {
                                        const currentIds = field.value || [];
                                        if (currentIds.includes(tag.id)) {
                                          field.onChange(
                                            currentIds.filter(
                                              (id) => id !== tag.id
                                            )
                                          );
                                        } else {
                                          field.onChange([
                                            ...currentIds,
                                            tag.id,
                                          ]);
                                        }
                                      }}
                                    >
                                      <Checkbox
                                        checked={field.value?.includes(tag.id)}
                                      />
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          #{tag.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {tag._count.posts} yazı
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                              <div className="p-3 border-t">
                                <TagModal
                                  trigger={
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Yeni Etiket Ekle
                                    </Button>
                                  }
                                  onSuccess={(newTag) => {
                                    setTags((prev) => [...prev, newTag]);
                                    setOpenTagPopover(false);
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>

                          {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedTags.map((tag) => (
                                <Badge
                                  key={tag.id}
                                  variant="outline"
                                  className="gap-1"
                                >
                                  #{tag.name}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => {
                                      const currentIds = field.value || [];
                                      field.onChange(
                                        currentIds.filter((id) => id !== tag.id)
                                      );
                                    }}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
