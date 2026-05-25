"use client";

import { motion } from "motion/react";

interface HeroTextProps {
  name: string;
  tagline: string;
  description?: string;
}

export default function HeroText({ name, tagline, description }: HeroTextProps) {
  const words = name.split(" ");

  return (
    <div className="flex flex-col gap-2">
      {/* Hero name — word-by-word slide-up */}
      <h1
        className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight"
        style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
        aria-label={name}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "105%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.08 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* Tagline — fade in after name */}
      {tagline && (
        <motion.p
          className="text-muted-foreground text-base sm:text-lg font-sans"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          {tagline}
        </motion.p>
      )}

      {/* Sub-description */}
      {description && (
        <motion.p
          className="text-muted-foreground/70 text-sm font-sans"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
