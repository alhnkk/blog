export interface ShareData {
  title: string;
  text?: string;
  url: string;
}

export async function sharePost(data: ShareData) {
  // Check if Web Share API is supported
  if (navigator.share) {
    try {
      await navigator.share(data);
      return { success: true };
    } catch (error) {
      // User cancelled sharing or error occurred
      console.log("Share cancelled or failed:", error);
      return { success: false, error: "Paylaşım iptal edildi" };
    }
  } else {
    // Fallback to copying URL to clipboard
    try {
      await navigator.clipboard.writeText(data.url);
      return { success: true, fallback: true };
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return { success: false, error: "URL kopyalanamadı" };
    }
  }
}

export function getShareUrls(url: string, title: string, text?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text || title);

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  };
}
