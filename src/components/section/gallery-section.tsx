/* eslint-disable @next/next/no-img-element */
"use client";

import { WordReveal, FadeUp } from "@/components/AnimatedText";
import type { GalleryItem } from "@/lib/portfolio-data";

function PosterCard({ src, alt, category }: { src: string; alt: string; category: string }) {
  return (
    <div className="group/card shrink-0 relative w-48 h-64 rounded-2xl overflow-hidden border bg-card shadow-md ring-1 ring-border/40 cursor-pointer">
      <img src={src} alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        loading="lazy" />
      <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/50 transition-all duration-300 flex flex-col justify-end p-3 gap-1">
        <span className="text-white text-xs font-semibold opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-300 leading-tight line-clamp-2">
          {alt}
        </span>
        <span className="text-white/70 text-[10px] opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-300 delay-75">
          {category}
        </span>
      </div>
    </div>
  );
}

export default function GallerySection({ items }: { items: GalleryItem[] }) {
  const row1 = [...items, ...items, ...items];
  const row2 = [...[...items].reverse(), ...[...items].reverse(), ...[...items].reverse()];

  return (
    <section id="gallery" className="overflow-hidden">
      <div className="flex min-h-0 flex-col gap-y-8 w-full">
        <div className="flex flex-col gap-y-4 items-center justify-center text-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1 shrink-0">
              <span className="text-background text-sm font-medium">Creative Gallery</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-2 items-center">
            <WordReveal text="Visual Branding & Corporate Assets" className="text-3xl font-bold tracking-tighter sm:text-4xl" />
            <FadeUp delay={0.15}>
              <p className="text-muted-foreground md:text-base/relaxed text-balance text-center max-w-lg">
                Social media posters, brand identities, and corporate design work — crafted to make every pixel count.
              </p>
            </FadeUp>
          </div>
        </div>

        {items.length > 0 ? (
          <>
            <div className="relative w-full overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-20 z-10 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-20 z-10 bg-gradient-to-l from-background to-transparent" />
              <div className="flex gap-3 w-max animate-marquee-ltr group">
                {row1.map((item, i) => <PosterCard key={`r1-${item.id}-${i}`} src={item.src} alt={item.alt} category={item.category} />)}
              </div>
            </div>
            <div className="relative w-full overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-20 z-10 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-20 z-10 bg-gradient-to-l from-background to-transparent" />
              <div className="flex gap-3 w-max animate-marquee-rtl group">
                {row2.map((item, i) => <PosterCard key={`r2-${item.id}-${i}`} src={item.src} alt={item.alt} category={item.category} />)}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground text-sm">No gallery items yet.</p>
        )}
      </div>
    </section>
  );
}
