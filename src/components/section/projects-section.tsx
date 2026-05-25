"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ArrowUpRight, Clock, Tag, ImageOff } from "lucide-react";
import type { ProjectItem } from "@/lib/portfolio-data";

function CaseStudyCard({ project, index }: { project: ProjectItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [imgErr, setImgErr] = useState(false);
  const hasImage = !!project.imageUrl && !imgErr;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
    >
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out shrink-0"
        style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)" }} />

      {hasImage && (
        <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-muted/30 shrink-0">
          <img src={project.imageUrl} alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgErr(true)} />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      )}

      <div className="flex flex-col gap-3 p-4 sm:p-5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground leading-snug text-sm sm:text-base group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {project.title}
            </h3>
            {project.dates && (
              <div className="flex items-center gap-1.5 mt-1">
                <Clock size={10} className="text-muted-foreground/50 shrink-0" />
                <span className="text-[11px] text-muted-foreground/60 font-medium">{project.dates}</span>
              </div>
            )}
          </div>
          {project.href && project.href !== "#" && (
            <a href={project.href} target="_blank" rel="noopener noreferrer"
              className="shrink-0 p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50 transition-all duration-200 opacity-0 group-hover:opacity-100">
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify flex-1">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-border/30">
            {project.tags.map((tech) => (
              <span key={tech}
                className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/30 hover:bg-primary/8 hover:text-primary hover:border-primary/25 transition-all duration-200">
                <Tag size={8} />
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ items }: { items: ProjectItem[] }) {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-6 sm:gap-y-8">
        <div ref={headerRef} className="flex flex-col gap-y-3 sm:gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={headerInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="border bg-primary z-10 rounded-xl px-3 sm:px-4 py-1 shrink-0"
            >
              <span className="text-background text-xs sm:text-sm font-medium">Case Studies</span>
            </motion.div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-y-1.5 items-center text-center px-2"
          >
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tighter">Featured Case Studies</h2>
            <p className="text-muted-foreground text-sm sm:text-base text-balance text-center max-w-sm sm:max-w-md">
              Real businesses. Real results. Data-backed strategy that made a measurable difference.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
          {items.map((project, id) => (
            <CaseStudyCard key={project.id} project={project} index={id} />
          ))}
        </div>
      </div>
    </section>
  );
}
