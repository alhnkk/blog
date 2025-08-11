"use client";

import { useState, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageKitConfig } from "@/lib/imagekit-config";
import { uploadToImageKit, uploadWithFallback } from "@/lib/imagekit-upload";
import {
  classifyImageKitError,
  logImageKitError,
} from "@/lib/imagekit-error-handler";
import Image from "next/image";

interface ImageUploaderEnhancedProps {
  onUploadSuccess: (url: string, fileId?: string) => void;
  onUploadError?: (error: any) => void;
  folder?: string;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  showPreview?: boolean;
  multiple?: boolean;
  initialValue?: string;
  enableRetry?: boolean;
  fallbackUrl?: string;
}

export function ImageUploaderEnhanced({
  onUploadSuccess,
  onUploadError,
  folder = "/blog-images",
  maxFileSize = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  className,
  showPreview = true,
  multiple = false,
  initialValue,
  enableRetry = true,
  fallbackUrl,
}: ImageUploaderEnhancedProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const config = getImageKitConfig();

      return {
        ...data,
        ...config,
      };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error(
        "Authentication request failed: " + (error as Error).message
      );
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error(
        `Desteklenmeyen dosya türü. Kabul edilen türler: ${acceptedTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`
      );
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      toast.error(`Dosya boyutu ${maxFileSize}MB'dan küçük olmalıdır`);
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File, isRetry = false) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const authParams = await authenticator();

      const uploadOptions = {
        folder: folder,
        fileName: file.name,
        useUniqueFileName: true,
        onProgress: (progress: number) => {
          setUploadProgress(progress);
        },
        maxRetries: enableRetry ? 3 : 0,
        timeout: 30000,
        validateBeforeUpload: true,
      };

      const uploadResponse =
        enableRetry && fallbackUrl
          ? await uploadWithFallback(file, authParams, {
              ...uploadOptions,
              fallbackUrl,
            })
          : await uploadToImageKit(file, authParams, uploadOptions);

      onUploadSuccess(uploadResponse.url, uploadResponse.fileId);

      if (showPreview) {
        setPreview(uploadResponse.url);
      }

      toast.success("Resim başarıyla yüklendi!");
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      const classifiedError = classifyImageKitError(error);
      logImageKitError(classifiedError, {
        fileName: file.name,
        fileSize: file.size,
      });

      setError(classifiedError.userMessage);

      // Call error callback if provided
      if (onUploadError) {
        onUploadError(classifiedError);
      }

      // Show user-friendly error message
      toast.error(classifiedError.userMessage);

      // Increment retry count for retryable errors
      if (classifiedError.retryable && enableRetry) {
        setRetryCount((prev) => prev + 1);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (multiple) {
      Array.from(files).forEach((file) => uploadFile(file));
    } else if (files[0]) {
      uploadFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          isUploading && "pointer-events-none opacity-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Yükleniyor...
              </p>
              {uploadProgress > 0 && (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>İlerleme</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : error ? (
            <>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mb-4">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-sm font-medium text-red-600 mb-2">
                Yükleme Hatası
              </p>
              <p className="text-xs text-muted-foreground mb-4">{error}</p>
              {enableRetry && retryCount < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = fileInputRef.current;
                    if (input?.files?.[0]) {
                      uploadFile(input.files[0], true);
                    }
                  }}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Tekrar Dene ({retryCount + 1}/3)
                </Button>
              )}
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-2">
                Resim yüklemek için tıklayın veya sürükleyip bırakın
              </p>
              <p className="text-xs text-muted-foreground">
                Maksimum {maxFileSize}MB, desteklenen formatlar:{" "}
                {acceptedTypes.map((type) => type.split("/")[1]).join(", ")}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Manual URL Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Veya resim URL&apos;si girin:
        </label>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const url = (e.target as HTMLInputElement).value;
                if (url) {
                  onUploadSuccess(url, "manual-url");
                  if (showPreview) {
                    setPreview(url);
                  }
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.querySelector(
                'input[type="url"]'
              ) as HTMLInputElement;
              const url = input?.value;
              if (url) {
                onUploadSuccess(url, "manual-url");
                if (showPreview) {
                  setPreview(url);
                }
                input.value = "";
              }
            }}
          >
            Ekle
          </Button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && preview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Önizleme:</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearPreview}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative max-w-md rounded-lg border overflow-hidden bg-muted/20">
            <Image
              fill
              src={preview}
              alt="Yüklenen resim önizlemesi"
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.svg";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
