// Utility types for better TypeScript development

// Make certain fields optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make certain fields required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Make all fields optional except specified ones
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Deep partial type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep required type
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Nullable type
export type Nullable<T> = T | null;

// Maybe type (nullable or undefined)
export type Maybe<T> = T | null | undefined;

// Non-nullable type
export type NonNullable<T> = T extends null | undefined ? never : T;

// Extract keys of a certain type
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Omit by type
export type OmitByType<T, U> = Omit<T, KeysOfType<T, U>>;

// Pick by type
export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

// String literal union to array
export type UnionToArray<T> = T extends readonly (infer U)[] ? U : never;

// Array element type
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Function parameters type
export type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Function return type
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// Promise type extraction
export type Awaited<T> = T extends Promise<infer U> ? U : T;

// Branded types for better type safety
export type Brand<T, B> = T & { __brand: B };

// Common branded types for the blog platform
export type UserId = Brand<string, "UserId">;
export type PostId = Brand<string, "PostId">;
export type CommentId = Brand<string, "CommentId">;
export type CategoryId = Brand<string, "CategoryId">;
export type TagId = Brand<string, "TagId">;
export type SessionId = Brand<string, "SessionId">;
export type Slug = Brand<string, "Slug">;
export type Email = Brand<string, "Email">;
export type Url = Brand<string, "Url">;
export type HexColor = Brand<string, "HexColor">;

// Timestamp types
export type Timestamp = Brand<number, "Timestamp">;
export type ISODateString = Brand<string, "ISODateString">;

// Database ID types
export type CuidId = Brand<string, "CuidId">;
export type UuidId = Brand<string, "UuidId">;

// Validation result types
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: any };

// API result types
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// Async operation states
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

// Form field states
export type FieldState<T> = {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
};

// Form states
export type FormState<T> = {
  [K in keyof T]: FieldState<T[K]>;
} & {
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  errors: Partial<Record<keyof T, string>>;
};

// Event handler types
export type EventHandler<T = void> = (event: T) => void;
export type AsyncEventHandler<T = void> = (event: T) => Promise<void>;

// Component ref types
export type ComponentRef<T> = React.RefObject<T> | React.MutableRefObject<T>;

// Style types
export type CSSProperties = React.CSSProperties;
export type ClassName = string | undefined | null | false;
export type ClassNameValue = ClassName | ClassName[];

// Size variants
export type Size = "xs" | "sm" | "md" | "lg" | "xl";

// Color variants
export type ColorVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

// Button variants
export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";

// Loading states
export type LoadingState = "idle" | "loading" | "success" | "error";

// Sort order
export type SortOrder = "asc" | "desc";

// Sort configuration
export type SortConfig<T> = {
  key: keyof T;
  order: SortOrder;
};

// Filter configuration
export type FilterConfig<T> = {
  [K in keyof T]?: T[K] | T[K][] | { min?: T[K]; max?: T[K] };
};

// Pagination configuration
export type PaginationConfig = {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
};

// Search configuration
export type SearchConfig = {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  caseSensitive?: boolean;
};

// Date range type
export type DateRange = {
  start: Date;
  end: Date;
};

// Time period types
export type TimePeriod =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "last90days"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"
  | "custom";

// Theme types
export type ThemeMode = "light" | "dark" | "system";

// Breakpoint types
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// Device types
export type DeviceType = "mobile" | "tablet" | "desktop";

// File types
export type FileType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "other";

// MIME types for common files
export type ImageMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml";

export type DocumentMimeType =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "text/plain"
  | "text/csv";

// HTTP methods
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

// HTTP status codes
export type HttpStatusCode =
  | 200
  | 201
  | 202
  | 204
  | 300
  | 301
  | 302
  | 304
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429
  | 500
  | 501
  | 502
  | 503
  | 504;

// Environment types
export type Environment = "development" | "staging" | "production" | "test";

// Log levels
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

// Cache strategies
export type CacheStrategy =
  | "no-cache"
  | "cache-first"
  | "network-first"
  | "stale-while-revalidate";

// Database operation types
export type DatabaseOperation =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "upsert";

// Audit log types
export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "VIEW"
  | "EXPORT"
  | "IMPORT";

// Permission types
export type Permission =
  | "read"
  | "write"
  | "delete"
  | "admin"
  | "moderate"
  | "publish";

// Resource types for permissions
export type Resource =
  | "post"
  | "comment"
  | "user"
  | "category"
  | "tag"
  | "settings"
  | "analytics";

// Generic CRUD operations
export interface CrudOperations<T, CreateInput, UpdateInput> {
  create: (input: CreateInput) => Promise<T>;
  read: (id: string) => Promise<T | null>;
  update: (id: string, input: UpdateInput) => Promise<T>;
  delete: (id: string) => Promise<void>;
  list: (options?: QueryOptions) => Promise<T[]>;
}

// Query options for database operations
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  filters?: Record<string, any>;
  include?: string[];
  select?: string[];
}

// Metadata types
export interface Metadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

// Soft delete support
export interface SoftDeletable {
  deletedAt?: Date | null;
  deletedBy?: string | null;
}

// Timestamped entity
export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

// Identifiable entity
export interface Identifiable {
  id: string;
}

// Base entity combining common traits
export interface BaseEntity extends Identifiable, Timestamped {}

// Auditable entity
export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  version: number;
}

// Publishable entity
export interface PublishableEntity extends BaseEntity {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: Date | null;
  publishedBy?: string | null;
}

// Taggable entity
export interface TaggableEntity {
  tags: string[];
}

// Categorizable entity
export interface CategorizableEntity {
  categoryId?: string;
  category?: { id: string; name: string; slug: string };
}

// Searchable entity
export interface SearchableEntity {
  searchableContent: string;
  searchVector?: string; // For full-text search
}

// SEO-friendly entity
export interface SEOEntity {
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
}

// Localizable entity
export interface LocalizableEntity {
  locale: string;
  translations?: Record<string, any>;
}

// Versionable entity
export interface VersionableEntity extends BaseEntity {
  version: number;
  parentId?: string;
  isLatest: boolean;
}
