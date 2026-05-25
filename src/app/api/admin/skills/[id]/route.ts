import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

// [M9] PUT — rename a skill
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    const { name } = await req.json();
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "name is required." }, { status: 400 });
    }
    const item = await db.skill.update({ where: { id }, data: { name: name.trim() } });
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
