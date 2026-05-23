import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { current, next } = await req.json();
  const adminHash = process.env.ADMIN_PASSWORD_HASH ?? "";

  const valid = await bcrypt.compare(current, adminHash);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  const newHash = await bcrypt.hash(next, 10);
  // In a real setup you'd persist this to DB or env. Here we return the hash to copy to .env.local
  return NextResponse.json({
    success: true,
    message: "Copy this hash to ADMIN_PASSWORD_HASH in .env.local",
    hash: newHash,
  });
}
