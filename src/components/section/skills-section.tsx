"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  TrendingUp, Globe, BarChart2, Palette,
  Megaphone, Search, Linkedin, Mail,
  BarChart, Pen, Star, Tag, Settings,
  Database, Users, BookOpen, Layers, FileText,
} from "lucide-react";
import type { SkillItem } from "@/lib/portfolio-data";

// ── Category definitions ──────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: "Paid Advertising",
    icon: TrendingUp,
    accent: "#3b82f6",
    accentLight: "rgba(59,130,246,0.10)",
    accentBorder: "rgba(59,130,246,0.20)",
    keywords: ["meta ads", "google ads", "linkedin campaign", "email marketing"],
  },
  {
    label: "SEO & Web",
    icon: Globe,
    accent: "#0d9488",
    accentLight: "rgba(13,148,136,0.10)",
    accentBorder: "rgba(13,148,136,0.20)",
    keywords: ["seo", "sem", "wordpress", "elementor", "webflow", "html", "css"],
  },
  {
    label: "Analytics & CRM",
    icon: BarChart2,
    accent: "#d97706",
    accentLight: "rgba(217,119,6,0.10)",
    accentBorder: "rgba(217,119,6,0.20)",
    keywords: ["analytics", "tag manager", "hubspot", "zoho", "sales navigator", "scraping", "apollo", "hunter"],
  },
  {
    label: "Design & Content",
    icon: Palette,
    accent: "#9333ea",
    accentLight: "rgba(147,51,234,0.10)",
    accentBorder: "rgba(147,51,234,0.20)",
    keywords: ["brand", "canva", "adobe", "illustrator", "content", "copywriting", "market research"],
  },
];

// ── Per-skill colorful icon map ────────────────────────────────────────────
type SkillIconDef = { icon: typeof Tag; color: string; bg: string };

function getSkillIconDef(name: string): SkillIconDef {
  const lower = name.toLowerCase();

  if (lower.includes("meta ads") || lower.includes("facebook"))
    return { icon: Megaphone, color: "#2563eb", bg: "rgba(37,99,235,0.10)" };
  if (lower.includes("google ads"))
    return { icon: Search,   color: "#ea4335", bg: "rgba(234,67,53,0.10)" };
  if (lower.includes("linkedin"))
    return { icon: Linkedin, color: "#0a66c2", bg: "rgba(10,102,194,0.10)" };
  if (lower.includes("email"))
    return { icon: Mail,     color: "#7c3aed", bg: "rgba(124,58,237,0.10)" };
  if (lower.includes("seo") || lower.includes("sem"))
    return { icon: TrendingUp, color: "#059669", bg: "rgba(5,150,105,0.10)" };
  if (lower.includes("wordpress"))
    return { icon: Globe,    color: "#21759b", bg: "rgba(33,117,155,0.10)" };
  if (lower.includes("webflow"))
    return { icon: Layers,   color: "#4353ff", bg: "rgba(67,83,255,0.10)" };
  if (lower.includes("elementor"))
    return { icon: Layers,   color: "#92003b", bg: "rgba(146,0,59,0.10)" };
  if (lower.includes("html") || lower.includes("css"))
    return { icon: Settings, color: "#e34f26", bg: "rgba(227,79,38,0.10)" };
  if (lower.includes("analytics") || lower.includes("tag manager"))
    return { icon: BarChart, color: "#f59e0b", bg: "rgba(245,158,11,0.10)" };
  if (lower.includes("hubspot"))
    return { icon: Database, color: "#ff7a59", bg: "rgba(255,122,89,0.10)" };
  if (lower.includes("zoho") || lower.includes("crm"))
    return { icon: Database, color: "#e42527", bg: "rgba(228,37,39,0.10)" };
  if (lower.includes("sales navigator"))
    return { icon: Users,    color: "#0a66c2", bg: "rgba(10,102,194,0.10)" };
  if (lower.includes("apollo"))
    return { icon: Users,    color: "#6366f1", bg: "rgba(99,102,241,0.10)" };
  if (lower.includes("hunter"))
    return { icon: Search,   color: "#f97316", bg: "rgba(249,115,22,0.10)" };
  if (lower.includes("market research") || lower.includes("scraping"))
    return { icon: BarChart2, color: "#64748b", bg: "rgba(100,116,139,0.10)" };
  if (lower.includes("brand"))
    return { icon: Star,     color: "#eab308", bg: "rgba(234,179,8,0.10)" };
  if (lower.includes("canva"))
    return { icon: Pen,      color: "#7c3aed", bg: "rgba(124,58,237,0.10)" };
  if (lower.includes("adobe") || lower.includes("illustrator"))
    return { icon: Pen,      color: "#ff0000", bg: "rgba(255,0,0,0.10)" };
  if (lower.includes("content"))
    return { icon: FileText, color: "#0ea5e9", bg: "rgba(14,165,233,0.10)" };
  if (lower.includes("copywriting"))
    return { icon: BookOpen, color: "#10b981", bg: "rgba(16,185,129,0.10)" };

  return { icon: Tag, color: "#64748b", bg: "rgba(100,116,139,0.10)" };
}

// ── Individual skill tag ───────────────────────────────────────────────────
function SkillTag({ skill, delay }: { skill: SkillItem; delay: number }) {
  const { icon: Icon, color, bg } = getSkillIconDef(skill.name);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.88, y: 6 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.05, y: -1 }}
      className="inline-flex items-center gap-1.5 cursor-default select-none
                 border border-border/70 bg-background hover:border-border
                 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium
                 text-foreground/75 hover:text-foreground
                 transition-colors duration-150"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {/* Colorful icon with tinted background */}
      <span
        className="inline-flex items-center justify-center rounded-md shrink-0"
        style={{
          background: bg,
          color,
          width: 20,
          height: 20,
        }}
      >
        <Icon size={11} strokeWidth={2.2} />
      </span>
      {skill.name}
    </motion.span>
  );
}

// ── Main section ──────────────────────────────────────────────────────────
export default function SkillsSection({ items }: { items: SkillItem[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.1 });

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    skills: items.filter((s) => cat.keywords.some((kw) => s.name.toLowerCase().includes(kw))),
  })).filter((g) => g.skills.length > 0);

  const ungrouped = items.filter((s) =>
    !CATEGORIES.some((cat) => cat.keywords.some((kw) => s.name.toLowerCase().includes(kw)))
  );
  if (ungrouped.length > 0) {
    if (grouped.length > 0) {
      grouped[grouped.length - 1].skills = [...grouped[grouped.length - 1].skills, ...ungrouped];
    } else {
      grouped.push({
        label: "Other Skills", icon: Tag,
        accent: "#64748b", accentLight: "rgba(100,116,139,0.10)", accentBorder: "rgba(100,116,139,0.20)",
        keywords: [], skills: ungrouped,
      });
    }
  }

  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {grouped.map((cat, ci) => {
        const CatIcon = cat.icon;
        return (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: ci * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative rounded-2xl bg-card border border-border overflow-hidden
                       hover:shadow-sm transition-shadow duration-300"
          >
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: cat.accent }} />

            <div className="pl-5 pr-4 pt-4 pb-4">
              {/* Category header */}
              <div className="flex items-center gap-2 mb-3.5">
                <span
                  className="inline-flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    background: cat.accentLight,
                    border: `1px solid ${cat.accentBorder}`,
                    color: cat.accent,
                    width: 28, height: 28,
                  }}
                >
                  <CatIcon size={14} strokeWidth={2.2} />
                </span>
                <span
                  className="font-heading text-[11.5px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: cat.accent }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill, si) => (
                  <SkillTag
                    key={skill.id}
                    skill={skill}
                    delay={ci * 0.08 + si * 0.025}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
