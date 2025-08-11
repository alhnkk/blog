// Core Database Types (matching Prisma schema)
export type Role = "USER" | "ADMIN";
export type PostStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

// User Types
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithRelations extends User {
  posts?: Post[];
  comments?: Comment[];
  _count?: {
    posts: number;
    comments: number;
  };
}

// Post Types
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: PostStatus;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface PostWithRelations extends Post {
  author: User;
  categories: CategoryOnPost[];
  tags: TagOnPost[];
  comments: Comment[];
  _count?: {
    comments: number;
  };
}

export interface PostWithAuthor extends Post {
  author: Pick<User, "id" | "name" | "image">;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
}

export interface CategoryWithCount extends Category {
  _count: {
    posts: number;
  };
}

export interface CategoryOnPost {
  category: Category;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface TagWithCount extends Tag {
  _count: {
    posts: number;
  };
}

export interface TagOnPost {
  tag: Tag;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  postId: string;
  parentId: string | null;
}

export interface CommentWithRelations extends Comment {
  author: Pick<User, "id" | "name" | "image">;
  post: Pick<Post, "id" | "title" | "slug">;
  parent:
    | (Comment & {
        author: Pick<User, "name">;
      })
    | null;
  replies: CommentWithRelations[];
  _count?: {
    replies: number;
  };
}

// Site Settings Types
export interface SiteSettings {
  id: string;
  siteName: string;
  siteDesc: string;
  logo: string | null;
  primaryColor: string;
  bgColor: string;
  darkBgColor: string;
  fgColor: string;
  darkFgColor: string;
}

// Authentication Types (BetterAuth)
export interface Session {
  user: User;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: Role;
  emailVerified: boolean;
}

// Form Input Types
export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: PostStatus;
  featured?: boolean;
  publishedAt?: Date;
  categoryIds?: string[];
  tagIds?: string[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  id: string;
  content: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
  id: string;
}

export interface UpdateSiteSettingsInput
  extends Partial<Omit<SiteSettings, "id">> {}

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API Response Types
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search and Filter Types
export interface PostFilters {
  status?: PostStatus;
  featured?: boolean;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PostSearchParams {
  q?: string;
  category?: string;
  tag?: string;
  page?: string;
  limit?: string;
}

// Component Props Types
export interface PostCardProps {
  post: PostWithAuthor;
  featured?: boolean;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  className?: string;
}

export interface CommentItemProps {
  comment: CommentWithRelations;
  depth?: number;
  maxDepth?: number;
  onReply?: (parentId: string) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

// Theme Types
export type Theme = "light" | "dark" | "system";

export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
  };
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  external?: boolean;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

// Admin Dashboard Types
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  totalUsers: number;
  recentPosts: PostWithAuthor[];
  recentComments: CommentWithRelations[];
}

// Analytics Types
export interface AnalyticsStats {
  totalPageViews: number;
  uniqueVisitors: number;
  totalPostViews: number;
  topPosts: TopPostStat[];
  recentEvents: AnalyticsEvent[];
  dailyStats: DailyStat[];
}

export interface TopPostStat {
  postId: string;
  _count: {
    id: number;
  };
  post?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  path: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  userId: string | null;
  properties: unknown;
  createdAt: Date;
  user?: {
    name: string;
    email: string;
  } | null;
}

export interface DailyStat {
  date: string;
  views: number;
  unique_visitors: number;
}

export interface PostAnalytics {
  viewCount: number;
  dailyViews: DailyView[];
  referrers: Referrer[];
}

export interface DailyView {
  date: string;
  views: number;
}

export interface Referrer {
  path: string | null;
  _count: {
    id: number;
  };
}

export interface UserActivity {
  totalEvents: number;
  recentActivity: AnalyticsEvent[];
  eventTypes: EventType[];
}

export interface EventType {
  event: string;
  _count: {
    id: number;
  };
}

// Image Upload Types
export interface ImageUploadResult {
  url: string;
  fileId: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
}

export interface ImageKitResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  tags: string[];
  isPrivateFile: boolean;
  customCoordinates: string | null;
  fileType: string;
}

// Error Types
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// SEO Types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface OpenGraphData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

// Event Types for Analytics (optional) - removed duplicate

// Webhook Types (for future integrations)
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: Date;
  signature?: string;
}

// Re-export validation schemas
export {
  loginSchema,
  registerSchema,
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema,
  createCategorySchema,
  updateCategorySchema,
  createTagSchema,
  updateTagSchema,
  contactFormSchema,
  updateSiteSettingsSchema,
} from "./validation";

// Re-export validation types
export type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  CreatePostData,
  UpdatePostData,
  PostFiltersData,
  CreateCommentData,
  UpdateCommentData,
  CreateCategoryData,
  UpdateCategoryData,
  CreateTagData,
  UpdateTagData,
  UpdateSiteSettingsData,
  ContactFormData,
  PaginationData,
  SearchParamsData,
  FileUploadData,
  ImageUploadData,
  UpdateUserData,
  BulkDeleteData,
  BulkUpdateStatusData,
  AnalyticsDateRangeData,
  PageViewData,
} from "./validation";
