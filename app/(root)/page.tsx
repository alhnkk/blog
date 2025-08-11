import { BlogList } from "@/components/blog-list";
import { trackEvent } from "@/lib/actions/analytics";
import {
  getCachedHomepagePosts,
  getCachedPopularTags,
  getCachedRecentPosts,
} from "@/lib/cache";
import { HomepageSidebar } from "@/components/homepage/sidebar";
import {
  generateWebsiteStructuredData,
  generateBlogStructuredData,
} from "@/lib/utils/seo";
import { StructuredData } from "@/components/seo/structured-data";
import Newsletter from "@/components/newsletter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ana Sayfa | Modern Web Geliştirme Blog",
  description:
    "Modern web teknolojileri, React, Next.js, TypeScript ve yazılım geliştirme hakkında güncel yazılar ve rehberler.",
  keywords: [
    "web geliştirme",
    "react",
    "nextjs",
    "typescript",
    "javascript",
    "frontend",
    "backend",
  ],
  openGraph: {
    title: "Modern Web Geliştirme Blog",
    description:
      "Web geliştirme, React, Next.js ve modern teknolojiler hakkında yazılar",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Web Geliştirme Blog",
    description:
      "Web geliştirme, React, Next.js ve modern teknolojiler hakkında yazılar",
  },
  alternates: {
    canonical: "/",
  },
};

// Enable static generation with revalidation
export const revalidate = 300; // 5 minutes

const HomePage = async () => {
  // Track homepage view (non-blocking)
  trackEvent("page_view", "/").catch(console.error);

  // Fetch cached data
  const { posts, pagination } = await getCachedHomepagePosts();

  // Generate structured data for homepage
  const websiteStructuredData = generateWebsiteStructuredData();
  const blogStructuredData = generateBlogStructuredData();

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={websiteStructuredData} />
      <StructuredData data={blogStructuredData} />
      <div className="container mx-auto px-4 py-8">
        <Newsletter />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Ana İçerik */}
          <main className="flex-1">
            <BlogList
              posts={posts}
              initialPage={1}
              hasMore={pagination.page < pagination.pages}
            />
          </main>

          {/* Sidebar */}
          <div className="hidden lg:block w-px bg-border self-stretch"></div>
          <HomepageSidebar />
        </div>
      </div>
    </>
  );
};

export default HomePage;
