import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

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

    // Upload base64 logo to Cloudinary if needed
    let resolvedLogo = logo ?? "";
    if (isBase64DataUrl(String(resolvedLogo))) {
      try {
        resolvedLogo = await uploadToCloudinary(String(resolvedLogo), "portfolio/experience");
      } catch (uploadErr) {
        console.error("Cloudinary upload error (experience logo):", uploadErr);
        return NextResponse.json(
          { error: "Image upload failed. Check your Cloudinary credentials and try again." },
          { status: 502 }
        );
      }
    }

    const count = await db.experience.count();
    const item = await db.experience.create({
      data: {
        company: String(company),
        href: String(href ?? "#"),
        logo: String(resolvedLogo),
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
