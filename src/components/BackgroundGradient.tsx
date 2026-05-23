"use client";

import { useEffect, useRef } from "react";

export default function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf: number;
    let t = 0;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Orbs config
    const orbs = [
      { x: 0.15, y: 0.15, r: 0.45, color: [99, 102, 241],  speed: 0.00018, ox: 0.08, oy: 0.06 },
      { x: 0.85, y: 0.20, r: 0.38, color: [139, 92, 246],  speed: 0.00014, ox: 0.07, oy: 0.09 },
      { x: 0.50, y: 0.85, r: 0.50, color: [16, 185, 129],  speed: 0.00010, ox: 0.10, oy: 0.05 },
      { x: 0.55, y: 0.45, r: 0.30, color: [251, 191, 36],  speed: 0.00016, ox: 0.06, oy: 0.08 },
      { x: 0.20, y: 0.70, r: 0.35, color: [59, 130, 246],  speed: 0.00012, ox: 0.09, oy: 0.07 },
    ];

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, w, h);

      orbs.forEach((orb) => {
        const cx = (orb.x + Math.sin(t * orb.speed * 1000) * orb.ox) * w;
        const cy = (orb.y + Math.cos(t * orb.speed * 800) * orb.oy) * h;
        const radius = orb.r * Math.min(w, h);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const [r, g, b] = orb.color;
        grad.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},0.07)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  );
}
