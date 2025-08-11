"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MessageCircle,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Reply,
  Calendar,
} from "lucide-react";
import { bulkDeleteComments } from "@/lib/actions/comment";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { AdminDeleteCommentButton } from "./delete-comment-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CommentWithRelations {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  author: {
    name: string | null;
    image: string | null;
  };
  post: {
    title: string;
    slug: string;
  };
  parent?: {
    author: {
      name: string | null;
    };
  } | null;
  _count?: {
    replies: number;
  };
}

interface CommentsTableWithBulkProps {
  comments: CommentWithRelations[];
}

export function CommentsTableWithBulk({
  comments,
}: CommentsTableWithBulkProps) {
  const router = useRouter();
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map((comment) => comment.id));
    }
  };

  const handleSelectComment = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedComments.length === 0) return;

    setIsLoading(true);
    try {
      const result = await bulkDeleteComments(selectedComments);
      if (result.success) {
        toast.success(`${result.data?.count} yorum silindi`);
        setSelectedComments([]);
        router.refresh();
      } else {
        toast.error(result.error || "Yorumlar silinemedi");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
      setBulkDeleteOpen(false);
    }
  };

  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium text-muted-foreground">Henüz yorum yok</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Blog yazılarınıza yapılan yorumlar burada görünecek.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedComments.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {selectedComments.length} yorum seçili
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setBulkDeleteOpen(true)}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Seçilenleri Sil
          </Button>
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedComments.length === comments.length &&
                    comments.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Yazar</TableHead>
              <TableHead>Yorum</TableHead>
              <TableHead>Yazı</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedComments.includes(comment.id)}
                    onCheckedChange={() => handleSelectComment(comment.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.image || ""} />
                      <AvatarFallback>
                        {comment.author.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {comment.author.name || "Anonim"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <p className="text-sm line-clamp-2">{comment.content}</p>
                    {comment.parent && (
                      <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                        <Reply className="h-3 w-3" />
                        {comment.parent.author.name}&apos;e yanıt
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/post/${comment.post.slug}`}
                    className="text-sm hover:underline flex items-center gap-1"
                  >
                    {comment.post.title}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {comment.parentId ? (
                      <Badge variant="secondary" className="text-xs">
                        Yanıt
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        Ana Yorum
                      </Badge>
                    )}
                    {comment._count?.replies && comment._count.replies > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {comment._count.replies} yanıt
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/post/${comment.post.slug}#comment-${comment.id}`}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Yazıda Görüntüle
                        </Link>
                      </DropdownMenuItem>
                      <AdminDeleteCommentButton commentId={comment.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Seçili yorumları sil</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedComments.length} yorumu silmek istediğinizden emin
              misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
