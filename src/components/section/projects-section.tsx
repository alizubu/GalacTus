"use client";

/* eslint-disable @next/next/no-img-element */
import { DATA } from "@/data/resume";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, Clock, Tag } from "lucide-react";

function CaseStudyCard({
  project,
  index,
}: {
  project: (typeof DATA.projects)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex flex-col rounded-2xl border bg-card overflow-hidden
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {/* Top accent bar — animated on hover */}
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
        style={{
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
        }}
      />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground leading-snug text-base group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
            {project.dates && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <Clock size={11} className="text-muted-foreground/60" />
                <span className="text-xs text-muted-foreground/70 font-medium">
                  {project.dates}
                </span>
              </div>
            )}
          </div>
          {project.href && project.href !== "#" && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-1.5 rounded-lg border border-border/60 text-muted-foreground
                         hover:text-foreground hover:border-border hover:bg-muted/50
                         transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed text-justify flex-1">
          {project.description}
        </p>

        {/* Tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/40">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full
                           bg-muted/60 text-muted-foreground border border-border/40
                           hover:bg-primary/10 hover:text-primary hover:border-primary/30
                           transition-all duration-200"
              >
                <Tag size={9} />
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={headerInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="border bg-primary z-10 rounded-xl px-4 py-1 shrink-0"
            >
              <span className="text-background text-sm font-medium">Case Studies</span>
            </motion.div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-y-2 items-center text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Featured Case Studies
            </h2>
            <p className="text-muted-foreground text-base/relaxed text-balance text-center max-w-md">
              Real businesses. Real results. Data-backed strategy that made a measurable difference.
            </p>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DATA.projects.map((project, id) => (
            <CaseStudyCard key={project.title} project={project} index={id} />
          ))}
        </div>
      </div>
    </section>
  );
}
