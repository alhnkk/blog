"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveImage } from "./responsive-image";
import { ImageUploaderEnhanced } from "./image-uploader-enhanced";
import { Trash2, Upload, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoverImageManagerProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  className?: string;
  disabled?: boolean;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "3:2";
}

export function CoverImageManager({
  currentImage,
  onImageChange,
  className,
  disabled = false,
  aspectRatio = "16:9",
}: CoverImageManagerProps) {
  const [showUploader, setShowUploader] = useState(!currentImage);

  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "3:2": "aspect-[3/2]",
  };

  const handleUploadSuccess = (imageUrl: string) => {
    onImageChange(imageUrl);
    setShowUploader(false);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    setShowUploader(true);
  };

  const handleUploadError = () => {
    // Error handling can be added here if needed
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Cover Image</h3>
        {currentImage && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Active
          </Badge>
        )}
      </div>

      {currentImage && !showUploader ? (
        <Card>
          <CardContent className="p-4">
            <div
              className={cn(
                "relative overflow-hidden rounded-lg",
                aspectRatioClasses[aspectRatio]
              )}
            >
              <ResponsiveImage
                src={currentImage}
                alt="Cover image"
                fill
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Current cover image
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploader(true)}
                  disabled={disabled}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Change
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={disabled}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <ImageUploaderEnhanced
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              folder="covers"
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
              maxFileSize={5} // 5MB
              className="min-h-[200px]"
            />

            {currentImage && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploader(false)}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Guidelines */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Recommended size: 1200x675px (16:9 ratio)</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Supported formats: JPEG, PNG, WebP</p>
      </div>
    </div>
  );
}
