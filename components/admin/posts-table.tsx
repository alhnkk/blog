"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Post, PostWithRelations, PostStatus } from "../../lib/types";
import { deletePost, togglePostStatus } from "../../lib/actions/get-posts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDate } from "../../lib/utils";

interface PostsTableProps {
  data: PostWithRelations[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function PostsTable({
  data,
  totalCount,
  currentPage,
  totalPages,
}: PostsTableProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostWithRelations | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleDelete = async () => {
    if (!postToDelete) return;

    setIsLoading(true);
    try {
      const result = await deletePost(postToDelete.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Post silindi");
        router.refresh();
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleStatusToggle = async (post: PostWithRelations) => {
    setIsLoading(true);
    try {
      // Toggle between PUBLISHED and DRAFT
      const newStatus: PostStatus =
        post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const result = await togglePostStatus(post.id, newStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Post durumu güncellendi");
        router.refresh();
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="default">Yayında</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Taslak</Badge>;
      case "SCHEDULED":
        return <Badge variant="outline">Zamanlandı</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Yazı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Durum filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="PUBLISHED">Yayında</SelectItem>
            <SelectItem value="DRAFT">Taslak</SelectItem>
            <SelectItem value="ARCHIVED">Arşiv</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Yazar</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Henüz yazı bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              data.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-[300px]">
                      <p className="truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {post.excerpt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    {post.categories && post.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {post.categories.slice(0, 2).map((categoryOnPost) => (
                          <Badge
                            key={categoryOnPost.category.id}
                            variant="outline"
                          >
                            {categoryOnPost.category.name}
                          </Badge>
                        ))}
                        {post.categories.length > 2 && (
                          <Badge variant="outline">
                            +{post.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{post.author.name}</TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/posts/${post.slug}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Görüntüle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/posts/${post.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusToggle(post)}
                          disabled={isLoading}
                        >
                          {post.status === "PUBLISHED" ? "Gizle" : "Yayınla"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPostToDelete(post);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yazıyı sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu yazıyı silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
