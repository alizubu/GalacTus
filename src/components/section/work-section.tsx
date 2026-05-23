/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { DATA } from "@/data/resume";
import { ChevronDown, MapPin, Calendar, ExternalLink } from "lucide-react";

function CompanyInitials({ company }: { company: string }) {
  const initials = company
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="size-10 rounded-xl border bg-muted flex items-center justify-center shrink-0 font-bold text-sm text-muted-foreground ring-2 ring-border/40">
      {initials}
    </div>
  );
}

function LogoImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <CompanyInitials company={alt} />;
  return (
    <img
      src={src}
      alt={alt}
      className="size-10 rounded-xl border bg-card p-1.5 object-contain shrink-0 ring-2 ring-border/40"
      onError={() => setErr(true)}
    />
  );
}

export default function WorkSection() {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-3"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {DATA.work.map((work) => {
        const isOpen = open === work.company;
        const isCurrent = work.end === "Present";

        return (
          <motion.div
            key={work.company}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden
              ${isOpen ? "bg-card shadow-md" : "bg-card/50 hover:bg-card hover:shadow-sm"}`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : work.company)}
              className="w-full text-left p-4 flex items-center gap-3"
            >
              <LogoImage src={work.logoUrl} alt={work.company} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground text-sm leading-none">
                    {work.company}
                  </span>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{work.title}</p>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[11px] text-muted-foreground/70 tabular-nums flex items-center gap-1">
                  <Calendar size={10} />
                  {work.start} – {work.end ?? "Present"}
                </span>
                {work.location && (
                  <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                    <MapPin size={9} />
                    {work.location}
                  </span>
                )}
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="shrink-0 ml-1"
              >
                <ChevronDown size={15} className="text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-4 pb-4 pt-0 border-t border-border/40">
                    <p className="text-sm text-muted-foreground leading-relaxed text-justify mt-3">
                      {work.description}
                    </p>
                    {work.href && work.href !== "#" && (
                      <a
                        href={work.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline underline-offset-4"
                      >
                        <ExternalLink size={11} />
                        Visit {work.company}
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
