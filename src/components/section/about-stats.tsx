"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "motion/react";

const STATS = [
  { value: 5,   suffix: "+", label: "Years Experience" },
  { value: 50,  suffix: "+", label: "Projects Delivered" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
  { value: 3,   suffix: "",  label: "Industries Served" },
];

function CountUp({ to, suffix, duration = 1.4 }: { to: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * to);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function AboutStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
      {STATS.map((stat) => (
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
