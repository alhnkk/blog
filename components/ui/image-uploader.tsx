"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { getImageKitConfig } from "@/lib/imagekit-config";
import { uploadToImageKit } from "@/lib/imagekit-upload";
import Image from "next/image";

interface ImageUploaderProps {
  onUploadSuccess: (url: string, fileId?: string) => void;
  folder?: string;
  maxFileSize?: number; // MB cinsinden
  acceptedTypes?: string[];
  showPreview?: boolean;
  previewClassName?: string;
}

export default function ImageUploader({
  onUploadSuccess,
  folder = "/blog-images",
  maxFileSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  showPreview = true,
  previewClassName = "max-w-xs",
}: ImageUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = useRef<AbortController | null>(null);

  const authenticator = async () => {
    try {
      console.log("Requesting auth from /api/upload-auth...");
      const response = await fetch("/api/upload-auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Auth response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Auth request failed:", errorText);
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Auth data received:", {
        hasToken: !!data.token,
        hasSignature: !!data.signature,
        expire: data.expire,
      });

      // ImageKit için gerekli olan publicKey ve urlEndpoint'i ekle
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
    // Dosya tipi kontrolü
    if (!acceptedTypes.includes(file.type)) {
      toast.error(
        `Desteklenmeyen dosya tipi. Kabul edilen tipler: ${acceptedTypes.join(
          ", "
        )}`
      );
      return false;
    }

    // Dosya boyutu kontrolü
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      toast.error(
        `Dosya boyutu ${maxFileSize}MB'dan büyük olamaz. Seçilen dosya: ${fileSizeMB.toFixed(
          2
        )}MB`
      );
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);

      // Önizleme için FileReader kullan
      if (showPreview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Lütfen bir dosya seçin");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    abortController.current = new AbortController();

    try {
      console.log("Getting auth params...");
      const authParams = await authenticator();
      console.log("Auth params received:", authParams);

      console.log("Starting upload with params:", {
        hasFile: !!selectedFile,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        folder,
        authParams: {
          hasToken: !!authParams.token,
          hasSignature: !!authParams.signature,
          hasPublicKey: !!authParams.publicKey,
          hasUrlEndpoint: !!authParams.urlEndpoint,
          expire: authParams.expire,
        },
      });

      // Try alternative upload method
      const uploadResponse = await uploadToImageKit(selectedFile, authParams, {
        folder: folder,
        fileName: selectedFile.name,
        useUniqueFileName: true,
        onProgress: (progress) => {
          setProgress(progress);
          console.log(`Upload progress: ${progress.toFixed(1)}%`);
        },
      });

      console.log("Upload successful:", uploadResponse);
      toast.success("Görsel başarıyla yüklendi!");
      setUploadedImageUrl(uploadResponse.url);
      onUploadSuccess(uploadResponse.url, uploadResponse.fileId);

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error details:", error);
      if (error instanceof ImageKitAbortError) {
        toast.error("Yükleme iptal edildi");
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Geçersiz istek: " + error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Ağ hatası: " + error.message);
      } else if (error instanceof ImageKitServerError) {
        toast.error("Sunucu hatası: " + error.message);
      } else {
        toast.error(
          "Yükleme sırasında bir hata oluştu: " + (error as Error).message
        );
        console.error("Upload error:", error);
      }
    } finally {
      setIsUploading(false);
      abortController.current = null;
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setIsUploading(false);
    setProgress(0);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={acceptedTypes.join(",")}
          className="hidden"
          disabled={isUploading}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Görsel Seç
        </Button>

        {selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{selectedFile.name}</span>
            <span>({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
        )}
      </div>

      {selectedFile && !isUploading && (
        <div className="flex gap-2">
          <Button onClick={handleUpload} size="sm">
            Yükle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Preview Section */}
      {showPreview && (previewUrl || uploadedImageUrl) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Önizleme:
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div
            className={`relative rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/20 ${previewClassName}`}
          >
            <Image
              fill
              src={uploadedImageUrl || previewUrl || ""}
              alt="Önizleme"
              className="w-full h-auto object-cover rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.svg";
                console.log("Image preview error, using placeholder");
              }}
            />
            {uploadedImageUrl && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                ✓ Yüklendi
              </div>
            )}
            {previewUrl && !uploadedImageUrl && (
              <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                Önizleme
              </div>
            )}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Yükleniyor...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="w-full"
          >
            İptal Et
          </Button>
        </div>
      )}
    </div>
  );
}
