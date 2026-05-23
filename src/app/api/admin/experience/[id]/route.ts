import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    const { company, href, logo, title, location, startDate, endDate, description, badges } =
      await req.json();
    const item = await db.experience.update({
      where: { id },
      data: {
        ...(company !== undefined && { company: String(company) }),
        ...(href !== undefined && { href: String(href) }),
        ...(logo !== undefined && { logo: String(logo) }),
        ...(title !== undefined && { title: String(title) }),
        ...(location !== undefined && { location: String(location) }),
        ...(startDate !== undefined && { startDate: String(startDate) }),
        ...(endDate !== undefined && { endDate: String(endDate) }),
        ...(description !== undefined && { description: String(description) }),
        ...(badges !== undefined && { badges: Array.isArray(badges) ? badges.map(String) : [] }),
      },
    });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Experience PUT error:", error);
    return NextResponse.json({ error: "Failed to update experience." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    await db.experience.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Experience DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete experience." }, { status: 500 });
  }
}
