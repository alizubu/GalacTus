"use client";

import { useEffect, useRef } from "react";

// Each orb has a base position, drift range, radius, color, and independent speeds
const ORBS = [
  {
    x: 0.18, y: 0.12, r: 0.52,
    color: [99, 102, 241] as [number, number, number],   // indigo
    sx: 0.000_23, sy: 0.000_17, ox: 0.10, oy: 0.08,
    opacity: 0.22,
  },
  {
    x: 0.82, y: 0.18, r: 0.44,
    color: [168, 85, 247] as [number, number, number],   // violet
    sx: 0.000_18, sy: 0.000_21, ox: 0.08, oy: 0.10,
    opacity: 0.18,
  },
  {
    x: 0.50, y: 0.90, r: 0.55,
    color: [34, 211, 238] as [number, number, number],   // cyan
    sx: 0.000_13, sy: 0.000_09, ox: 0.11, oy: 0.06,
    opacity: 0.13,
  },
  {
    x: 0.10, y: 0.65, r: 0.38,
    color: [59, 130, 246] as [number, number, number],   // blue
    sx: 0.000_15, sy: 0.000_19, ox: 0.09, oy: 0.07,
    opacity: 0.14,
  },
  {
    x: 0.70, y: 0.55, r: 0.35,
    color: [236, 72, 153] as [number, number, number],   // pink accent
    sx: 0.000_20, sy: 0.000_14, ox: 0.07, oy: 0.09,
    opacity: 0.09,
  },
];

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

    // Offscreen buffer for smooth compositing
    const offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
    const offCtx = offscreen.getContext("2d")!;

    const onResize = () => {
      w = canvas.width = offscreen.width = window.innerWidth;
      h = canvas.height = offscreen.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const draw = () => {
      t += 0.4; // smooth tick increment

      // Clear with very slight trail for motion blur effect
      offCtx.clearRect(0, 0, w, h);

      ORBS.forEach((orb) => {
        // Figure-8 / Lissajous-like path for each orb
        const cx = (orb.x + Math.sin(t * orb.sx * 1000) * orb.ox) * w;
        const cy = (orb.y + Math.cos(t * orb.sy * 1000) * orb.oy) * h;
        const radius = orb.r * Math.min(w, h);

        const [r, g, b] = orb.color;
        const grad = offCtx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0,   `rgba(${r},${g},${b},${orb.opacity})`);
        grad.addColorStop(0.35, `rgba(${r},${g},${b},${orb.opacity * 0.55})`);
        grad.addColorStop(0.7,  `rgba(${r},${g},${b},${orb.opacity * 0.15})`);
        grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

        offCtx.fillStyle = grad;
        offCtx.beginPath();
        offCtx.arc(cx, cy, radius, 0, Math.PI * 2);
        offCtx.fill();
      });

      // Blit offscreen → main canvas
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(offscreen, 0, 0);

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* Canvas orbs */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* Subtle noise texture overlay for depth */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.018,
        }}
      />

      {/* Radial vignette — darkens edges slightly for depth */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.12) 100%)",
        }}
      />
    </>
  );
}
