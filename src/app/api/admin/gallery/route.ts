import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const items = await db.galleryItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json({ error: "Failed to load gallery." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { src, alt, category } = await req.json();
    if (!src) {
      return NextResponse.json({ error: "src is required." }, { status: 400 });
    }

    // Upload base64 image to Cloudinary if needed
    let resolvedSrc = String(src);
    if (isBase64DataUrl(resolvedSrc)) {
      try {
        resolvedSrc = await uploadToCloudinary(resolvedSrc, "portfolio/gallery");
      } catch (uploadErr) {
        console.error("Cloudinary upload error (gallery):", uploadErr);
        return NextResponse.json(
          { error: "Image upload failed. Check your Cloudinary credentials and try again." },
          { status: 502 }
        );
      }
    }

    const count = await db.galleryItem.count();
    const item = await db.galleryItem.create({
      data: {
        src: resolvedSrc,
        alt: String(alt ?? ""),
        category: String(category ?? ""),
        order: count,
      },
    });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json({ error: "Failed to add gallery item." }, { status: 500 });
  }
}
