import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const items = await db.skill.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Skills GET error:", error);
    return NextResponse.json({ error: "Failed to load skills." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "name is required." }, { status: 400 });
    }
    const count = await db.skill.count();
    const item = await db.skill.create({ data: { name: name.trim(), order: count } });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Skills POST error:", error);
    return NextResponse.json({ error: "Failed to create skill." }, { status: 500 });
  }
}
