import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession();
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/Account/Login");
  }
  
  return session.user;
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/Account/Login");
  }
  
  return session;
}

export function isAdmin(user: any) {
  return user?.role === "admin";
}

export function isUser(user: any) {
  return user?.role === "user";
} 