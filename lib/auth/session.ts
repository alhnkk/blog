import { auth } from "./auth";
import { headers } from "next/headers";

export async function getServerSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return session;
}
