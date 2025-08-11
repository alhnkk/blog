"use client";

import { useState, useCallback } from "react";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import { toast } from "sonner";

interface UploadOptions {
  folder?: string;
  maxFileSize?: number; // MB cinsinden
  acceptedTypes?: string[];
  useUniqueFileName?: boolean;
}

interface UploadResult {
  url: string;
  fileId?: string;
  name: string;
  size: number;
}

interface UseImageUploadReturn {
  uploadImage: (
    file: File,
    options?: UploadOptions
  ) => Promise<UploadResult | null>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  cancelUpload: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const authenticator = useCallback(async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  }, []);

  const validateFile = useCallback(
    (
      file: File,
      maxFileSize: number = 5,
      acceptedTypes: string[] = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ]
    ): boolean => {
      // Dosya tipi kontrolü
      if (!acceptedTypes.includes(file.type)) {
        const errorMsg = `Desteklenmeyen dosya tipi. Kabul edilen tipler: ${acceptedTypes.join(
          ", "
        )}`;
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }

      // Dosya boyutu kontrolü
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        const errorMsg = `Dosya boyutu ${maxFileSize}MB'dan büyük olamaz. Seçilen dosya: ${fileSizeMB.toFixed(
          2
        )}MB`;
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }

      return true;
    },
    []
  );

  const uploadImage = useCallback(
    async (
      file: File,
      options: UploadOptions = {}
    ): Promise<UploadResult | null> => {
      const {
        folder = "/blog-images",
        maxFileSize = 5,
        acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
        useUniqueFileName = true,
      } = options;

      // Dosya validasyonu
      if (!validateFile(file, maxFileSize, acceptedTypes)) {
        return null;
      }

      setIsUploading(true);
      setProgress(0);
      setError(null);

      const controller = new AbortController();
      setAbortController(controller);

      try {
        const authParams = await authenticator();

        const uploadResponse = await upload({
          ...authParams,
          file,
          fileName: file.name,
          folder,
          useUniqueFileName,
          onProgress: (event) => {
            const progressPercent = (event.loaded / event.total) * 100;
            setProgress(progressPercent);
          },
          abortSignal: controller.signal,
        });

        if (!uploadResponse.url) {
          throw new Error("Upload başarılı ancak URL alınamadı");
        }

        toast.success("Görsel başarıyla yüklendi!");

        return {
          url: uploadResponse.url,
          fileId: uploadResponse.fileId || uploadResponse.name,
          name: uploadResponse.name || file.name,
          size: uploadResponse.size || file.size,
        };
      } catch (error) {
        let errorMessage = "Yükleme sırasında bir hata oluştu";

        if (error instanceof ImageKitAbortError) {
          errorMessage = "Yükleme iptal edildi";
        } else if (error instanceof ImageKitInvalidRequestError) {
          errorMessage = "Geçersiz istek: " + error.message;
        } else if (error instanceof ImageKitUploadNetworkError) {
          errorMessage = "Ağ hatası: " + error.message;
        } else if (error instanceof ImageKitServerError) {
          errorMessage = "Sunucu hatası: " + error.message;
        }

        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Upload error:", error);
        return null;
      } finally {
        setIsUploading(false);
        setAbortController(null);
        setProgress(0);
      }
    },
    [authenticator, validateFile]
  );

  const cancelUpload = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsUploading(false);
      setProgress(0);
      toast.info("Yükleme iptal edildi");
    }
  }, [abortController]);

  return {
    uploadImage,
    isUploading,
    progress,
    error,
    cancelUpload,
  };
}
