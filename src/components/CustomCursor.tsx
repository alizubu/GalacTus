"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const rafId = useRef<number>(0);

  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ("ontouchstart" in window) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest(
          "a, button, [role='button'], input, textarea, select, label, [tabindex]"
        ) !== null;
      setHovering(isInteractive);
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

    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouseX.current}px, ${mouseY.current}px)`;
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

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        marginLeft: -10,
        marginTop: -10,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
        willChange: "transform",
      }}
    >
      {/* Outer ring — expands on hover */}
      <div
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          border: "1.5px solid currentColor",
          borderRadius: 3,
          color: "var(--foreground)",
          mixBlendMode: "difference",
          transform: `scale(${clicking ? 0.7 : hovering ? 2.2 : 1}) rotate(${hovering ? 45 : 0}deg)`,
          transition:
            "transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease",
          opacity: hovering ? 0.6 : 0.9,
        }}
      />
      {/* Inner dot — hides on hover */}
      <div
        style={{
          position: "absolute",
          width: 4,
          height: 4,
          borderRadius: 1,
          backgroundColor: "var(--foreground)",
          mixBlendMode: "difference",
          top: 8,
          left: 8,
          transform: `scale(${clicking ? 2 : hovering ? 0 : 1})`,
          transition: "transform 0.2s ease",
        }}
      />
    </div>
  );
}
