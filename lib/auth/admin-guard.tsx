import { redirect } from "next/navigation";
import { getServerSession, requireAdmin } from "./server";

interface ServerAdminGuardProps {
  children: React.ReactNode;
}

export async function ServerAdminGuard({ children }: ServerAdminGuardProps) {
  try {
    await requireAdmin();
    return <>{children}</>;
  } catch (error) {
    const session = await getServerSession();

    if (!session?.user) {
      redirect("/login");
    } else {
      redirect("/");
    }
  }
}
