import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  const items = await db.skill.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { name } = await req.json();
  const count = await db.skill.count();
  const item = await db.skill.create({ data: { name, order: count } });
  revalidatePath("/");
  return NextResponse.json(item);
}
