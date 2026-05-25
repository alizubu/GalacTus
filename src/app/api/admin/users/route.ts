import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireMaster } from "@/lib/admin-guard";
import bcrypt from "bcryptjs";

/** GET /api/admin/users — list all users (master only) */
export async function GET() {
  const guard = await requireMaster();
  if (guard) return guard;
  try {
    const users = await db.adminUser.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true, email: true, name: true, avatarUrl: true,
        role: true, permissions: true, active: true, createdAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}

/** POST /api/admin/users — create a new user (master only) */
export async function POST(req: NextRequest) {
  const guard = await requireMaster();
  if (guard) return guard;
  try {
    const { email, name, password, role, permissions } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json({ error: "email, name, and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (!["master", "user"].includes(role ?? "user")) {
      return NextResponse.json({ error: "role must be 'master' or 'user'." }, { status: 400 });
    }

    const existing = await db.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.adminUser.create({
      data: {
        email:       email.trim().toLowerCase(),
        name:        name.trim(),
        avatarUrl:   "",
        passwordHash,
        role:        role ?? "user",
        permissions: Array.isArray(permissions) ? permissions : [],
        active:      true,
      },
      select: {
        id: true, email: true, name: true, avatarUrl: true,
        role: true, permissions: true, active: true, createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Users POST error:", error);
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}
