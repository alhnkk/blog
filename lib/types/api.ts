// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

// Server Action types
export type ServerActionResult<T = any> = Promise<{
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}>;

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Search and Filter types
export interface SearchParams {
  q?: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
  pagination?: PaginationParams;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// File upload types
export interface FileUploadParams {
  file: File;
  folder?: string;
  fileName?: string;
  tags?: string[];
  isPrivate?: boolean;
}

export interface FileUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  width?: number;
  height?: number;
  format?: string;
  folder?: string;
  tags?: string[];
}

// ImageKit specific types
export interface ImageKitUploadParams {
  file: File | string;
  fileName: string;
  folder?: string;
  tags?: string[];
  isPrivateFile?: boolean;
  customCoordinates?: string;
  responseFields?: string[];
}

export interface ImageKitTransformation {
  width?: number;
  height?: number;
  aspectRatio?: string;
  crop?: "maintain_ratio" | "force" | "at_least" | "at_max";
  cropMode?: "resize" | "extract" | "pad_resize" | "pad_extract";
  focus?:
    | "center"
    | "top"
    | "left"
    | "bottom"
    | "right"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right";
  format?: "jpg" | "jpeg" | "png" | "webp" | "avif";
  quality?: number;
  blur?: number;
  grayscale?: boolean;
  progressive?: boolean;
  lossless?: boolean;
}

// Webhook types
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  signature?: string;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  active: boolean;
}

// Rate limiting types
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

// Cache types
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[];
  revalidate?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number;
  tags: string[];
}

// Background job types
export interface JobData {
  id: string;
  type: string;
  payload: any;
  priority?: number;
  delay?: number;
  attempts?: number;
  createdAt: Date;
}

export interface JobResult {
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
}

// Email types
export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailData {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  cid?: string;
}

// Analytics types
export interface AnalyticsData {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
}

export interface PageView {
  path: string;
  title?: string;
  referrer?: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
}

// Health check types
export interface HealthCheck {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: Date;
  services: {
    database: ServiceHealth;
    cache?: ServiceHealth;
    storage?: ServiceHealth;
    email?: ServiceHealth;
  };
}

export interface ServiceHealth {
  status: "healthy" | "unhealthy";
  responseTime?: number;
  error?: string;
  lastCheck: Date;
}
