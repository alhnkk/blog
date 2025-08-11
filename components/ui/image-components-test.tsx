"use client";

// Bu dosya componentlerin çalışıp çalışmadığını test etmek için
import { ResponsiveImage } from "./responsive-image";
import ImageUploader from "./image-uploader";
import ImageGallery from "./image-gallery";
import { useImageUpload } from "../../hooks/use-image-upload";
import {
  generateImageUrl,
  generateThumbnail,
  generateAvatar,
} from "../../lib/imagekit-utils";

export default function ImageComponentsTest() {
  const { uploadImage, isUploading, progress } = useImageUpload();

  const handleUploadSuccess = (url: string, fileId?: string) => {
    console.log("Upload success:", url, fileId);
  };

  const testImages = [
    { src: "/test1.jpg", alt: "Test 1" },
    { src: "/test2.jpg", alt: "Test 2" },
  ];

  return (
    <div className="p-4 space-y-8">
      <h1>ImageKit Components Test</h1>

      <div>
        <h2>Image Uploader</h2>
        <ImageUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      <div>
        <h2>Responsive Image</h2>
        <ResponsiveImage
          src="/test.jpg"
          alt="Test image"
          width={400}
          height={300}
        />
      </div>

      <div>
        <h2>Post Cover Image (using ResponsiveImage)</h2>
        <ResponsiveImage
          src="/cover.jpg"
          alt="Cover image"
          width={800}
          height={400}
          className="rounded-lg"
        />
      </div>

      <div>
        <h2>Thumbnail Image (using ResponsiveImage)</h2>
        <ResponsiveImage
          src="/thumb.jpg"
          alt="Thumbnail"
          width={150}
          height={150}
          className="rounded"
        />
      </div>

      <div>
        <h2>Avatar Image (using ResponsiveImage)</h2>
        <ResponsiveImage
          src="/avatar.jpg"
          alt="Avatar"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>

      <div>
        <h2>Image Gallery</h2>
        <ImageGallery images={testImages} />
      </div>

      <div>
        <h2>Utility Functions Test</h2>
        <p>Generated URL: {generateImageUrl("/test.jpg", [{ width: 300 }])}</p>
        <p>Thumbnail URL: {generateThumbnail("/test.jpg")}</p>
        <p>Avatar URL: {generateAvatar("/test.jpg")}</p>
      </div>
    </div>
  );
}
