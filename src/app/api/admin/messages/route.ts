import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id, read } = await req.json();
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
    const msg = await db.contactMessage.update({ where: { id }, data: { read } });
    return NextResponse.json(msg);
  } catch (error) {
    console.error("Messages PATCH error:", error);
    return NextResponse.json({ error: "Failed to update message." }, { status: 500 });
  }
}

// [M8] DELETE — remove a message by id
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Messages DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}
