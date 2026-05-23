import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const { current, next } = await req.json();

    if (!current || !next) {
      return NextResponse.json({ error: "Both passwords are required." }, { status: 400 });
    }
    if (next.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const adminHash = process.env.ADMIN_PASSWORD_HASH ?? "";
    const valid = await bcrypt.compare(current, adminHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    const newHash = await bcrypt.hash(next, 10);

    // Persist the new hash to the content table so it survives deploys
    await db.content.upsert({
      where: { key: "__admin_password_hash__" },
      update: { value: newHash },
      create: { key: "__admin_password_hash__", value: newHash },
    });

    // NOTE: ADMIN_PASSWORD_HASH env var still takes priority at login time.
    // After saving here, update the env var on Vercel with the new hash shown below
    // to complete the change. The stored DB hash is used as a reference.
    return NextResponse.json({
      success: true,
      message: "Password updated. Also update ADMIN_PASSWORD_HASH in Vercel env vars.",
      // Do NOT expose the hash — removed for security
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
