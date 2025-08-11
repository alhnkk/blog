import { Suspense } from "react";
import { Metadata } from "next";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  MessageCircle,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Reply,
  Calendar,
  User,
} from "lucide-react";
import { getAllComments, adminDeleteComment } from "@/lib/actions/comment";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";
import { CommentsTableWithBulk } from "./comments-table-with-bulk";

export const metadata: Metadata = {
  title: "Yorum Yönetimi | Admin Panel",
  description: "Blog yorumlarını yönetin",
};

async function CommentsTable() {
  const result = await getAllComments();

  if (!result.success || !result.data) {
    return (
      <Card className="container max-w-[1600px] mx-auto py-6 space-y-8">
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium text-muted-foreground">
            Yorumlar yüklenemedi
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {result.error || "Bilinmeyen bir hata oluştu"}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Transform dates to strings for client component
  const transformedComments = result.data.map((comment) => ({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    parent: comment.parent
      ? {
          ...comment.parent,
          createdAt: comment.parent.createdAt.toISOString(),
          updatedAt: comment.parent.updatedAt.toISOString(),
          author: comment.parent.author,
        }
      : null,
  }));

  return <CommentsTableWithBulk comments={transformedComments} />;
}

function CommentsTableSkeleton() {
  return (
    <Card className="container max-w-[1600px] mx-auto py-6 space-y-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Yazar</TableHead>
            <TableHead>Yorum</TableHead>
            <TableHead>Yazı</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                </div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default function CommentsPage() {
  return (
    <div className="container max-w-[1600px] mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Yorum Yönetimi</h1>
        <p className="text-muted-foreground mt-2">
          Blog yazılarınıza yapılan yorumları yönetin.
        </p>
      </div>

      <Separator />

      {/* Comments Table */}
      <Suspense fallback={<CommentsTableSkeleton />}>
        <CommentsTable />
      </Suspense>
    </div>
  );
}
