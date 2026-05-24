import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { db } = await import("@/lib/db");
    const items = await db.navbarIcon.findMany({
      where: { visible: true },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}
