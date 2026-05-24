import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

// Allowed content keys — prevent arbitrary key injection
const ALLOWED_KEYS = new Set([
  "hero_name","hero_greeting","hero_tagline","hero_description","hero_avatar_url",
  "about_bio","contact_email","contact_phone","contact_address","contact_linkedin",
  "contact_website","contact_heading","contact_subtext","site_title","site_description",
  "site_url","footer_text","og_image","__admin_password_hash__",
]);

// Allowed key prefixes for dynamically-keyed content (e.g. edu_logo_<id>, exp_logo_<id>)
const ALLOWED_PREFIXES = ["edu_logo_", "exp_logo_"];

function isAllowedKey(key: string): boolean {
  return ALLOWED_KEYS.has(key) || ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

// Keys whose values might be images — upload to Cloudinary if base64
const IMAGE_KEYS = new Set(["hero_avatar_url", "og_image"]);

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
    const filtered = updates.filter(([key]) => isAllowedKey(key));

    // Upload any base64 image values to Cloudinary before saving
    const resolved: [string, string][] = await Promise.all(
      filtered.map(async ([key, value]) => {
        if (IMAGE_KEYS.has(key) && isBase64DataUrl(value)) {
          try {
            const url = await uploadToCloudinary(value, "portfolio/avatars");
            return [key, url] as [string, string];
          } catch (uploadErr) {
            console.error(`Cloudinary upload error for key "${key}":`, uploadErr);
            throw new Error(`Image upload failed for ${key}. Check your Cloudinary credentials.`);
          }
        }
        return [key, value] as [string, string];
      })
    );

    await Promise.all(
      resolved.map(([key, value]) =>
        db.content.upsert({ where: { key }, update: { value }, create: { key, value } })
      )
    );
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content PUT error:", error);
    const message = error instanceof Error ? error.message : "Failed to save content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
