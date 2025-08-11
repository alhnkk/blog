import { Suspense } from "react";
import { getPosts } from "../../../../lib/actions/get-posts";
import { PostsTableWithBulk } from "../../../../components/admin/posts-table-with-bulk";
import { PostsTableSkeleton } from "../../../../components/admin/posts-table-skeleton";
import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PostStatus } from "../../../../lib/types";

interface PostsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: PostStatus;
    search?: string;
  }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const status = params.status as PostStatus | undefined;
  const search = params.search;

  return (
    <div className="container max-w-[1600px] mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yazılar</h1>
          <p className="text-muted-foreground">
            Blog yazılarınızı yönetin ve düzenleyin.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Yazı
          </Link>
        </Button>
      </div>

      <Suspense fallback={<PostsTableSkeleton />}>
        <PostsTableWrapper
          page={page}
          limit={limit}
          status={status}
          search={search}
        />
      </Suspense>
    </div>
  );
}

async function PostsTableWrapper({
  page,
  limit,
  status,
  search,
}: {
  page: number;
  limit: number;
  status?: PostStatus;
  search?: string;
}) {
  const result = await getPosts({
    page,
    limit,
    status,
    search,
  });

  return (
    <PostsTableWithBulk data={result.posts} pagination={result.pagination} />
  );
}
