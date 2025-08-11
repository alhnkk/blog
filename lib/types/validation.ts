import { z } from "zod";

// Base validation schemas
export const emailSchema = z.string().email("Geçerli bir email adresi giriniz");
export const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalıdır");
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Geçerli bir slug formatı giriniz");

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Şifre gereklidir"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "İsim en az 2 karakter olmalıdır")
      .max(50, "İsim en fazla 50 karakter olabilir"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
    token: z.string().min(1, "Token gereklidir"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

// Post validation schemas
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Başlık gereklidir")
    .max(200, "Başlık en fazla 200 karakter olabilir"),
  content: z.string().min(1, "İçerik gereklidir"),
  excerpt: z
    .string()
    .max(500, "Özet en fazla 500 karakter olabilir")
    .optional(),
  coverImage: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Geçerli bir URL giriniz",
    }),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  featured: z.boolean(),
  publishedAt: z.date().optional(),
  categoryIds: z
    .array(z.string().cuid("Geçerli kategori ID giriniz"))
    .optional(),
  tagIds: z.array(z.string().cuid("Geçerli etiket ID giriniz")).optional(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().cuid("Geçerli post ID giriniz"),
  categoryIds: z
    .array(z.string().cuid("Geçerli kategori ID giriniz"))
    .optional(),
  tagIds: z.array(z.string().cuid("Geçerli etiket ID giriniz")).optional(),
});

export const postFiltersSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().cuid().optional(),
  tagId: z.string().cuid().optional(),
  authorId: z.string().cuid().optional(),
  search: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

// Comment validation schemas
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Yorum içeriği gereklidir")
    .max(1000, "Yorum en fazla 1000 karakter olabilir"),
  postId: z.string().cuid("Geçerli post ID giriniz"),
  parentId: z.string().cuid("Geçerli parent ID giriniz").optional(),
});

export const updateCommentSchema = z.object({
  id: z.string().cuid("Geçerli yorum ID giriniz"),
  content: z
    .string()
    .min(1, "Yorum içeriği gereklidir")
    .max(1000, "Yorum en fazla 1000 karakter olabilir"),
});

// Category validation schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Kategori adı gereklidir")
    .max(50, "Kategori adı en fazla 50 karakter olabilir"),
  description: z
    .string()
    .max(200, "Açıklama en fazla 200 karakter olabilir")
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().cuid("Geçerli kategori ID giriniz"),
});

// Tag validation schemas
export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "Etiket adı gereklidir")
    .max(30, "Etiket adı en fazla 30 karakter olabilir"),
});

export const updateTagSchema = createTagSchema.partial().extend({
  id: z.string().cuid("Geçerli etiket ID giriniz"),
});

// Site settings validation schema
export const updateSiteSettingsSchema = z.object({
  siteName: z
    .string()
    .min(1, "Site adı gereklidir")
    .max(100, "Site adı en fazla 100 karakter olabilir")
    .optional(),
  siteDesc: z
    .string()
    .max(200, "Site açıklaması en fazla 200 karakter olabilir")
    .optional(),
  logo: z.string().url("Geçerli bir logo URL giriniz").optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Geçerli bir hex renk kodu giriniz")
    .optional(),
  bgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Geçerli bir hex renk kodu giriniz")
    .optional(),
  darkBgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Geçerli bir hex renk kodu giriniz")
    .optional(),
  fgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Geçerli bir hex renk kodu giriniz")
    .optional(),
  darkFgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Geçerli bir hex renk kodu giriniz")
    .optional(),
});

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(50, "İsim en fazla 50 karakter olabilir"),
  email: emailSchema,
  subject: z
    .string()
    .min(1, "Konu gereklidir")
    .max(100, "Konu en fazla 100 karakter olabilir"),
  message: z
    .string()
    .min(10, "Mesaj en az 10 karakter olmalıdır")
    .max(1000, "Mesaj en fazla 1000 karakter olabilir"),
});

// Search and pagination schemas
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, "Sayfa numarası 1 veya daha büyük olmalıdır")
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit 1 veya daha büyük olmalıdır")
    .max(100, "Limit en fazla 100 olabilir")
    .optional()
    .default(10),
});

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  page: z
    .string()
    .transform((val) => parseInt(val) || 1)
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val) || 10)
    .optional(),
});

// File upload validation schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: "Geçerli bir dosya seçiniz" }),
  folder: z.string().optional(),
  fileName: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().optional().default(false),
});

// Image upload specific schema
export const imageUploadSchema = fileUploadSchema.extend({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type.startsWith("image/"),
      "Sadece resim dosyaları yüklenebilir"
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      "Dosya boyutu 5MB'dan küçük olmalıdır"
    ),
});

// User management schemas
export const updateUserSchema = z.object({
  id: z.string().cuid("Geçerli kullanıcı ID giriniz"),
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(50, "İsim en fazla 50 karakter olabilir")
    .optional(),
  email: emailSchema.optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  emailVerified: z.boolean().optional(),
});

// Bulk operations schemas
export const bulkDeleteSchema = z.object({
  ids: z
    .array(z.string().cuid("Geçerli ID giriniz"))
    .min(1, "En az bir öğe seçiniz"),
});

export const bulkUpdateStatusSchema = z.object({
  ids: z
    .array(z.string().cuid("Geçerli ID giriniz"))
    .min(1, "En az bir öğe seçiniz"),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
});

// Analytics and reporting schemas
export const analyticsDateRangeSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Başlangıç tarihi bitiş tarihinden önce olmalıdır",
    path: ["endDate"],
  });

export const pageViewSchema = z.object({
  path: z.string().min(1, "Sayfa yolu gereklidir"),
  title: z.string().optional(),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  userId: z.string().cuid().optional(),
  sessionId: z.string().optional(),
});

// Export inferred types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export type CreatePostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
export type PostFiltersData = z.infer<typeof postFiltersSchema>;

export type CreateCommentData = z.infer<typeof createCommentSchema>;
export type UpdateCommentData = z.infer<typeof updateCommentSchema>;

export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;

export type CreateTagData = z.infer<typeof createTagSchema>;
export type UpdateTagData = z.infer<typeof updateTagSchema>;

export type UpdateSiteSettingsData = z.infer<typeof updateSiteSettingsSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;

export type PaginationData = z.infer<typeof paginationSchema>;
export type SearchParamsData = z.infer<typeof searchParamsSchema>;

export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type ImageUploadData = z.infer<typeof imageUploadSchema>;

export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type BulkDeleteData = z.infer<typeof bulkDeleteSchema>;
export type BulkUpdateStatusData = z.infer<typeof bulkUpdateStatusSchema>;

export type AnalyticsDateRangeData = z.infer<typeof analyticsDateRangeSchema>;
export type PageViewData = z.infer<typeof pageViewSchema>;
