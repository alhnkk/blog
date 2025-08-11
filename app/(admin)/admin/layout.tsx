import { ServerAdminGuard } from "@/lib/auth/admin-guard";
import { AdminLayoutClient } from "./layout-client";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServerAdminGuard>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </ServerAdminGuard>
  );
}
