"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "motion/react";

// [N5] Stat shape — value and label are passed from parent (now DB-driven)
type StatDef = { value: number; suffix: string; label: string };

function CountUp({ to, suffix, duration = 1.4 }: { to: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

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

// [N5] Accept stats as props so the parent (page.tsx) can pass DB values
export default function AboutStats({ stats }: { stats?: StatDef[] }) {
  const defaultStats: StatDef[] = [
    { value: 5,   suffix: "+", label: "Years Experience" },
    { value: 50,  suffix: "+", label: "Projects Delivered" },
    { value: 100, suffix: "%", label: "Client Satisfaction" },
    { value: 3,   suffix: "",  label: "Industries Served" },
  ];

  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
      {displayStats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl border bg-card/60
                     backdrop-blur-sm px-4 py-5 text-center
                     hover:bg-card hover:shadow-sm transition-all duration-300"
        >
          <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
            <CountUp to={stat.value} suffix={stat.suffix} />
          </span>
          <span className="text-[11px] text-muted-foreground font-medium leading-tight mt-0.5">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
