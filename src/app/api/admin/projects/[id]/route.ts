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
    const { title, href, description, imageUrl, videoUrl, tags, dates, featured } =
      await req.json();

    // Upload base64 image to Cloudinary if needed
    let resolvedImageUrl = imageUrl;
    if (imageUrl !== undefined && isBase64DataUrl(String(imageUrl))) {
      try {
        resolvedImageUrl = await uploadToCloudinary(String(imageUrl), "portfolio/projects");
      } catch (uploadErr) {
        console.error("Cloudinary upload error (project image):", uploadErr);
        return NextResponse.json(
          { error: "Image upload failed. Check your Cloudinary credentials and try again." },
          { status: 502 }
        );
      }
    }

    const item = await db.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title) }),
        ...(href !== undefined && { href: String(href) }),
        ...(description !== undefined && { description: String(description) }),
        ...(resolvedImageUrl !== undefined && { imageUrl: String(resolvedImageUrl) }),
        ...(videoUrl !== undefined && { videoUrl: String(videoUrl) }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags.map(String) : [] }),
        ...(dates !== undefined && { dates: String(dates) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
      },
    });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Projects PUT error:", error);
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { id } = await params;
    await db.project.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Projects DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
