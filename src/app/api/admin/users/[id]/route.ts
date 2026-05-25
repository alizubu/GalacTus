import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireMaster, getSessionUser } from "@/lib/admin-guard";
import bcrypt from "bcryptjs";

/** PUT /api/admin/users/[id] — update name, email, role, permissions, password, active (master only) */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireMaster();
  if (guard) return guard;
  try {
    const { id } = await params;
    const { name, email, role, permissions, password, active } = await req.json();

    // Prevent a master from demoting themselves accidentally
    const me = await getSessionUser();
    const target = await db.adminUser.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

    if (me?.id === id && role === "user") {
      return NextResponse.json(
        { error: "You cannot demote your own account." },
        { status: 400 }
      );
    }

    // Check email uniqueness if changing
    if (email && email !== target.email) {
      const taken = await db.adminUser.findUnique({ where: { email } });
      if (taken) return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const data: Record<string, unknown> = {};
    if (name  !== undefined) data.name  = String(name).trim();
    if (email !== undefined) data.email = String(email).trim().toLowerCase();
    if (role  !== undefined && ["master","user"].includes(role)) data.role = role;
    if (permissions !== undefined) data.permissions = Array.isArray(permissions) ? permissions : [];
    if (active !== undefined) data.active = Boolean(active);
    if (password) {
      if (password.length < 8)
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await db.adminUser.update({
      where: { id },
      data,
      select: {
        id: true, email: true, name: true, avatarUrl: true,
        role: true, permissions: true, active: true, createdAt: true,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Users PUT error:", error);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

/** DELETE /api/admin/users/[id] — delete a user (master only, cannot delete self) */
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireMaster();
  if (guard) return guard;
  try {
    const { id } = await params;
    const me = await getSessionUser();
    if (me?.id === id) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }
    await db.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
