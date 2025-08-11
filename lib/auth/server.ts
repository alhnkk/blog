// lib/auth/server.ts
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getServerSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}
