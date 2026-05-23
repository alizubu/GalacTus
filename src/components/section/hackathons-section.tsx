/* eslint-disable @next/next/no-img-element */
"use client";

import { DATA } from "@/data/resume";

// Duplicate items for seamless infinite loop
const images = DATA.hackathons
  .filter((h) => h.image)
  .map((h) => ({ src: h.image as string, alt: h.title }));

// We need at least 2 full sets for the seamless loop
const track = [...images, ...images, ...images];

export default function HackathonsSection() {
  return (
    <section id="hackathons" className="overflow-hidden">
      <div className="flex min-h-0 flex-col gap-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">Hackathons</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
        </div>

        {/* Marquee gallery — row 1: left to right */}
        <div className="relative w-full overflow-hidden">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-background to-transparent" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-background to-transparent" />

          <div className="flex gap-4 w-max animate-marquee-ltr">
            {track.map((item, i) => (
              <div
                key={i}
                className="shrink-0 size-16 rounded-xl border bg-card shadow ring-1 ring-border/40 flex items-center justify-center p-2 overflow-hidden"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Marquee gallery — row 2: right to left (reverse) */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-background to-transparent" />

          <div className="flex gap-4 w-max animate-marquee-rtl">
            {[...track].reverse().map((item, i) => (
              <div
                key={i}
                className="shrink-0 size-16 rounded-xl border bg-card shadow ring-1 ring-border/40 flex items-center justify-center p-2 overflow-hidden"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
