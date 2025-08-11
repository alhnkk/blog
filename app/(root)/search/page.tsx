import { Suspense } from "react";
import { SearchResults } from "./search-results";
import { SearchFilters } from "./search-filters";

export default function SearchPage() {
  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Suspense
            fallback={
              <div className="animate-pulse bg-muted h-96 rounded-lg" />
            }
          >
            <SearchFilters />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <Suspense
            fallback={
              <div className="animate-pulse bg-muted h-96 rounded-lg" />
            }
          >
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Arama Sonuçları",
  description: "Blog yazılarında arama yapın",
};
