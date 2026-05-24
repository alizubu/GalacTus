/**
 * Cloudinary upload helper.
 * Call uploadToCloudinary(base64DataUrl, folder) from any API route.
 * Returns the secure_url string on success, throws on failure.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import { v2 as cloudinary } from "cloudinary";

// Configure once — safe to call multiple times (idempotent)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

/**
 * Upload a base64 data URL to Cloudinary.
 * @param dataUrl  e.g. "data:image/png;base64,iVBOR..."
 * @param folder   Cloudinary folder, e.g. "portfolio/avatars"
 * @returns        The secure_url of the uploaded image
 */
export async function uploadToCloudinary(
  dataUrl: string,
  folder = "portfolio"
): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    resource_type: "image",
    // Auto-format and quality for best compression
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return result.secure_url;
}

/**
 * Returns true if the string is a base64 data URL.
 */
export function isBase64DataUrl(value: string): boolean {
  return typeof value === "string" && value.startsWith("data:");
}
