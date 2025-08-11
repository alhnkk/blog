import { z } from "zod";

export const seoSettingsSchema = z.object({
  siteName: z
    .string()
    .min(1, "Site adı gerekli")
    .max(60, "Site adı 60 karakterden fazla olamaz"),
  siteDesc: z
    .string()
    .min(1, "Site açıklaması gerekli")
    .max(160, "Site açıklaması 160 karakterden fazla olamaz"),
  metaTitle: z
    .string()
    .max(60, "Meta title 60 karakterden fazla olamaz")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta açıklama 160 karakterden fazla olamaz")
    .optional(),
  ogImage: z
    .string()
    .url("Geçerli bir URL giriniz")
    .optional()
    .or(z.literal("")),
  twitterHandle: z
    .string()
    .regex(
      /^@[a-zA-Z0-9_]+$/,
      "Geçerli bir Twitter kullanıcı adı giriniz (@kullaniciadi)"
    )
    .optional()
    .or(z.literal("")),
  keywords: z.string().optional(),
});

export const postSEOSchema = z.object({
  metaTitle: z
    .string()
    .max(60, "Meta title 60 karakterden fazla olamaz")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta açıklama 160 karakterden fazla olamaz")
    .optional(),
  ogImage: z
    .string()
    .url("Geçerli bir URL giriniz")
    .optional()
    .or(z.literal("")),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z
    .string()
    .url("Geçerli bir URL giriniz")
    .optional()
    .or(z.literal("")),
});

export type SEOSettingsFormData = z.infer<typeof seoSettingsSchema>;
export type PostSEOFormData = z.infer<typeof postSEOSchema>;
