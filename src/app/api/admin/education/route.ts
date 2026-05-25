import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const items = await db.education.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Education GET error:", error);
    return NextResponse.json({ error: "Failed to load education." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    // [C3] Explicit field destructuring — no ...body spread
    const { school, href, logo, degree, startYear, endYear } = await req.json();
    if (!school || !degree) {
      return NextResponse.json({ error: "school and degree are required." }, { status: 400 });
    }

    // [C2] Upload base64 logo to Cloudinary if needed — same pattern as PUT route
    let resolvedLogo = logo ?? "";
    if (isBase64DataUrl(String(resolvedLogo))) {
      try {
        resolvedLogo = await uploadToCloudinary(String(resolvedLogo), "portfolio/education");
      } catch (uploadErr) {
        console.error("Cloudinary upload error (education logo):", uploadErr);
        return NextResponse.json(
          { error: "Image upload failed. Check your Cloudinary credentials and try again." },
          { status: 502 }
        );
      }
    }

    const count = await db.education.count();
    const item = await db.education.create({
      data: {
        school: String(school),
        href: String(href ?? "#"),
        logo: String(resolvedLogo),
        degree: String(degree),
        startYear: String(startYear ?? ""),
        endYear: String(endYear ?? ""),
        order: count,
      },
    });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Education POST error:", error);
    return NextResponse.json({ error: "Failed to create education." }, { status: 500 });
  }
}
