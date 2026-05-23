"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const trailX = useRef(0);
  const trailY = useRef(0);
  const rafId = useRef<number>(0);

  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ("ontouchstart" in window) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      if (!visible) setVisible(true);

      // Move dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Detect interactive elements
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a, button, [role='button'], input, textarea, select, label") !== null;
      const isTextEl =
        !isInteractive &&
        (target.closest("p, span, h1, h2, h3, h4, h5, h6, li, blockquote") !== null ||
          window.getComputedStyle(target).cursor === "text");

      setHovering(isInteractive);
      setIsText(isTextEl);
    };

    const onMouseDown = () => setClicking(true);
    const onMouseUp = () => setClicking(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    // Trailing ring animation loop
    const animate = () => {
      const lag = 0.12;
      trailX.current += (mouseX.current - trailX.current) * lag;
      trailY.current += (mouseY.current - trailY.current) * lag;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${trailX.current}px, ${trailY.current}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  // Don't render on server
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  const dotScale = clicking ? 0.8 : hovering ? 0 : 1;
  const ringScale = clicking ? 0.8 : hovering ? 1.5 : isText ? 0.4 : 1;

  return (
    <>
      {/* Small solid dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "white",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 99999,
          marginLeft: -4,
          marginTop: -4,
          opacity: visible ? 1 : 0,
          transform: "translate(0px, 0px)",
          scale: String(dotScale),
          transition: "opacity 0.3s ease, scale 0.15s ease",
          willChange: "transform",
        }}
      />

      {/* Large trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid white",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 99998,
          marginLeft: -16,
          marginTop: -16,
          opacity: visible ? 1 : 0,
          transform: "translate(0px, 0px)",
          scale: String(ringScale),
          transition: "opacity 0.3s ease, scale 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform",
        }}
      />
    </>
  );
}
