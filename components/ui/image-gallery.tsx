"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ResponsiveImage } from "./responsive-image";

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
}

export default function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex > 0 ? selectedIndex - 1 : images.length - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        selectedIndex < images.length - 1 ? selectedIndex + 1 : 0
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      goToNext();
    } else if (event.key === "Escape") {
      closeLightbox();
    }
  };

  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer group relative overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <ResponsiveImage
              src={image.src}
              alt={image.alt}
              width={400}
              height={300}
              className="transition-transform duration-300 group-hover:scale-105"
              quality={75}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent
          className="max-w-4xl w-full h-full max-h-[90vh] p-0 bg-black/95"
          onKeyDown={handleKeyDown}
        >
          {selectedIndex !== null && images[selectedIndex] && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Previous Button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {/* Next Button */}
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}

              {/* Main Image */}
              <div className="w-full h-full flex items-center justify-center p-8">
                <ResponsiveImage
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  quality={90}
                />
              </div>

              {/* Caption */}
              {images[selectedIndex].caption && (
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white text-sm bg-black/50 rounded px-4 py-2">
                    {images[selectedIndex].caption}
                  </p>
                </div>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute top-4 left-4 text-white text-sm bg-black/50 rounded px-3 py-1">
                  {selectedIndex + 1} / {images.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
