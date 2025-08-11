"use client";

import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Facebook,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { sharePost, getShareUrls } from "@/lib/utils/share";
import { toast } from "sonner";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
}

export function ShareButton({ url, title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    const result = await sharePost({ url, title, text });

    if (result.success) {
      if (result.fallback) {
        toast.success("Link panoya kopyalandı!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.success("Paylaşıldı!");
      }
    } else {
      toast.error(result.error || "Paylaşım başarısız");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link panoya kopyalandı!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Link kopyalanamadı");
    }
  };

  const shareUrls = getShareUrls(url, title, text);

  const handleSocialShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Share2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Paylaş</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleNativeShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Paylaş
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Kopyalandı!" : "Linki Kopyala"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleSocialShare("twitter")}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSocialShare("facebook")}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSocialShare("whatsapp")}>
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSocialShare("linkedin")}>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSocialShare("telegram")}>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Telegram
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
