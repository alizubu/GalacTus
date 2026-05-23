import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

// Allowed content keys — prevent arbitrary key injection
const ALLOWED_KEYS = new Set([
  "hero_name","hero_greeting","hero_tagline","hero_description","hero_avatar_url",
  "about_bio","contact_email","contact_phone","contact_address","contact_linkedin",
  "contact_website","contact_heading","contact_subtext","site_title","site_description",
  "site_url","footer_text","og_image","__admin_password_hash__",
]);

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const items = await db.content.findMany();
    const map: Record<string, string> = {};
    items.forEach((i) => (map[i.key] = i.value));
    return NextResponse.json(map);
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ error: "Failed to load content." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const body = await req.json();
    const updates = Object.entries(body) as [string, string][];
    const filtered = updates.filter(([key]) => ALLOWED_KEYS.has(key));
    await Promise.all(
      filtered.map(([key, value]) =>
        db.content.upsert({ where: { key }, update: { value }, create: { key, value } })
      )
    );
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content PUT error:", error);
    return NextResponse.json({ error: "Failed to save content." }, { status: 500 });
  }
}
