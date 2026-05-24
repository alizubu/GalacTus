"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionTitleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const words = title.split(" ");

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-1.5 ${align === "center" ? "items-center text-center" : "items-start"} ${className}`}
    >
      {/* Accent line + label — removed subtitle text as requested */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2.5"
      >
        <span className="block h-px w-6 rounded-full bg-primary/40" aria-hidden />
      </motion.div>

      {/* Main title — word by word */}
      <h2
        className="text-2xl font-bold tracking-tight text-foreground leading-tight sm:text-3xl"
        style={{ overflow: "hidden" }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em" }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "110%", opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.45,
                delay: 0.12 + i * 0.07,
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
