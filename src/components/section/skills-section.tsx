"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

const CATEGORIES = [
  {
    label: "Paid Advertising",
    icon: "🔵",
    color: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200/60 dark:border-blue-800/40",
      header: "text-blue-600 dark:text-blue-400",
    },
    skills: [
      "Meta Ads Manager",
      "Google Ads",
      "LinkedIn Campaign Manager",
      "Email Marketing",
    ],
  },
  {
    label: "SEO & Web",
    icon: "🟢",
    color: {
      bg: "bg-teal-50 dark:bg-teal-950/40",
      text: "text-teal-700 dark:text-teal-300",
      border: "border-teal-200/60 dark:border-teal-800/40",
      header: "text-teal-600 dark:text-teal-400",
    },
    skills: ["SEO & SEM", "WordPress", "Elementor", "Webflow", "HTML & CSS"],
  },
  {
    label: "Analytics & CRM",
    icon: "🟡",
    color: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200/60 dark:border-amber-800/40",
      header: "text-amber-600 dark:text-amber-400",
    },
    skills: [
      "Google Analytics",
      "Google Tag Manager",
      "HubSpot CRM",
      "Zoho CRM",
      "LinkedIn Sales Navigator",
      "Data Scraping",
    ],
  },
  {
    label: "Design & Content",
    icon: "🟣",
    color: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200/60 dark:border-purple-800/40",
      header: "text-purple-600 dark:text-purple-400",
    },
    skills: [
      "Brand Strategy",
      "Canva",
      "Adobe Illustrator",
      "Content Strategy",
      "Copywriting",
      "Market Research",
    ],
  },
];

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="flex flex-col gap-4">
      {CATEGORIES.map((cat, ci) => (
        <motion.div
          key={cat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: ci * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`rounded-2xl border p-4 ${cat.color.bg} ${cat.color.border}`}
        >
          {/* Category header */}
          <div className={`flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-widest ${cat.color.header}`}>
            <span>{cat.icon}</span>
            {cat.label}
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill, si) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: ci * 0.1 + si * 0.04 }}
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                            border cursor-default select-none transition-shadow duration-200
                            hover:shadow-sm
                            ${cat.color.bg} ${cat.color.text} ${cat.color.border}`}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
