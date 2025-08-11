import { upload } from "@imagekit/next";
import {
  ImageKitErrorHandler,
  classifyImageKitError,
  validateFile,
  UploadProgressTracker,
  logImageKitError,
} from "./imagekit-error-handler";

export interface UploadOptions {
  folder?: string;
  fileName?: string;
  useUniqueFileName?: boolean;
  onProgress?: (progress: number) => void;
  maxRetries?: number;
  timeout?: number;
  validateBeforeUpload?: boolean;
}

export interface AuthParams {
  token: string;
  signature: string;
  expire: number;
  publicKey: string;
  urlEndpoint: string;
}

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
  size: number;
  filePath: string;
  metadata?: any;
}

// Enhanced ImageKit upload with comprehensive error handling using ImageKit/Next client
export async function uploadToImageKit(
  file: File,
  authParams: AuthParams,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const errorHandler = new ImageKitErrorHandler({
    maxRetries: options.maxRetries || 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  });

  const progressTracker = new UploadProgressTracker();
  if (options.onProgress) {
    progressTracker.onProgress(options.onProgress);
  }

  return errorHandler.handleOperation(async () => {
    // Validate file before upload if requested
    if (options.validateBeforeUpload !== false) {
      const validation = await validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB default
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        maxDimensions: { width: 4000, height: 4000 },
      });

      if (!validation.isValid) {
        const error = new Error(
          `File validation failed: ${validation.errors.join(", ")}`
        );
        throw classifyImageKitError(error);
      }
    }

    // Validate auth parameters
    if (!authParams.token || !authParams.signature || !authParams.publicKey) {
      const error = new Error("Missing required authentication parameters");
      throw classifyImageKitError(error);
    }

    // Check if auth token is expired
    if (authParams.expire < Date.now() / 1000) {
      const error = new Error("Authentication token has expired");
      throw classifyImageKitError(error);
    }

    console.log("Uploading to ImageKit with enhanced error handling:", {
      fileName: options.fileName,
      folder: options.folder,
      fileSize: file.size,
      fileType: file.type,
      hasRetry: true,
      timeout: options.timeout || 30000,
    });

    const uploadParams: any = {
      file: file,
      fileName: options.fileName || file.name,
      useUniqueFileName: options.useUniqueFileName !== false,
      publicKey: authParams.publicKey,
      urlEndpoint: authParams.urlEndpoint,
      authenticator: async () => ({
        signature: authParams.signature,
        expire: authParams.expire,
        token: authParams.token,
      }),
    };

    if (options.folder) {
      uploadParams.folder = options.folder;
    }

    return new Promise<UploadResult>((resolve, reject) => {
      const uploadParamsWithCallbacks = {
        ...uploadParams,
        onError: (error: any) => {
          console.error("ImageKit upload error:", error);
          const classifiedError = classifyImageKitError(error);
          reject(classifiedError);
        },
        onSuccess: (result: any) => {
          console.log("ImageKit upload success:", result);

          // Validate response structure
          if (!result.url || !result.fileId) {
            const error = new Error("Invalid response structure from ImageKit");
            reject(classifyImageKitError(error));
            return;
          }

          resolve({
            url: result.url,
            fileId: result.fileId,
            name: result.name,
            size: result.size,
            filePath: result.filePath,
            metadata: result,
          });
        },
        onUploadProgress: (progress: any) => {
          if (progress.loaded && progress.total) {
            const progressPercent = (progress.loaded / progress.total) * 100;
            progressTracker.updateProgress(progressPercent);
          }
        },
      };

      upload(uploadParamsWithCallbacks);
    });
  });
}

// Batch upload with error handling
export async function batchUploadToImageKit(
  files: File[],
  authParams: AuthParams,
  options: UploadOptions = {}
): Promise<Array<{ file: File; result?: UploadResult; error?: any }>> {
  const results: Array<{ file: File; result?: UploadResult; error?: any }> = [];

  for (const file of files) {
    try {
      const result = await uploadToImageKit(file, authParams, options);
      results.push({ file, result });
    } catch (error) {
      const classifiedError = classifyImageKitError(error);
      logImageKitError(classifiedError, {
        fileName: file.name,
        fileSize: file.size,
      });
      results.push({ file, error: classifiedError });
    }
  }

  return results;
}

// Upload with automatic retry and fallback
export async function uploadWithFallback(
  file: File,
  authParams: AuthParams,
  options: UploadOptions & { fallbackUrl?: string } = {}
): Promise<UploadResult> {
  try {
    return await uploadToImageKit(file, authParams, options);
  } catch (error) {
    const classifiedError = classifyImageKitError(error);
    logImageKitError(classifiedError, { fileName: file.name });

    // If fallback URL is provided and error is not retryable, use fallback
    if (options.fallbackUrl && !classifiedError.retryable) {
      console.warn(
        "Using fallback URL due to non-retryable error:",
        classifiedError
      );
      return {
        url: options.fallbackUrl,
        fileId: "fallback",
        name: file.name,
        size: file.size,
        filePath: "/fallback",
        metadata: { isFallback: true, originalError: classifiedError },
      };
    }

    throw classifiedError;
  }
}
