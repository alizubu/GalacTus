"use client";

import { DATA } from "@/data/resume";
import { WordReveal, FadeUp, StaggerContainer, StaggerItem } from "@/components/AnimatedText";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  const { testimonials } = DATA;

  return (
    <section id="testimonials" className="overflow-hidden">
      <div className="flex min-h-0 flex-col gap-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col gap-y-4 items-center justify-center text-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">Testimonials</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-2 items-center">
            <WordReveal
              text="Client Testimonials"
              className="text-3xl font-bold tracking-tighter sm:text-4xl"
            />
            <FadeUp delay={0.15}>
              <p className="text-muted-foreground md:text-lg/relaxed text-balance text-center">
                100% client satisfaction isn&apos;t a claim — it&apos;s a track record.
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Cards grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          staggerDelay={0.1}
        >
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="relative flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm ring-1 ring-border/40 h-full">
                {/* Quote icon */}
                <Quote className="size-5 text-muted-foreground/40 shrink-0" />

                {/* Quote text */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="size-9 rounded-full border object-cover ring-2 ring-border/40 shrink-0"
                    />
                  ) : (
                    <div className="size-9 rounded-full border bg-muted ring-2 ring-border/40 shrink-0 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold leading-none truncate">
                      {t.name}
                    </span>
                    {t.role && (
                      <span className="text-xs text-muted-foreground truncate mt-0.5">
                        {t.role}
                      </span>
                    )}
                  </div>
                  {/* Star rating */}
                  {t.stars && (
                    <div className="ml-auto flex gap-0.5 shrink-0">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <svg
                          key={i}
                          className="size-3.5 fill-amber-400 text-amber-400"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
