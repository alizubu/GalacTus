import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    const { school, href, logo, degree, startYear, endYear } = await req.json();
    const item = await db.education.update({
      where: { id },
      data: {
        ...(school    !== undefined && { school:    String(school) }),
        ...(href      !== undefined && { href:      String(href) }),
        ...(logo      !== undefined && { logo:      String(logo) }),
        ...(degree    !== undefined && { degree:    String(degree) }),
        ...(startYear !== undefined && { startYear: String(startYear) }),
        ...(endYear   !== undefined && { endYear:   String(endYear) }),
      },
    });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Education PUT error:", error);
    return NextResponse.json({ error: "Failed to update education." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    await db.education.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Education DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete education." }, { status: 500 });
  }
}
