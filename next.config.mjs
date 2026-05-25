/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow Prisma and Cloudinary to work on Vercel
  serverExternalPackages: ["@prisma/client", "bcryptjs", "cloudinary"],
  // [W4] Cloudinary domain for next/image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
