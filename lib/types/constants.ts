// Type-safe constants for the blog platform

// User roles
export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Post statuses
export const POST_STATUSES = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  SCHEDULED: "SCHEDULED",
} as const;

export type PostStatus = (typeof POST_STATUSES)[keyof typeof POST_STATUSES];

// Theme modes
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

// Button variants
export const BUTTON_VARIANTS = {
  DEFAULT: "default",
  DESTRUCTIVE: "destructive",
  OUTLINE: "outline",
  SECONDARY: "secondary",
  GHOST: "ghost",
  LINK: "link",
} as const;

export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

// Button sizes
export const BUTTON_SIZES = {
  DEFAULT: "default",
  SM: "sm",
  LG: "lg",
  ICON: "icon",
} as const;

export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];

// Toast variants
export const TOAST_VARIANTS = {
  DEFAULT: "default",
  DESTRUCTIVE: "destructive",
  SUCCESS: "success",
  WARNING: "warning",
} as const;

export type ToastVariant = (typeof TOAST_VARIANTS)[keyof typeof TOAST_VARIANTS];

// Loading states
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type LoadingState = (typeof LOADING_STATES)[keyof typeof LOADING_STATES];

// Sort orders
export const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrder = (typeof SORT_ORDERS)[keyof typeof SORT_ORDERS];

// HTTP methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
} as const;

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

// HTTP status codes
export const HTTP_STATUS_CODES = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Error
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatusCode =
  (typeof HTTP_STATUS_CODES)[keyof typeof HTTP_STATUS_CODES];

// File types
export const FILE_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  DOCUMENT: "document",
  ARCHIVE: "archive",
  OTHER: "other",
} as const;

export type FileType = (typeof FILE_TYPES)[keyof typeof FILE_TYPES];

// Image MIME types
export const IMAGE_MIME_TYPES = {
  JPEG: "image/jpeg",
  PNG: "image/png",
  GIF: "image/gif",
  WEBP: "image/webp",
  SVG: "image/svg+xml",
  AVIF: "image/avif",
} as const;

export type ImageMimeType =
  (typeof IMAGE_MIME_TYPES)[keyof typeof IMAGE_MIME_TYPES];

// Breakpoints (Tailwind CSS)
export const BREAKPOINTS = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
  "2XL": "2xl",
} as const;

export type Breakpoint = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS];

// Device types
export const DEVICE_TYPES = {
  MOBILE: "mobile",
  TABLET: "tablet",
  DESKTOP: "desktop",
} as const;

export type DeviceType = (typeof DEVICE_TYPES)[keyof typeof DEVICE_TYPES];

// Environments
export const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export type Environment = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];

// Log levels
export const LOG_LEVELS = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  FATAL: "fatal",
} as const;

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

// OAuth providers
export const OAUTH_PROVIDERS = {
  GITHUB: "github",
  GOOGLE: "google",
} as const;

export type OAuthProvider =
  (typeof OAUTH_PROVIDERS)[keyof typeof OAUTH_PROVIDERS];

// Auth error codes
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  OAUTH_ERROR: "OAUTH_ERROR",
  VERIFICATION_REQUIRED: "VERIFICATION_REQUIRED",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

// Cache strategies
export const CACHE_STRATEGIES = {
  NO_CACHE: "no-cache",
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
} as const;

export type CacheStrategy =
  (typeof CACHE_STRATEGIES)[keyof typeof CACHE_STRATEGIES];

// Time periods
export const TIME_PERIODS = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_7_DAYS: "last7days",
  LAST_30_DAYS: "last30days",
  LAST_90_DAYS: "last90days",
  THIS_MONTH: "thisMonth",
  LAST_MONTH: "lastMonth",
  THIS_YEAR: "thisYear",
  LAST_YEAR: "lastYear",
  CUSTOM: "custom",
} as const;

export type TimePeriod = (typeof TIME_PERIODS)[keyof typeof TIME_PERIODS];

// Audit actions
export const AUDIT_ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  VIEW: "VIEW",
  EXPORT: "EXPORT",
  IMPORT: "IMPORT",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

// Permissions
export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  ADMIN: "admin",
  MODERATE: "moderate",
  PUBLISH: "publish",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Resources
export const RESOURCES = {
  POST: "post",
  COMMENT: "comment",
  USER: "user",
  CATEGORY: "category",
  TAG: "tag",
  SETTINGS: "settings",
  ANALYTICS: "analytics",
} as const;

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];

// Default values
export const DEFAULTS = {
  // Pagination
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB

  // Content limits
  MAX_TITLE_LENGTH: 200,
  MAX_EXCERPT_LENGTH: 500,
  MAX_COMMENT_LENGTH: 1000,
  MAX_CATEGORY_NAME_LENGTH: 50,
  MAX_TAG_NAME_LENGTH: 30,

  // UI
  TOAST_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // 300ms

  // Theme
  DEFAULT_THEME: THEME_MODES.SYSTEM,

  // Colors
  PRIMARY_COLOR: "#ea580c",
  LIGHT_BG_COLOR: "#DAE5E6",
  DARK_BG_COLOR: "#212223",
  LIGHT_FG_COLOR: "#252121",
  DARK_FG_COLOR: "#FFFFFF",

  // Fonts
  HEADING_FONT: "Montserrat",
  BODY_FONT: "Playfair Display",

  // Cache TTL (in seconds)
  CACHE_TTL: {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
  },

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },

  // Session
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds

  // Comment nesting
  MAX_COMMENT_DEPTH: 5,
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#[0-9A-F]{6}$/i,
  URL: /^https?:\/\/.+/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: "Bu alan gereklidir",
  INVALID_EMAIL: "Geçerli bir email adresi giriniz",
  INVALID_PASSWORD:
    "Şifre en az 8 karakter olmalı ve büyük harf, küçük harf ve rakam içermelidir",
  PASSWORDS_DONT_MATCH: "Şifreler eşleşmiyor",
  INVALID_URL: "Geçerli bir URL giriniz",
  INVALID_SLUG: "Geçerli bir slug formatı giriniz",
  INVALID_HEX_COLOR: "Geçerli bir hex renk kodu giriniz",
  FILE_TOO_LARGE: "Dosya boyutu çok büyük",
  INVALID_FILE_TYPE: "Geçersiz dosya türü",
  NETWORK_ERROR: "Ağ hatası oluştu",
  UNAUTHORIZED: "Bu işlem için yetkiniz yok",
  NOT_FOUND: "Kaynak bulunamadı",
  SERVER_ERROR: "Sunucu hatası oluştu",
  VALIDATION_ERROR: "Doğrulama hatası",
  UNKNOWN_ERROR: "Bilinmeyen hata oluştu",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: "Başarıyla oluşturuldu",
  UPDATED: "Başarıyla güncellendi",
  DELETED: "Başarıyla silindi",
  SAVED: "Başarıyla kaydedildi",
  PUBLISHED: "Başarıyla yayınlandı",
  SENT: "Başarıyla gönderildi",
  LOGGED_IN: "Başarıyla giriş yapıldı",
  LOGGED_OUT: "Başarıyla çıkış yapıldı",
  REGISTERED: "Başarıyla kayıt olundu",
  PASSWORD_RESET: "Şifre sıfırlama bağlantısı gönderildi",
  EMAIL_VERIFIED: "Email adresi doğrulandı",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/sign-in",
    REGISTER: "/api/auth/sign-up",
    LOGOUT: "/api/auth/sign-out",
    SESSION: "/api/auth/session",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
  },
  POSTS: {
    LIST: "/api/posts",
    CREATE: "/api/posts",
    GET: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
  },
  COMMENTS: {
    LIST: (postId: string) => `/api/posts/${postId}/comments`,
    CREATE: (postId: string) => `/api/posts/${postId}/comments`,
    UPDATE: (id: string) => `/api/comments/${id}`,
    DELETE: (id: string) => `/api/comments/${id}`,
  },
  CATEGORIES: {
    LIST: "/api/categories",
    CREATE: "/api/categories",
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
  },
  TAGS: {
    LIST: "/api/tags",
    CREATE: "/api/tags",
    UPDATE: (id: string) => `/api/tags/${id}`,
    DELETE: (id: string) => `/api/tags/${id}`,
  },
  UPLOAD: {
    IMAGE: "/api/upload/image",
  },
} as const;
