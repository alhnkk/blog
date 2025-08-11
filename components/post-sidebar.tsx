import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { LikeButton } from "./like-button";
import {
  Link2Icon,
  MessageCircle,
  Share2,
  Calendar,
  Clock,
  Tag,
  User,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PostSidebarProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    publishedAt: Date;
    readingTime?: number;
    author: {
      name: string;
      image?: string;
      bio?: string;
    };
    category: {
      name: string;
      slug: string;
    };
    tags?: Array<{
      name: string;
      slug: string;
    }>;
    _count?: {
      comments: number;
      likes: number;
    };
  };
  likeCount?: number;
  isLiked?: boolean;
  currentUser?: any;
  onLike?: () => void;
  onShare?: (platform: string) => void;
}

const PostSidebar = ({
  post,
  likeCount = 0,
  isLiked = false,
  currentUser,
  onLike,
  onShare,
}: PostSidebarProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 gün önce";
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} hafta önce`;
    return date.toLocaleDateString("tr-TR");
  };

  const handleShare = async (platform: string) => {
    const url = `${window.location.origin}/posts/${post.slug}`;
    const text = `${post.title} - ${post.excerpt || ""}`;

    switch (platform) {
      case "link":
        await navigator.clipboard.writeText(url);
        // Toast notification burada eklenebilir
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
    }

    onShare?.(platform);
  };

  return (
    <aside className="relative top-10 h-fit flex-shrink-0 lg:sticky lg:w-[300px] xl:w-[400px]">
      {/* Breadcrumb */}
      <Breadcrumb className="py-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              Ana Sayfa
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/categories/${post.category.slug}`}
              className="flex items-center gap-1"
            >
              <Tag className="h-3.5 w-3.5" />
              {post.category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1 font-medium">
              Post
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Post Title */}
      <h1 className="mb-5 text-balance text-3xl font-bold lg:text-4xl">
        {post.title}
      </h1>

      {/* Author Info */}
      <div className="flex gap-3 mb-4">
        <Avatar className="size-10 rounded-full">
          <AvatarImage src={post.author.image} alt={post.author.name} />
          <AvatarFallback>
            {post.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-semibold text-sm">{post.author.name}</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.publishedAt)}
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} dk okuma
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag.slug} href={`/tags/${tag.slug}`}>
                <Badge
                  variant="secondary"
                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between my-6 gap-x-4">
        <div className="flex items-center gap-2">
          <LikeButton
            postId={post.id}
            initialLiked={isLiked}
            initialCount={likeCount}
            currentUser={currentUser}
          />
          <span className="text-sm text-muted-foreground">{likeCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {post._count?.comments || 0}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
              Paylaş
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleShare("link")}
            >
              <Link2Icon className="h-4 w-4" />
              <span>Linki Kopyala</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleShare("twitter")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleShare("linkedin")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleShare("facebook")}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Author Bio */}
      {post.author.bio && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Yazar Hakkında</h3>
          <p className="text-sm text-muted-foreground">{post.author.bio}</p>
        </div>
      )}
    </aside>
  );
};

export default PostSidebar;
