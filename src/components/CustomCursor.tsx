"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const rafId = useRef<number>(0);
  const posX = useRef(0);
  const posY = useRef(0);

  useEffect(() => {
    if ("ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      posX.current = e.clientX;
      posY.current = e.clientY;
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      setHovering(
        target.closest("a, button, [role='button'], input, textarea, select, label") !== null
      );
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    // Direct position — no lerp, instant
    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posX.current}px, ${posY.current}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  const scale = clicking ? 0.82 : hovering ? 1.1 : 1;

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
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease",
        willChange: "transform",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          transform: `scale(${scale})`,
          transition: "transform 0.12s ease",
          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))",
        }}
      >
        <path
          d="M4 2L18 10.5L11.5 12.5L9 19.5L4 2Z"
          fill="white"
          stroke="black"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
