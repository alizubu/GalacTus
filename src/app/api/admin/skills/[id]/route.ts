import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    const { name, iconUrl } = await req.json();
    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return NextResponse.json({ error: "name must be a non-empty string." }, { status: 400 });
    }

    let resolvedIcon = iconUrl;
    if (iconUrl !== undefined && isBase64DataUrl(String(iconUrl))) {
      try {
        resolvedIcon = await uploadToCloudinary(String(iconUrl), "portfolio/skill-icons");
      } catch {
        return NextResponse.json({ error: "Icon upload failed." }, { status: 502 });
      }
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = String(name).trim();
    if (resolvedIcon !== undefined) data.iconUrl = String(resolvedIcon);

    const item = await db.skill.update({ where: { id }, data });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Skills PUT error:", error);
    return NextResponse.json({ error: "Failed to update skill." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    await db.skill.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Skills DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete skill." }, { status: 500 });
  }
}
