"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { SkillItem } from "@/lib/portfolio-data";

const CATEGORIES = [
  {
    label: "Paid Advertising",
    accent: "#3b82f6",
    accentBg: "rgba(59,130,246,0.07)",
    accentBorder: "rgba(59,130,246,0.18)",
    accentText: "#2563eb",
    dot: "bg-blue-500",
    keywords: ["meta ads", "google ads", "linkedin campaign", "email marketing"],
  },
  {
    label: "SEO & Web",
    accent: "#14b8a6",
    accentBg: "rgba(20,184,166,0.07)",
    accentBorder: "rgba(20,184,166,0.18)",
    accentText: "#0f766e",
    dot: "bg-teal-500",
    keywords: ["seo", "sem", "wordpress", "elementor", "webflow", "html", "css"],
  },
  {
    label: "Analytics & CRM",
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.18)",
    accentText: "#b45309",
    dot: "bg-amber-500",
    keywords: ["analytics", "tag manager", "hubspot", "zoho", "sales navigator", "scraping", "apollo", "hunter"],
  },
  {
    label: "Design & Content",
    accent: "#a855f7",
    accentBg: "rgba(168,85,247,0.07)",
    accentBorder: "rgba(168,85,247,0.18)",
    accentText: "#7e22ce",
    dot: "bg-purple-500",
    keywords: ["brand", "canva", "adobe", "illustrator", "content", "copywriting", "market research"],
  },
];

function getCategoryForSkill(skillName: string) {
  const lower = skillName.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return CATEGORIES[CATEGORIES.length - 1]; // default to last
}

export default function SkillsSection({ items }: { items: SkillItem[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Group skills by category
  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    skills: items.filter((s) => {
      const lower = s.name.toLowerCase();
      return cat.keywords.some((kw) => lower.includes(kw));
    }),
  })).filter((g) => g.skills.length > 0);

  // Any ungrouped skills go into last category (or create an "Other" group)
  const ungrouped = items.filter((s) => {
    const lower = s.name.toLowerCase();
    return !CATEGORIES.some((cat) => cat.keywords.some((kw) => lower.includes(kw)));
  });
  if (ungrouped.length > 0) {
    if (grouped.length > 0) {
      grouped[grouped.length - 1].skills = [...grouped[grouped.length - 1].skills, ...ungrouped];
    } else {
      // All skills ungrouped — show them under a generic group
      grouped.push({
        label: "Other Skills",
        accent: "#6b7280",
        accentBg: "rgba(107,114,128,0.07)",
        accentBorder: "rgba(107,114,128,0.18)",
        accentText: "#374151",
        dot: "bg-gray-500",
        keywords: [],
        skills: ungrouped,
      });
    }
  }

  return (
    <div ref={ref} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {grouped.map((cat, ci) => (
        <motion.div
          key={cat.label}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: ci * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="group relative rounded-2xl overflow-hidden"
          style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: cat.accent }} />
          <div className="pl-5 pr-4 pt-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: cat.accentText }}>
                {cat.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill, si) => (
                <motion.span
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.25, delay: ci * 0.08 + si * 0.035 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  className="inline-flex items-center rounded-full text-[11px] font-medium px-2.5 py-[5px] cursor-default select-none transition-all duration-200"
                  style={{ background: cat.accentBg, border: `1px solid ${cat.accentBorder}`, color: cat.accentText }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
