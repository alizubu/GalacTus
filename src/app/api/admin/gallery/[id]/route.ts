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
    const { src, alt, category } = await req.json();

    // Upload base64 image to Cloudinary if needed
    let resolvedSrc = src;
    if (src !== undefined && isBase64DataUrl(String(src))) {
      try {
        resolvedSrc = await uploadToCloudinary(String(src), "portfolio/gallery");
      } catch (uploadErr) {
        console.error("Cloudinary upload error (gallery update):", uploadErr);
        return NextResponse.json(
          { error: "Image upload failed. Check your Cloudinary credentials and try again." },
          { status: 502 }
        );
      }
    }

    const item = await db.galleryItem.update({
      where: { id },
      data: {
        ...(resolvedSrc !== undefined && { src: String(resolvedSrc) }),
        ...(alt !== undefined && { alt: String(alt) }),
        ...(category !== undefined && { category: String(category) }),
      },
    });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Gallery PUT error:", error);
    return NextResponse.json({ error: "Failed to update gallery item." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    await db.galleryItem.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item." }, { status: 500 });
  }
}
