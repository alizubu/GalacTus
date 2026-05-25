import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/** Any authenticated admin (master OR user) */
export async function requireAdmin() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Only the master role */
export async function requireMaster() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "master") {
    return NextResponse.json({ error: "Forbidden — master access required." }, { status: 403 });
  }
  return null;
}

/**
 * Requires master role OR the specified permission key.
 * @param permission  e.g. "hero", "experience", "gallery"
 */
export async function requirePermission(permission: string) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { role, permissions } = session.user;
  if (role !== "master" && !permissions.includes(permission)) {
    return NextResponse.json(
      { error: `Forbidden — '${permission}' permission required.` },
      { status: 403 }
    );
  }
  return null;
}

/** Returns the current session user's role and permissions (or null if not authed) */
export async function getSessionUser() {
  const session = await auth();
  if (!session) return null;
  return {
    id:          session.user.id,
    email:       session.user.email ?? "",
    name:        session.user.name  ?? "",
    avatarUrl:   session.user.avatarUrl ?? "",
    role:        session.user.role  ?? "user",
    permissions: session.user.permissions ?? [],
  };
}
