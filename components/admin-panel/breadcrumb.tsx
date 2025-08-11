"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ChevronRight,
  Home,
  LayoutGrid,
  FileText,
  MessageCircle,
  Bookmark,
  Tag,
  Users,
  Settings,
  Plus,
  Edit,
} from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const routeMap: Record<string, BreadcrumbItem> = {
  "/admin": { label: "Dashboard", icon: LayoutGrid },
  "/admin/posts": { label: "Yazılar", icon: FileText },
  "/admin/posts/new": { label: "Yeni Yazı", icon: Plus },
  "/admin/comments": { label: "Yorumlar", icon: MessageCircle },
  "/admin/categories": { label: "Kategoriler", icon: Bookmark },
  "/admin/categories/new": { label: "Yeni Kategori", icon: Plus },
  "/admin/tags": { label: "Etiketler", icon: Tag },
  "/admin/tags/new": { label: "Yeni Etiket", icon: Plus },
  "/admin/users": { label: "Kullanıcılar", icon: Users },
  "/admin/settings": { label: "Ayarlar", icon: Settings },
};

export function AdminBreadcrumb() {
  const pathname = usePathname();

  // Ana sayfa için breadcrumb gösterme
  if (pathname === "/admin") {
    return null;
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [];

  // Ana sayfa her zaman ilk item
  breadcrumbItems.push({
    label: "Dashboard",
    href: "/admin",
    icon: Home,
  });

  // Path segmentlerini işle
  let currentPath = "";
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += "/" + pathSegments[i];

    // Admin segmentini atla
    if (pathSegments[i] === "admin") continue;

    const routeInfo = routeMap[currentPath];
    if (routeInfo) {
      breadcrumbItems.push({
        ...routeInfo,
        href: i === pathSegments.length - 1 ? undefined : currentPath,
      });
    } else {
      // Dynamic route için (örn: /admin/posts/[id])
      const segment = pathSegments[i];
      const isId = segment && /^[a-zA-Z0-9-_]+$/.test(segment);
      if (isId && i === pathSegments.length - 1) {
        breadcrumbItems.push({
          label: "Düzenle",
          icon: Edit,
        });
      } else {
        const segment = pathSegments[i];
        if (segment) {
          breadcrumbItems.push({
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
          });
        }
      }
    }
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  href={item.href}
                  className="flex items-center gap-1.5"
                >
                  {item.icon && <item.icon className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="flex items-center gap-1.5 font-medium">
                  {item.icon && <item.icon className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
