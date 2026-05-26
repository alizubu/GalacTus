"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({ title, subtitle, align = "left", className = "" }: SectionTitleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.2 });
  const words = title.split(" ");

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-0.5 ${align === "center" ? "items-center text-center" : "items-start"} ${className}`}
    >
      {/* Subtitle label — small uppercase, accent color */}
      {subtitle && (
        <motion.span
          className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/70"
          initial={{ opacity: 0, y: 4 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        >
          {subtitle}
        </motion.span>
      )}

      {/* Main heading */}
      <h2
        className="font-heading text-foreground"
        style={{
          fontWeight: 700,
          fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
          letterSpacing: "-0.025em",
          lineHeight: 1.18,
          overflow: "hidden",
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", marginRight: "0.22em" }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "105%", opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.42,
                delay: 0.14 + i * 0.065,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h2>
    </div>
  );
}
