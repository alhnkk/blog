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
  Users,
  MoreHorizontal,
  Shield,
  User,
  Calendar,
  FileText,
  MessageCircle,
} from "lucide-react";
import { getAllUsers } from "@/lib/actions/user-management";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { UserRoleButton } from "./user-role-button";
import { DeleteUserButton } from "./delete-user-button";
import { UsersErrorBoundary } from "@/components/admin/users-error-boundary";
import { UsersTableWrapper } from "@/components/admin/users-table-wrapper";

export const metadata: Metadata = {
  title: "Kullanıcı Yönetimi | Admin Panel",
  description: "Kullanıcıları yönetin",
};

async function UsersTable() {
  const result = await getAllUsers();

  if (!result.success || !result.data) {
    return (
      <UsersErrorBoundary
        error={result.error || "Bilinmeyen bir hata oluştu"}
      />
    );
  }

  const users = result.data;

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-3">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Henüz kullanıcı yok</h3>
            <p className="text-sm text-muted-foreground">
              Kayıtlı kullanıcılar burada görünecek. Kullanıcılar sisteme kayıt
              olduklarında bu listede görüntülenecekler.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Yenile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kullanıcı</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>İstatistikler</TableHead>
            <TableHead>Kayıt Tarihi</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() ||
                        user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.name || "İsimsiz Kullanıcı"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role === "ADMIN" ? (
                    <>
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3 mr-1" />
                      Kullanıcı
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {user._count.posts} yazı
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {user._count.comments} yorum
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
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
                    <UserRoleButton
                      userId={user.id}
                      currentRole={user.role || "USER"}
                    />
                    <DeleteUserButton
                      userId={user.id}
                      userName={user.name || user.email}
                      hasContent={
                        user._count.posts > 0 || user._count.comments > 0
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function UsersTableSkeleton() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kullanıcı</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>İstatistikler</TableHead>
            <TableHead>Kayıt Tarihi</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="h-6 w-20 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
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

export default function UsersPage() {
  return (
    <div className="container max-w-[1600px] mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground mt-2">
          Kayıtlı kullanıcıları yönetin ve rollerini düzenleyin.
        </p>
      </div>

      <Separator />

      {/* Users Table */}
      <UsersTableWrapper>
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTable />
        </Suspense>
      </UsersTableWrapper>
    </div>
  );
}
