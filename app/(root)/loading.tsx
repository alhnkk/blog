import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomeLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Newsletter Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Skeleton */}
        <main className="flex-1">
          <section className="flex py-32">
            <div className="container flex flex-col items-center gap-16 mx-auto">
              <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
                {/* Blog Post Cards Skeleton */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card
                    key={i}
                    className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
                  >
                    <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                      <div className="sm:col-span-5 space-y-4">
                        {/* Tags */}
                        <div className="flex gap-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-14" />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-3/4" />
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-4/5" />
                        </div>

                        {/* Meta */}
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>

                        {/* Read More */}
                        <Skeleton className="h-6 w-32" />
                      </div>

                      {/* Image */}
                      <div className="order-first sm:order-last sm:col-span-5">
                        <Skeleton className="aspect-16/9 w-full rounded-lg" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-px bg-border self-stretch"></div>

        <aside className="w-full lg:w-80 space-y-6">
          {/* About Section */}
          <Card className="bg-transparent shadow-none border-none">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Recent Posts */}
          <Card className="bg-transparent shadow-none border-none">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                  {i < 2 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          {/* Popular Tags */}
          <Card className="bg-transparent shadow-none border-none">
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16" />
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
