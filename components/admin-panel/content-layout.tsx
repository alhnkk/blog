import { AdminBreadcrumb } from "@/components/admin-panel/breadcrumb";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <div className="container pt-8 pb-8 px-4 sm:px-8">
        <AdminBreadcrumb />
        {children}
      </div>
    </div>
  );
}
