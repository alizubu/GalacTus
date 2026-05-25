import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import BackgroundGradient from "@/components/BackgroundGradient";
import { Toaster } from "react-hot-toast";

// [C6] Dynamic metadata — reads from DB so Settings page changes take effect
export async function generateMetadata(): Promise<Metadata> {
  try {
    const { db } = await import("@/lib/db");
    const items = await db.content.findMany({
      where: { key: { in: ["site_title", "site_description", "site_url", "og_image"] } },
    });
    const map: Record<string, string> = {};
    items.forEach((i) => (map[i.key] = i.value));

    const title = map.site_title || "Shelvey Dias";
    const description = map.site_description || "Corporate Marketing Strategist & Digital Growth Expert";
    const url = map.site_url || "https://www.shelveyswork.com";
    const ogImage = map.og_image || undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: title,
        locale: "en_US",
        type: "website",
        ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      },
      twitter: { title, card: "summary_large_image" },
    };
  } catch {
    return {
      title: "Shelvey Dias",
      description: "Corporate Marketing Strategist & Digital Growth Expert",
    };
  }
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider delayDuration={0}>
        {/* [C4] Toast notifications for portfolio pages (e.g. contact form) */}
        <Toaster
          position="bottom-center"
          toastOptions={{ duration: 4000, style: { fontSize: "13px" } }}
        />
        <BackgroundGradient />
        <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
          <FlickeringGrid
            className="h-full w-full"
            squareSize={2}
            gridGap={2}
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto py-10 pb-28 sm:py-20 sm:pb-28 px-4 sm:px-5">
          {children}
        </div>
        <Navbar />
      </TooltipProvider>
    </ThemeProvider>
  );
}
