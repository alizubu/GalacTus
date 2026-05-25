"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  TrendingUp, Globe, BarChart2, Palette,
  Megaphone, Search, Linkedin, Mail,
  BarChart, Pen, Star, Tag, Settings,
  Database, Users, BookOpen, Layers,
} from "lucide-react";
import type { SkillItem } from "@/lib/portfolio-data";

// Category definitions — icon, colors, keywords
const CATEGORIES = [
  {
    label: "Paid Advertising",
    icon: TrendingUp,
    accent: "#3b82f6",
    accentDot: "bg-blue-500",
    keywords: ["meta ads", "google ads", "linkedin campaign", "email marketing"],
  },
  {
    label: "SEO & Web",
    icon: Globe,
    accent: "#14b8a6",
    accentDot: "bg-teal-500",
    keywords: ["seo", "sem", "wordpress", "elementor", "webflow", "html", "css"],
  },
  {
    label: "Analytics & CRM",
    icon: BarChart2,
    accent: "#f59e0b",
    accentDot: "bg-amber-500",
    keywords: ["analytics", "tag manager", "hubspot", "zoho", "sales navigator", "scraping", "apollo", "hunter"],
  },
  {
    label: "Design & Content",
    icon: Palette,
    accent: "#a855f7",
    accentDot: "bg-purple-500",
    keywords: ["brand", "canva", "adobe", "illustrator", "content", "copywriting", "market research"],
  },
];

// Map skill name keywords → lucide icon component
function getSkillIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("meta ads") || lower.includes("facebook")) return Megaphone;
  if (lower.includes("google ads")) return Search;
  if (lower.includes("linkedin")) return Linkedin;
  if (lower.includes("email")) return Mail;
  if (lower.includes("seo") || lower.includes("sem") || lower.includes("trendingup")) return TrendingUp;
  if (lower.includes("wordpress") || lower.includes("webflow") || lower.includes("web")) return Globe;
  if (lower.includes("analytics") || lower.includes("tag manager")) return BarChart;
  if (lower.includes("hubspot") || lower.includes("zoho") || lower.includes("crm")) return Database;
  if (lower.includes("sales navigator") || lower.includes("apollo") || lower.includes("hunter")) return Users;
  if (lower.includes("canva") || lower.includes("adobe") || lower.includes("illustrator")) return Pen;
  if (lower.includes("brand")) return Star;
  if (lower.includes("content") || lower.includes("copywriting")) return BookOpen;
  if (lower.includes("market research") || lower.includes("scraping")) return Search;
  if (lower.includes("elementor")) return Layers;
  if (lower.includes("html") || lower.includes("css")) return Settings;
  return Tag;
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

  // Ungrouped → append to last category or create "Other"
  const ungrouped = items.filter((s) => {
    const lower = s.name.toLowerCase();
    return !CATEGORIES.some((cat) => cat.keywords.some((kw) => lower.includes(kw)));
  });
  if (ungrouped.length > 0) {
    if (grouped.length > 0) {
      grouped[grouped.length - 1].skills = [...grouped[grouped.length - 1].skills, ...ungrouped];
    } else {
      grouped.push({
        label: "Other Skills",
        icon: Tag,
        accent: "#6b7280",
        accentDot: "bg-gray-500",
        keywords: [],
        skills: ungrouped,
      });
    }
  }

  return (
    <div ref={ref} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {grouped.map((cat, ci) => {
        const CatIcon = cat.icon;
        return (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: ci * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative rounded-2xl overflow-hidden transition-shadow duration-200
                       hover:shadow-md
                       bg-card border border-border"
            style={{ padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
              style={{ background: cat.accent }}
            />

            {/* Category header */}
            <div className="flex items-center gap-2 mb-4">
              <CatIcon
                size={18}
                style={{ color: cat.accent, flexShrink: 0 }}
                strokeWidth={2}
              />
              <span
                className="font-heading text-[12px] font-bold uppercase tracking-[0.15em]"
                style={{ color: cat.accent }}
              >
                {cat.label}
              </span>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill, si) => {
                const SkillIcon = getSkillIcon(skill.name);
                return (
                  <motion.span
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.22, delay: ci * 0.08 + si * 0.03 }}
                    className="inline-flex items-center gap-1.5 cursor-default select-none
                               transition-all duration-150
                               bg-muted/60 hover:bg-muted border border-border
                               text-foreground/80 hover:text-foreground
                               rounded-lg px-3 py-1.5 text-[13px]"
                  >
                    <SkillIcon
                      size={13}
                      className="text-muted-foreground shrink-0"
                      strokeWidth={1.8}
                    />
                    {skill.name}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
