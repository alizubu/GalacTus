import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  const items = await db.content.findMany();
  const map: Record<string, string> = {};
  items.forEach((i) => (map[i.key] = i.value));
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json();
  const updates = Object.entries(body) as [string, string][];
  await Promise.all(
    updates.map(([key, value]) =>
      db.content.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
