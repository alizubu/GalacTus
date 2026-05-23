"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// BubbleBackground uses useLayoutEffect + ResizeObserver — must be client-only
const BubbleBackground = dynamic(
  () => import("@/components/animate-ui/backgrounds/bubble").then((m) => m.BubbleBackground),
  { ssr: false }
);

export default function BackgroundGradient() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  if (isDark) {
    return (
      <BubbleBackground
        interactive
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #080810 0%, #06060e 50%, #080810 100%)",
          opacity: 0.55,
        }}
        colors={{
          first:  "99,102,241",
          second: "168,85,247",
          third:  "34,211,238",
          fourth: "59,130,246",
          fifth:  "236,72,153",
          sixth:  "16,185,129",
        }}
        transition={{ stiffness: 80, damping: 25 }}
      />
    );
  }

  return (
    <BubbleBackground
      interactive
      className="fixed inset-0 -z-10"
      style={{
        background: "linear-gradient(135deg, #f8f8ff 0%, #f5f5fe 50%, #f8f8ff 100%)",
        opacity: 0.28,
      }}
      colors={{
        first:  "199,210,254",
        second: "221,214,254",
        third:  "165,243,252",
        fourth: "191,219,254",
        fifth:  "251,207,232",
        sixth:  "167,243,208",
      }}
      transition={{ stiffness: 60, damping: 30 }}
    />
  );
}
