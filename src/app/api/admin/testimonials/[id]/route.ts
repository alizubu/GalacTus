import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    const { name, role, quote, stars } = await req.json();
    const data: Record<string, unknown> = {};
    if (name  !== undefined) data.name  = String(name).trim();
    if (role  !== undefined) data.role  = String(role).trim();
    if (quote !== undefined) data.quote = String(quote).trim();
    if (stars !== undefined) data.stars = Math.min(5, Math.max(1, parseInt(String(stars))));
    const item = await db.testimonial.update({ where: { id }, data });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Testimonials PUT error:", error);
    return NextResponse.json({ error: "Failed to update testimonial." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    await db.testimonial.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonials DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial." }, { status: 500 });
  }
}
