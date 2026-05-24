import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    const { school, href, logo, degree, startYear, endYear } = await req.json();

    // Upload base64 logo to Cloudinary if needed
    let resolvedLogo = logo;
    if (logo !== undefined && isBase64DataUrl(String(logo))) {
      try {
        resolvedLogo = await uploadToCloudinary(String(logo), "portfolio/education");
      } catch (uploadErr) {
        console.error("Cloudinary upload error (education logo):", uploadErr);
        return NextResponse.json(
          { error: "Image upload failed. Check your Cloudinary credentials and try again." },
          { status: 502 }
        );
      }
    }

    const item = await db.education.update({
      where: { id },
      data: {
        ...(school    !== undefined && { school:    String(school) }),
        ...(href      !== undefined && { href:      String(href) }),
        ...(resolvedLogo !== undefined && { logo:   String(resolvedLogo) }),
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
