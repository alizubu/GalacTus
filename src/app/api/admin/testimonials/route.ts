import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const items = await db.testimonial.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json({ error: "Failed to load testimonials." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { name, role, quote, stars } = await req.json();
    if (!name || !quote) {
      return NextResponse.json({ error: "name and quote are required." }, { status: 400 });
    }
    const count = await db.testimonial.count();
    const item = await db.testimonial.create({
      data: {
        name:  String(name).trim(),
        role:  String(role ?? "").trim(),
        quote: String(quote).trim(),
        stars: Math.min(5, Math.max(1, parseInt(String(stars ?? "5")))),
        order: count,
      },
    });
    revalidatePath("/");
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Testimonials POST error:", error);
    return NextResponse.json({ error: "Failed to create testimonial." }, { status: 500 });
  }
}
