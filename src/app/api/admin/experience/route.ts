import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const items = await db.experience.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Experience GET error:", error);
    return NextResponse.json({ error: "Failed to load experience." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { company, href, logo, title, location, startDate, endDate, description, badges } =
      await req.json();
    if (!company || !title || !startDate) {
      return NextResponse.json({ error: "company, title, startDate are required." }, { status: 400 });
    }
    const count = await db.experience.count();
    const item = await db.experience.create({
      data: {
        company: String(company),
        href: String(href ?? "#"),
        logo: String(logo ?? ""),
        title: String(title),
        location: String(location ?? ""),
        startDate: String(startDate),
        endDate: String(endDate ?? "Present"),
        description: String(description ?? ""),
        badges: Array.isArray(badges) ? badges.map(String) : [],
        order: count,
      },
    });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Experience POST error:", error);
    return NextResponse.json({ error: "Failed to create experience." }, { status: 500 });
  }
}
