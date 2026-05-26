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
    <div className="flex flex-col gap-2.5" style={{ width: "100%", overflow: "hidden" }}>

      {/* H1 — hero name */}
      <h1
        className="font-heading text-foreground"
        style={{
          fontWeight: 800,
          fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
          letterSpacing: "-0.035em",
          lineHeight: 1.08,
        }}
        aria-label={name}
      >
        {words.map((word, i) => (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em" }}>
            {prefersReduced ? (
              <span style={{ display: "inline-block" }}>{word}</span>
            ) : (
              <motion.span
                style={{ display: "inline-block" }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.42, delay: 0.05 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            )}
          </span>
        ))}
      </h1>

      {/* Tagline — H2-weight, muted */}
      {tagline && (
        prefersReduced ? (
          <p className="text-muted-foreground font-sans text-base sm:text-[1.1rem] font-medium tracking-[-0.01em]">
            {tagline}
          </p>
        ) : (
          <motion.p
            className="text-muted-foreground font-sans text-base sm:text-[1.1rem] font-medium tracking-[-0.01em]"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.32, ease: "easeOut" }}
          >
            {tagline}
          </motion.p>
        )
      )}

      {/* Sub-description — body, smaller, softer */}
      {description && (
        prefersReduced ? (
          <p className="text-muted-foreground/60 font-sans text-sm leading-relaxed">
            {description}
          </p>
        ) : (
          <motion.p
            className="text-muted-foreground/60 font-sans text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.46, ease: "easeOut" }}
          >
            {description}
          </motion.p>
        )
      )}
    </div>
  );
}
