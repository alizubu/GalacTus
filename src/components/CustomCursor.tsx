"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posX = useRef(0);
  const posY = useRef(0);
  const curX = useRef(0);
  const curY = useRef(0);
  const rafId = useRef<number>(0);

  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      posX.current = e.clientX;
      posY.current = e.clientY;
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      setHovering(
        target.closest("a, button, [role='button'], input, textarea, select, label, [tabindex]") !== null
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

    // Very light lerp — feels natural, not laggy
    const SPEED = 0.55;

    const animate = () => {
      curX.current += (posX.current - curX.current) * SPEED;
      curY.current += (posY.current - curY.current) * SPEED;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${curX.current}px, ${curY.current}px)`;
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

  // Scale: click shrinks, hover enlarges slightly
  const scale = clicking ? 0.78 : hovering ? 1.2 : 1;

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
        transition: "opacity 0.2s ease",
        willChange: "transform",
      }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          transform: `scale(${scale})`,
          transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45)) drop-shadow(0 0 1px rgba(0,0,0,0.6))",
        }}
      >
        {/* Outer arrow — white fill */}
        <path
          d="M4.5 2.5L21 12.5L13.5 14.8L10.5 22.5L4.5 2.5Z"
          fill="white"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.5"
        />
        {/* Inner shadow line for depth */}
        <path
          d="M4.5 2.5L21 12.5L13.5 14.8L10.5 22.5L4.5 2.5Z"
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
