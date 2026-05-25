"use client";

import { motion, useReducedMotion } from "motion/react";

interface HeroTextProps {
  name: string;
  tagline: string;
  description?: string;
}

export default function HeroText({ name, tagline, description }: HeroTextProps) {
  const words = name.split(" ");
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-2" style={{ width: "100%", overflow: "hidden" }}>
      {/* Hero name — word-by-word slide-up */}
      <h1
        className="font-heading"
        style={{
          fontWeight: 800,
          fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
        }}
        aria-label={name}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}
          >
            {prefersReduced ? (
              <span style={{ display: "inline-block" }}>{word}</span>
            ) : (
              <motion.span
                style={{ display: "inline-block" }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.45,
                  delay: 0.06 + i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            )}
          </span>
        ))}
      </h1>

      {/* Tagline */}
      {tagline && (
        prefersReduced ? (
          <p className="text-muted-foreground text-base sm:text-lg font-sans">{tagline}</p>
        ) : (
          <motion.p
            className="text-muted-foreground text-base sm:text-lg font-sans"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          >
            {tagline}
          </motion.p>
        )
      )}

      {/* Sub-description */}
      {description && (
        prefersReduced ? (
          <p className="text-muted-foreground/70 text-sm font-sans">{description}</p>
        ) : (
          <motion.p
            className="text-muted-foreground/70 text-sm font-sans"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48, ease: "easeOut" }}
          >
            {description}
          </motion.p>
        )
      )}
    </div>
  );
}
