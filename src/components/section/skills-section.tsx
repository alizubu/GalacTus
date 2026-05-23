"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const CATEGORIES = [
  {
    label: "Paid Advertising",
    accent: "#3b82f6",          // blue-500
    accentBg: "rgba(59,130,246,0.07)",
    accentBorder: "rgba(59,130,246,0.18)",
    accentText: "#2563eb",
    accentTextDark: "#93c5fd",
    dot: "bg-blue-500",
    skills: ["Meta Ads Manager","Google Ads","LinkedIn Campaign Manager","Email Marketing"],
  },
  {
    label: "SEO & Web",
    accent: "#14b8a6",          // teal-500
    accentBg: "rgba(20,184,166,0.07)",
    accentBorder: "rgba(20,184,166,0.18)",
    accentText: "#0f766e",
    accentTextDark: "#5eead4",
    dot: "bg-teal-500",
    skills: ["SEO & SEM","WordPress","Elementor","Webflow","HTML & CSS"],
  },
  {
    label: "Analytics & CRM",
    accent: "#f59e0b",          // amber-500
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.18)",
    accentText: "#b45309",
    accentTextDark: "#fcd34d",
    dot: "bg-amber-500",
    skills: ["Google Analytics","Google Tag Manager","HubSpot CRM","Zoho CRM","LinkedIn Sales Navigator","Data Scraping"],
  },
  {
    label: "Design & Content",
    accent: "#a855f7",          // purple-500
    accentBg: "rgba(168,85,247,0.07)",
    accentBorder: "rgba(168,85,247,0.18)",
    accentText: "#7e22ce",
    accentTextDark: "#d8b4fe",
    dot: "bg-purple-500",
    skills: ["Brand Strategy","Canva","Adobe Illustrator","Content Strategy","Copywriting","Market Research"],
  },
];

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CATEGORIES.map((cat, ci) => (
        <motion.div
          key={cat.label}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: ci * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="group relative rounded-2xl overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}
        >
          {/* Left accent bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
            style={{ background: cat.accent }}
          />

          <div className="pl-5 pr-4 pt-4 pb-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: cat.accentText }}
              >
                {cat.label}
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill, si) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.25, delay: ci * 0.08 + si * 0.035 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  className="inline-flex items-center rounded-full text-[11px] font-medium
                             px-2.5 py-[5px] cursor-default select-none
                             transition-all duration-200"
                  style={{
                    background: cat.accentBg,
                    border: `1px solid ${cat.accentBorder}`,
                    color: cat.accentText,
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
