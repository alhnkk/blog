/**
 * Comprehensive ImageKit Error Handling Utilities
 * Provides centralized error handling, retry logic, and fallback mechanisms
 */

export interface ImageKitError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  userMessage: string;
}

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface FallbackOptions {
  enableFallback: boolean;
  fallbackUrl?: string;
  fallbackMessage?: string;
}

/**
 * ImageKit error codes and their handling
 */
export const ERROR_CODES = {
  // Configuration errors
  CONFIG_MISSING: "CONFIG_MISSING",
  CONFIG_INVALID: "CONFIG_INVALID",

  // Authentication errors
  AUTH_FAILED: "AUTH_FAILED",
  AUTH_EXPIRED: "AUTH_EXPIRED",
  INVALID_SIGNATURE: "INVALID_SIGNATURE",

  // Upload errors
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  UPLOAD_FAILED: "UPLOAD_FAILED",
  NETWORK_ERROR: "NETWORK_ERROR",

  // API errors
  API_LIMIT_EXCEEDED: "API_LIMIT_EXCEEDED",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT: "TIMEOUT",

  // Unknown errors
  UNKNOWN: "UNKNOWN",
} as const;

/**
 * Classify error and return structured error information
 */
export function classifyImageKitError(error: any): ImageKitError {
  // Network errors
  if (error.name === "NetworkError" || error.message?.includes("network")) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: error.message || "Network error occurred",
      details: error,
      retryable: true,
      userMessage: "Ağ bağlantısı sorunu. Lütfen tekrar deneyin.",
    };
  }

  // Timeout errors
  if (error.name === "TimeoutError" || error.message?.includes("timeout")) {
    return {
      code: ERROR_CODES.TIMEOUT,
      message: error.message || "Request timeout",
      details: error,
      retryable: true,
      userMessage: "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.",
    };
  }

  // Configuration errors
  if (
    error.message?.includes("configuration") ||
    error.message?.includes("environment")
  ) {
    return {
      code: ERROR_CODES.CONFIG_MISSING,
      message: error.message || "Configuration error",
      details: error,
      retryable: false,
      userMessage:
        "Sistem yapılandırma hatası. Lütfen yönetici ile iletişime geçin.",
    };
  }

  // Authentication errors
  if (
    error.message?.includes("authentication") ||
    error.message?.includes("signature")
  ) {
    return {
      code: ERROR_CODES.AUTH_FAILED,
      message: error.message || "Authentication failed",
      details: error,
      retryable: true,
      userMessage: "Kimlik doğrulama hatası. Lütfen tekrar deneyin.",
    };
  }

  // File size errors
  if (
    error.message?.includes("file size") ||
    error.message?.includes("too large")
  ) {
    return {
      code: ERROR_CODES.FILE_TOO_LARGE,
      message: error.message || "File too large",
      details: error,
      retryable: false,
      userMessage: "Dosya boyutu çok büyük. Lütfen daha küçük bir dosya seçin.",
    };
  }

  // File type errors
  if (
    error.message?.includes("file type") ||
    error.message?.includes("format")
  ) {
    return {
      code: ERROR_CODES.INVALID_FILE_TYPE,
      message: error.message || "Invalid file type",
      details: error,
      retryable: false,
      userMessage:
        "Desteklenmeyen dosya türü. Lütfen geçerli bir resim dosyası seçin.",
    };
  }

  // API limit errors
  if (error.message?.includes("limit") || error.message?.includes("quota")) {
    return {
      code: ERROR_CODES.API_LIMIT_EXCEEDED,
      message: error.message || "API limit exceeded",
      details: error,
      retryable: false,
      userMessage: "Yükleme limiti aşıldı. Lütfen daha sonra tekrar deneyin.",
    };
  }

  // Server errors (5xx)
  if (error.status >= 500 && error.status < 600) {
    return {
      code: ERROR_CODES.SERVER_ERROR,
      message: error.message || "Server error",
      details: error,
      retryable: true,
      userMessage: "Sunucu hatası. Lütfen tekrar deneyin.",
    };
  }

  // Default unknown error
  return {
    code: ERROR_CODES.UNKNOWN,
    message: error.message || "Unknown error occurred",
    details: error,
    retryable: true,
    userMessage: "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.",
  };
}

/**
 * Retry mechanism with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  }
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const classifiedError = classifyImageKitError(error);

      // Don't retry if error is not retryable
      if (!classifiedError.retryable) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === options.maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        options.baseDelay * Math.pow(options.backoffMultiplier, attempt),
        options.maxDelay
      );

      console.log(
        `Retry attempt ${attempt + 1}/${options.maxRetries} after ${delay}ms`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Validate ImageKit configuration
 */
export function validateImageKitConfiguration(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check environment variables
  const requiredEnvVars = [
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "IMAGEKIT_PRIVATE_KEY",
  ];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      errors.push(`Missing environment variable: ${envVar}`);
    }
  });

  // Validate URL endpoint format
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  if (urlEndpoint && !urlEndpoint.startsWith("https://ik.imagekit.io/")) {
    warnings.push("URL endpoint should start with https://ik.imagekit.io/");
  }

  // Check if keys have proper format
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (publicKey && publicKey.length < 10) {
    warnings.push("Public key seems too short");
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (privateKey && privateKey.length < 10) {
    warnings.push("Private key seems too short");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create fallback mechanism for failed uploads
 */
export function createFallbackHandler(
  options: FallbackOptions = { enableFallback: true }
) {
  return {
    handleFailure: (error: ImageKitError) => {
      if (!options.enableFallback) {
        throw error;
      }

      console.warn("ImageKit operation failed, using fallback:", error);

      return {
        url: options.fallbackUrl || "/images/placeholder.jpg",
        fileId: null,
        message:
          options.fallbackMessage ||
          "Fallback image used due to upload failure",
      };
    },
  };
}

/**
 * Enhanced error logging for debugging
 */
export function logImageKitError(error: ImageKitError, context?: any) {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
    },
    context,
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server",
  };

  if (process.env.NODE_ENV === "development") {
    console.error("ImageKit Error:", logData);
  }

  // In production, you might want to send this to a logging service
  if (process.env.NODE_ENV === "production") {
    // Example: Send to logging service
    // sendToLoggingService(logData);
  }
}

/**
 * File validation utilities
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    maxDimensions?: { width: number; height: number };
  } = {}
): Promise<{ isValid: boolean; errors: string[] }> {
  return new Promise((resolve) => {
    const errors: string[] = [];

    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      errors.push(
        `File size (${(file.size / 1024 / 1024).toFixed(
          2
        )}MB) exceeds maximum allowed size (${(
          options.maxSize /
          1024 /
          1024
        ).toFixed(2)}MB)`
      );
    }

    // Check file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      errors.push(
        `File type ${
          file.type
        } is not allowed. Allowed types: ${options.allowedTypes.join(", ")}`
      );
    }

    // Check dimensions if specified
    if (options.maxDimensions && file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        if (
          img.width > options.maxDimensions!.width ||
          img.height > options.maxDimensions!.height
        ) {
          errors.push(
            `Image dimensions (${img.width}x${
              img.height
            }) exceed maximum allowed dimensions (${
              options.maxDimensions!.width
            }x${options.maxDimensions!.height})`
          );
        }
        resolve({ isValid: errors.length === 0, errors });
      };
      img.onerror = () => {
        errors.push("Invalid image file");
        resolve({ isValid: false, errors });
      };
      img.src = URL.createObjectURL(file);
    } else {
      resolve({ isValid: errors.length === 0, errors });
    }
  });
}

/**
 * Progress tracking utilities
 */
export class UploadProgressTracker {
  private callbacks: Array<(progress: number) => void> = [];

  onProgress(callback: (progress: number) => void) {
    this.callbacks.push(callback);
  }

  updateProgress(progress: number) {
    this.callbacks.forEach((callback) => callback(progress));
  }

  reset() {
    this.callbacks = [];
  }
}

/**
 * Main ImageKit error handler class
 */
export class ImageKitErrorHandler {
  private retryOptions: RetryOptions;
  private fallbackOptions: FallbackOptions;

  constructor(
    retryOptions: Partial<RetryOptions> = {},
    fallbackOptions: Partial<FallbackOptions> = {}
  ) {
    this.retryOptions = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      ...retryOptions,
    };

    this.fallbackOptions = {
      enableFallback: true,
      ...fallbackOptions,
    };
  }

  async handleOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await retryWithBackoff(operation, this.retryOptions);
    } catch (error) {
      const classifiedError = classifyImageKitError(error);
      logImageKitError(classifiedError);

      if (this.fallbackOptions.enableFallback && classifiedError.retryable) {
        const fallbackHandler = createFallbackHandler(this.fallbackOptions);
        return fallbackHandler.handleFailure(classifiedError) as T;
      }

      throw classifiedError;
    }
  }
}
