import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const items = await db.navbarIcon.findMany({ orderBy: { displayOrder: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Navbar GET error:", error);
    return NextResponse.json({ error: "Failed to load navbar." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const icons: Array<{
      id?: string;
      iconName: string;
      label: string;
      href: string;
      displayOrder: number;
      visible: boolean;
      isThemeToggle: boolean;
      isHome: boolean;
    }> = await req.json();

    // Delete all existing and recreate in the correct order (simplest for MongoDB)
    await db.navbarIcon.deleteMany({});
    await db.navbarIcon.createMany({
      data: icons.map((icon, i) => ({
        iconName: icon.iconName,
        label: icon.label,
        href: icon.href ?? "#",
        displayOrder: i,
        visible: icon.visible ?? true,
        isThemeToggle: icon.isThemeToggle ?? false,
        isHome: icon.isHome ?? false,
      })),
    });

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Navbar POST error:", error);
    return NextResponse.json({ error: "Failed to save navbar." }, { status: 500 });
  }
}
