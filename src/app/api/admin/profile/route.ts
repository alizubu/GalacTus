import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, getSessionUser } from "@/lib/admin-guard";
import bcrypt from "bcryptjs";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

/** Returns true if s looks like a valid MongoDB ObjectID (24-char hex string) */
function isValidObjectId(s: string): boolean {
  return /^[a-f\d]{24}$/i.test(s);
}

/**
 * Auto-seed: if the legacy master is editing their profile for the first time,
 * create the AdminUser row on the fly so they don't need to run seed-master.ts.
 * Returns the newly created (or already existing) AdminUser.
 */
async function ensureMasterUser(email: string): Promise<{ id: string; name: string; avatarUrl: string; passwordHash: string }> {
  // Check if already exists
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) return existing;

  // Read the best available hash
  let hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  try {
    const stored = await db.content.findUnique({ where: { key: "__admin_password_hash__" } });
    if (stored?.value) hash = stored.value;
  } catch {}

  // Read stored name/avatar from content table if available
  let name = "Admin";
  let avatarUrl = "";
  try {
    const items = await db.content.findMany({
      where: { key: { in: ["hero_name", "hero_avatar_url"] } },
    });
    items.forEach((i) => {
      if (i.key === "hero_name")       name      = i.value;
      if (i.key === "hero_avatar_url") avatarUrl = i.value;
    });
  } catch {}

  const created = await db.adminUser.create({
    data: {
      email,
      name,
      avatarUrl,
      passwordHash: hash,
      role:         "master",
      permissions:  [],
      active:       true,
    },
  });
  return created;
}

/** GET /api/admin/profile — get own profile */
export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const me = await getSessionUser();
    if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Legacy session — auto-seed and return real data
    if (!isValidObjectId(me.id)) {
      try {
        const user = await ensureMasterUser(me.email);
        return NextResponse.json({
          id:          user.id,
          email:       me.email,
          name:        user.name,
          avatarUrl:   user.avatarUrl,
          role:        "master",
          permissions: [],
        });
      } catch {
        // DB unavailable — return session data as-is
        return NextResponse.json({
          id: me.id, email: me.email, name: me.name,
          avatarUrl: "", role: "master", permissions: [],
        });
      }
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

    // Legacy session — auto-seed master user, then update
    let userId = me.id;
    if (!isValidObjectId(me.id)) {
      try {
        const user = await ensureMasterUser(me.email);
        userId = user.id;
      } catch {
        return NextResponse.json(
          { error: "Database unavailable. Cannot update profile." },
          { status: 503 }
        );
      }
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
      const user = await db.adminUser.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      data.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await db.adminUser.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, avatarUrl: true, role: true, permissions: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
