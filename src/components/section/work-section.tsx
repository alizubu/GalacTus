/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { WorkItem } from "@/lib/portfolio-data";

// Company-specific gradient backgrounds when no logo
const COMPANY_GRADIENTS = [
  "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",   // blue
  "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",   // green
  "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)",   // orange
  "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",   // purple
  "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",   // pink
];
const COMPANY_TEXT_COLORS = ["#1d4ed8", "#15803d", "#c2410c", "#7e22ce", "#be185d"];

function CompanyInitials({ company, index = 0 }: { company: string; index?: number }) {
  const initials = company.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const idx = index % COMPANY_GRADIENTS.length;
  return (
    <div
      className="size-11 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
      style={{
        background: COMPANY_GRADIENTS[idx],
        border: "1px solid rgba(0,0,0,0.06)",
        color: COMPANY_TEXT_COLORS[idx],
        minWidth: 44,
        minHeight: 44,
      }}
    >
      {initials}
    </div>
  );
}

function LogoImage({ src, alt, index = 0 }: { src: string; alt: string; index?: number }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <CompanyInitials company={alt} index={index} />;
  return (
    <div
      className="size-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
      style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", minWidth: 44, minHeight: 44 }}
    >
      <img
        src={src} alt={alt}
        className="w-8 h-8 object-contain"
        onError={() => setErr(true)}
      />
    </div>
  );
}

export default function WorkSection({ items }: { items: WorkItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
    >
      <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border/60" aria-hidden />
      <div className="flex flex-col gap-0">
        {items.map((work, idx) => {
          const isOpen = open === work.id;
          const isCurrent = work.endDate === "Present";
          const isLast = idx === items.length - 1;

          return (
            <motion.div
              key={work.id}
              variants={{
                hidden: { opacity: 0, x: -16 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className={`relative flex gap-4 ${isLast ? "pb-0" : "pb-6"}`}
            >
              {/* Dot */}
              <div className="relative flex flex-col items-center shrink-0 mt-1" style={{ width: 36 }}>
                {isCurrent ? (
                  <span className="relative flex size-[14px]">
                    <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex size-[14px] rounded-full bg-emerald-500 ring-2 ring-background" />
                  </span>
                ) : (
                  <span className="size-[10px] rounded-full bg-muted-foreground/25 ring-2 ring-background mt-[2px]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <motion.button
                  onClick={() => setOpen(isOpen ? null : work.id)}
                  className="w-full text-left"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className={`rounded-2xl border transition-all duration-300 overflow-hidden
                    ${isOpen ? "bg-card shadow-md" : "bg-card/40 hover:bg-card/80 hover:shadow-sm"}`}>
                    <div className="p-3.5 flex items-center gap-3">
                      <LogoImage src={work.logo} alt={work.company} index={idx} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-foreground text-sm leading-none">{work.company}</span>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5 font-medium">{work.title}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground/60 tabular-nums shrink-0">
                        {work.startDate}–{work.endDate ?? "Present"}
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="desc"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="px-3.5 pb-3.5 pt-0 border-t border-border/40">
                            <p className="text-xs text-muted-foreground leading-relaxed text-justify mt-3">
                              {work.description}
                            </p>
                            {work.href && work.href !== "#" && (
                              <a href={work.href} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2.5 text-[11px] text-primary hover:underline underline-offset-4">
                                <ExternalLink size={10} />
                                Visit {work.company}
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
