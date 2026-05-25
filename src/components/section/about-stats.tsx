"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

type StatDef = { value: number; suffix: string; label: string };

function CountUp({ to, suffix, duration = 1.2 }: { to: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  // trigger only when 50% visible so count-up starts meaningfully
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    let raf: number;
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) { raf = requestAnimationFrame(step); }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function AboutStats({ stats }: { stats?: StatDef[] }) {
  const ref = useRef(null);
  // [Bug 2] amount: 0.5 ensures the grid only triggers once fully scrolled into view,
  // naturally AFTER the about text above it has animated in.
  // An explicit delay: 0.3 adds extra buffer on mobile where both can be in viewport.
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.4 });

  const defaultStats: StatDef[] = [
    { value: 5,   suffix: "+", label: "Years Experience" },
    { value: 50,  suffix: "+", label: "Projects Delivered" },
    { value: 100, suffix: "%", label: "Client Satisfaction" },
    { value: 3,   suffix: "",  label: "Industries Served" },
  ];

  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        // [Bug 2] 0.7s delay ensures about-text animation finishes before stats appear
        delay: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {displayStats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl border bg-card/60
                     backdrop-blur-sm px-4 py-5 text-center
                     hover:bg-card hover:shadow-sm transition-all duration-300"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{
            duration: 0.45,
            delay: 0.7 + i * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
            <CountUp to={stat.value} suffix={stat.suffix} />
          </span>
          <span className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
