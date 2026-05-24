import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";

// Reorder items in any collection
// Body: { collection: "experience"|"skill"|"education"|"project", ids: string[] }
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const { collection, ids } = await req.json() as { collection: string; ids: string[] };

    if (!collection || !Array.isArray(ids)) {
      return NextResponse.json({ error: "collection and ids are required." }, { status: 400 });
    }

    const validCollections = ["experience", "skill", "education", "project"];
    if (!validCollections.includes(collection)) {
      return NextResponse.json({ error: "Invalid collection." }, { status: 400 });
    }

    // Update order for each id
    await Promise.all(
      ids.map((id, index) => {
        if (collection === "experience") return db.experience.update({ where: { id }, data: { order: index } });
        if (collection === "skill")      return db.skill.update({ where: { id }, data: { order: index } });
        if (collection === "education")  return db.education.update({ where: { id }, data: { order: index } });
        if (collection === "project")    return db.project.update({ where: { id }, data: { order: index } });
        return Promise.resolve();
      })
    );

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json({ error: "Failed to reorder." }, { status: 500 });
  }
}
