import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Space_Grotesk, Manrope, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

// H1 / big headings — Space Grotesk, medium-bold
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
  display: "swap",
});

// Sub-headings — Manrope, clean and modern
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-subheading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Paragraph / body — Inter, gold standard for readability
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
  },
  verification: {
    google: "",
    yandex: "",
  },
};

// Root layout — bare shell only (fonts, globals)
// Portfolio chrome → (portfolio)/layout.tsx
// Admin chrome    → admin/layout.tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          spaceGrotesk.variable,
          manrope.variable,
          inter.variable,
          geistMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
