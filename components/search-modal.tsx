"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getSearchSuggestions,
  getPopularSearchTerms,
} from "@/lib/actions/search";

interface SearchSuggestion {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
}

interface PopularTerm {
  term: string;
  count: number;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [popularTerms, setPopularTerms] = useState<PopularTerm[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const loadPopularTerms = useCallback(async () => {
    try {
      const result = await getPopularSearchTerms(8);
      if (result.success && result.data) {
        setPopularTerms(result.data);
      }
    } catch (error) {
      console.error("Error loading popular terms:", error);
    }
  }, []);

  const loadSuggestions = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const result = await getSearchSuggestions(searchQuery, 5);
      if (result.success && result.data) {
        setSuggestions(result.data);
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load popular terms when modal opens
  useEffect(() => {
    if (open && popularTerms.length === 0) {
      loadPopularTerms();
    }
  }, [open, popularTerms.length, loadPopularTerms]);

  // Load suggestions when query changes
  useEffect(() => {
    if (debouncedQuery.trim() && debouncedQuery.length >= 2) {
      loadSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, loadSuggestions]);

  const saveRecentSearch = useCallback(
    (searchTerm: string) => {
      const updated = [
        searchTerm,
        ...recentSearches.filter((term) => term !== searchTerm),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    },
    [recentSearches]
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (searchTerm.trim()) {
        saveRecentSearch(searchTerm.trim());
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        onOpenChange(false);
        setQuery("");
      }
    },
    [router, onOpenChange, saveRecentSearch]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Arama</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Yazı, kategori veya etiket ara..."
              className="pl-10 pr-10 h-12 text-lg border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary"
              autoFocus
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        <div className="max-h-96 overflow-y-auto">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-6 pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Öneriler
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => router.push(`/posts/${suggestion.slug}`)}
                    className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium text-sm mb-1">
                      {suggestion.title}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {suggestion.excerpt || "Özet mevcut değil"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-6 pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Son Aramalar
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Temizle
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="w-full text-left p-2 rounded-md hover:bg-muted/50 transition-colors text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Terms */}
          {!query && popularTerms.length > 0 && (
            <div className="p-6 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popüler Konular
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTerms.map((term, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleSearch(term.term)}
                  >
                    {term.term} ({term.count})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query && !isLoading && suggestions.length === 0 && (
            <div className="p-6 pt-4 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                &quot;{query}&quot; için sonuç bulunamadı
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => handleSearch(query)}
              >
                Yine de ara
              </Button>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="p-6 pt-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Aranıyor...</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>↵ Ara</span>
              <span>↑↓ Gezin</span>
            </div>
            <span>ESC Kapat</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
