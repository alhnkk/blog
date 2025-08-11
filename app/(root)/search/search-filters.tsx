"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, X, Calendar, Folder, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);

  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    tag: searchParams.get("tag") || "",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
  });

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const data = await response.json();
        setTags(data.slice(0, 20)); // İlk 20 etiketi göster
      }
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.query) params.set("q", filters.query);
    if (filters.category && filters.category !== "all")
      params.set("category", filters.category);
    if (filters.tag && filters.tag !== "all") params.set("tag", filters.tag);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "all",
      tag: "all",
      dateFrom: "",
      dateTo: "",
    });
    router.push("/search");
  };

  const removeFilter = (filterKey: keyof typeof filters) => {
    const newFilters = {
      ...filters,
      [filterKey]: filterKey === "category" || filterKey === "tag" ? "all" : "",
    };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && key !== filterKey && value !== "all") {
        params.set(key === "query" ? "q" : key, value);
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (!value) return false;
    if ((key === "category" || key === "tag") && value === "all") return false;
    return true;
  }).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Arama Terimi</Label>
            <Input
              id="search-query"
              value={filters.query}
              onChange={(e) =>
                setFilters({ ...filters, query: e.target.value })
              }
              placeholder="Yazı başlığı veya içerik ara..."
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{category.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ({category._count.posts})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tag Filter */}
          <div className="space-y-2">
            <Label>Etiket</Label>
            <Select
              value={filters.tag}
              onValueChange={(value) => setFilters({ ...filters, tag: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Etiket seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Etiketler</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{tag.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ({tag._count.posts})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tarih Aralığı
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label
                  htmlFor="date-from"
                  className="text-xs text-muted-foreground"
                >
                  Başlangıç
                </Label>
                <Input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="date-to"
                  className="text-xs text-muted-foreground"
                >
                  Bitiş
                </Label>
                <Input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters({ ...filters, dateTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={applyFilters} className="flex-1">
              Filtrele
            </Button>
            <Button onClick={clearFilters} variant="outline">
              Temizle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Aktif Filtreler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.query && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  &quot;{filters.query}&quot;
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("query")}
                  />
                </Badge>
              )}
              {filters.category && filters.category !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Folder className="h-3 w-3" />
                  {categories.find((c) => c.id === filters.category)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("category")}
                  />
                </Badge>
              )}
              {filters.tag && filters.tag !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tags.find((t) => t.id === filters.tag)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("tag")}
                  />
                </Badge>
              )}
              {(filters.dateFrom || filters.dateTo) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {filters.dateFrom && filters.dateTo
                    ? `${filters.dateFrom} - ${filters.dateTo}`
                    : filters.dateFrom
                    ? `${filters.dateFrom} sonrası`
                    : `${filters.dateTo} öncesi`}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setFilters({ ...filters, dateFrom: "", dateTo: "" });
                      const params = new URLSearchParams();
                      if (filters.query) params.set("q", filters.query);
                      if (filters.category)
                        params.set("category", filters.category);
                      if (filters.tag) params.set("tag", filters.tag);
                      router.push(`/search?${params.toString()}`);
                    }}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
