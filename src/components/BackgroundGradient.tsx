"use client";

import { BubbleBackground } from "@/components/animate-ui/backgrounds/bubble";

export default function BackgroundGradient() {
  return (
    <BubbleBackground
      interactive
      className="fixed inset-0 -z-10"
      style={{
        // Soft dark base — works with both light/dark mode
        background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a14 50%, #0d0d1a 100%)",
        opacity: 0.35,
      }}
      colors={{
        first:  "99,102,241",   // indigo
        second: "168,85,247",   // violet
        third:  "34,211,238",   // cyan
        fourth: "59,130,246",   // blue
        fifth:  "236,72,153",   // pink
        sixth:  "16,185,129",   // emerald (follows cursor)
      }}
      transition={{ stiffness: 80, damping: 25 }}
    />
  );
}
