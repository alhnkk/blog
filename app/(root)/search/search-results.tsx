"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Calendar, User, MessageCircle, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchPosts, SearchResult } from "@/lib/actions/search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function SearchResults() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("category") || "";
  const tagId = searchParams.get("tag") || "";
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      try {
        const dateFrom = dateFromParam ? new Date(dateFromParam) : undefined;
        const dateTo = dateToParam ? new Date(dateToParam) : undefined;

        const result = await searchPosts({
          query,
          categoryId: categoryId || undefined,
          tagId: tagId || undefined,
          dateFrom,
          dateTo,
          page,
          limit: 10,
        });

        if (result.success && result.data) {
          setResults(result.data.posts);
          setPagination(result.data.pagination);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [query, categoryId, tagId, dateFromParam, dateToParam, page]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <Search className="h-5 w-5 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold">
            {query ? `"${query}" için arama sonuçları` : "Arama Sonuçları"}
          </h1>
          <p className="text-muted-foreground">
            {pagination.total} sonuçtan{" "}
            {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            arası gösteriliyor
          </p>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-6">
          {results.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {post.coverImage && (
                    <div className="md:w-48 h-48 md:h-auto relative">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="space-y-3">
                      <div>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <p className="text-muted-foreground mt-2 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Categories and Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((cat) => (
                          <Link
                            key={cat.category.id}
                            href={`/categories/${cat.category.slug}`}
                          >
                            <Badge
                              variant="secondary"
                              className="hover:bg-primary hover:text-primary-foreground"
                            >
                              {cat.category.name}
                            </Badge>
                          </Link>
                        ))}
                        {post.tags.slice(0, 3).map((tag) => (
                          <Link key={tag.tag.id} href={`/tags/${tag.tag.slug}`}>
                            <Badge variant="outline" className="hover:bg-muted">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag.tag.name}
                            </Badge>
                          </Link>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline">
                            +{post.tags.length - 3} daha
                          </Badge>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author.name || post.author.email}
                        </div>
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.publishedAt)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post._count.comments} yorum
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sonuç bulunamadı</h3>
          <p className="text-muted-foreground mb-4">
            Arama kriterlerinizi değiştirmeyi deneyin
          </p>
          <Button asChild variant="outline">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-8">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Önceki
          </Button>

          {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
            const pageNum = Math.max(1, pagination.page - 2) + i;
            if (pageNum > pagination.pages) return null;

            return (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? "default" : "outline"}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  );
}
