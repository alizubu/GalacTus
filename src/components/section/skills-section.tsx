"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Tag } from "lucide-react";
import type { SkillItem } from "@/lib/portfolio-data";

interface Props { items: SkillItem[] }

export default function SkillsSection({ items }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  if (items.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      className="flex flex-wrap gap-2.5"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
      }}
    >
      {items.map((skill) => (
        <motion.div
          key={skill.id}
          variants={{
            hidden:   { opacity: 0, scale: 0.82, y: 8 },
            visible:  { opacity: 1, scale: 1,    y: 0,
              transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
          }}
          whileHover={{ scale: 1.06, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full
                     bg-card border border-border
                     text-foreground/80 hover:text-foreground
                     text-[13px] font-medium cursor-default select-none
                     hover:border-border/80 hover:shadow-sm
                     transition-colors duration-150"
        >
          {/* Icon — uploaded image or fallback Tag icon */}
          {skill.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={skill.iconUrl}
              alt={skill.name}
              className="w-4 h-4 object-contain shrink-0 rounded-sm"
            />
          ) : (
            <Tag size={13} className="text-muted-foreground shrink-0" strokeWidth={1.8} />
          )}
          {skill.name}
        </motion.div>
      ))}
    </motion.div>
  );
}
