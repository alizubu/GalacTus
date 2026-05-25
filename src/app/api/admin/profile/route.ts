import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, getSessionUser } from "@/lib/admin-guard";
import bcrypt from "bcryptjs";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

/** GET /api/admin/profile — get own profile */
export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const me = await getSessionUser();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Legacy master user (not in AdminUser table) — return session data
    if (me.id === "legacy-master") {
      return NextResponse.json({
        id: me.id, email: me.email, name: me.name,
        avatarUrl: "", role: "master", permissions: [],
      });
    }

    const user = await db.adminUser.findUnique({
      where: { id: me.id },
      select: { id: true, email: true, name: true, avatarUrl: true, role: true, permissions: true },
    });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 });
  }
}

/** PUT /api/admin/profile — update own name, avatarUrl, password */
export async function PUT(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const me = await getSessionUser();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (me.id === "legacy-master") {
      return NextResponse.json(
        { error: "Seed the master user first (run prisma/seed-master.ts) to enable profile editing." },
        { status: 400 }
      );
    }

    const { name, avatarUrl, currentPassword, newPassword } = await req.json();
    const data: Record<string, unknown> = {};

    if (name !== undefined) data.name = String(name).trim();

    // Avatar — upload to Cloudinary if base64
    if (avatarUrl !== undefined) {
      if (isBase64DataUrl(String(avatarUrl))) {
        try {
          data.avatarUrl = await uploadToCloudinary(String(avatarUrl), "portfolio/admin-avatars");
        } catch {
          return NextResponse.json({ error: "Avatar upload failed." }, { status: 502 });
        }
      } else {
        data.avatarUrl = String(avatarUrl);
      }
    }

    // Password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required." }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
      }
      const user = await db.adminUser.findUnique({ where: { id: me.id } });
      if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      data.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await db.adminUser.update({
      where: { id: me.id },
      data,
      select: { id: true, email: true, name: true, avatarUrl: true, role: true, permissions: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
