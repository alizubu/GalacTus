"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useEffect, useState } from "react";

// ─── Fade Up ────────────────────────────────────────────────────────────────
interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  // trigger earlier on mobile: amount=0.1, no margin offset that can cut off content
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.1 });

  if (prefersReduced) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Word-by-Word Reveal ─────────────────────────────────────────────────────
interface WordRevealProps {
  text: string;
  delay?: number;
  className?: string;
  wordClassName?: string;
}

export function WordReveal({ text, delay = 0, className, wordClassName }: WordRevealProps) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.2 });
  const words = text.split(" ");

  if (prefersReduced) {
    return <div ref={ref} className={className}>{text}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", width: "100%" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", marginRight: "0.3em" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            className={wordClassName}
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.45,
              delay: delay + i * 0.07,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

// ─── Blur to Clear ───────────────────────────────────────────────────────────
interface BlurClearProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function BlurClear({ children, delay = 0, className }: BlurClearProps) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.1 });

  if (prefersReduced) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Character Scramble ──────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

interface ScrambleProps {
  text: string;
  delay?: number;
  className?: string;
  duration?: number;
}

export function ScrambleText({ text, delay = 0, className, duration = 1200 }: ScrambleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const [displayed, setDisplayed] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const startTime = performance.now() + delay * 1000;
    let raf: number;

    const tick = (now: number) => {
      if (now < startTime) { raf = requestAnimationFrame(tick); return; }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * text.length);
      const scrambled = text.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < revealedCount) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      setDisplayed(scrambled);
      if (progress < 1) { raf = requestAnimationFrame(tick); } else { setDisplayed(text); }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, text, delay, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {displayed}
    </span>
  );
}

// ─── Stagger Container ────────────────────────────────────────────────────────
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  baseDelay?: number;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, baseDelay = 0, staggerDelay = 0.1 }: StaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px", amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: baseDelay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden:   { opacity: 0, y: 20 },
        visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
    >
      {children}
    </motion.div>
  );
}
