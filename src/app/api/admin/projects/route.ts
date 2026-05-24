import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary, isBase64DataUrl } from "@/lib/cloudinary";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const items = await db.project.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const { title, href, description, imageUrl, videoUrl, tags, dates, featured } =
      await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required." }, { status: 400 });
    }

    // Upload base64 image to Cloudinary if needed
    let resolvedImageUrl = imageUrl ?? "";
    if (isBase64DataUrl(String(resolvedImageUrl))) {
      try {
        resolvedImageUrl = await uploadToCloudinary(String(resolvedImageUrl), "portfolio/projects");
      } catch (uploadErr) {
        console.error("Cloudinary upload error (project image):", uploadErr);
        return NextResponse.json(
          { error: "Image upload failed. Check your Cloudinary credentials and try again." },
          { status: 502 }
        );
      }
    }

    const count = await db.project.count();
    const item = await db.project.create({
      data: {
        title: String(title),
        href: String(href ?? "#"),
        description: String(description),
        imageUrl: String(resolvedImageUrl),
        videoUrl: String(videoUrl ?? ""),
        tags: Array.isArray(tags) ? tags.map(String) : [],
        dates: String(dates ?? ""),
        featured: Boolean(featured ?? true),
        order: count,
      },
    });
    revalidatePath("/");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
